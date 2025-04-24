import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import * as tf from "npm:@tensorflow/tfjs@4.15.0";

// Enhanced CORS headers with specific methods and headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
};

interface PredictionMetrics {
  predictedPrice: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  accuracyScore: number;
}

// Properly handle OPTIONS requests for CORS
async function handleRequest(req: Request) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      throw new Error(`HTTP method ${req.method} is not supported.`);
    }

    // Parse and validate request body
    const body = await req.json().catch(() => {
      throw new Error('Failed to parse request body as JSON');
    });

    const { symbol, currentPrice, aiScore } = body;
    
    if (!symbol || !currentPrice || aiScore === undefined) {
      throw new Error('Missing required fields: symbol, currentPrice, and aiScore are required');
    }

    // Validate environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Fetch historical data
    const { data: historicalData, error: historyError } = await supabaseClient
      .from('historical_predictions')
      .select('*')
      .eq('stock_symbol', symbol)
      .order('prediction_date', { ascending: true })
      .limit(100); // Limit data to prevent memory issues

    if (historyError) {
      throw new Error(`Failed to fetch historical data: ${historyError.message}`);
    }

    if (!historicalData || historicalData.length === 0) {
      throw new Error('No historical data available for prediction');
    }

    // Train model and generate predictions with error handling
    let model;
    try {
      model = await trainModel(historicalData);
    } catch (error) {
      throw new Error(`Model training failed: ${error.message}`);
    }

    let predictions;
    try {
      predictions = await Promise.all([
        generatePrediction(model, currentPrice, aiScore, historicalData, 1),
        generatePrediction(model, currentPrice, aiScore, historicalData, 7),
        generatePrediction(model, currentPrice, aiScore, historicalData, 30)
      ]);
    } catch (error) {
      throw new Error(`Prediction generation failed: ${error.message}`);
    } finally {
      if (model) model.dispose();
    }

    const [oneDayPred, oneWeekPred, oneMonthPred] = predictions;

    // Update predictions table
    const { error: updateError } = await supabaseClient
      .from('predictions')
      .upsert({
        stock_symbol: symbol,
        one_day: oneDayPred.predictedPrice,
        one_week: oneWeekPred.predictedPrice,
        one_month: oneMonthPred.predictedPrice,
        accuracy_score: Math.round((oneDayPred.accuracyScore + oneWeekPred.accuracyScore + oneMonthPred.accuracyScore) / 3),
        confidence_level: oneDayPred.confidenceLevel,
        created_at: new Date().toISOString()
      });

    if (updateError) {
      throw new Error(`Failed to store predictions: ${updateError.message}`);
    }

    // Store historical predictions
    const now = new Date();
    const historicalPredictions = [
      {
        stock_symbol: symbol,
        predicted_price: oneDayPred.predictedPrice,
        prediction_date: now.toISOString(),
        target_date: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        prediction_type: 'one_day',
        accuracy_score: oneDayPred.accuracyScore
      },
      {
        stock_symbol: symbol,
        predicted_price: oneWeekPred.predictedPrice,
        prediction_date: now.toISOString(),
        target_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        prediction_type: 'one_week',
        accuracy_score: oneWeekPred.accuracyScore
      },
      {
        stock_symbol: symbol,
        predicted_price: oneMonthPred.predictedPrice,
        prediction_date: now.toISOString(),
        target_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        prediction_type: 'one_month',
        accuracy_score: oneMonthPred.accuracyScore
      }
    ];

    const { error: historyError2 } = await supabaseClient
      .from('historical_predictions')
      .insert(historicalPredictions);

    if (historyError2) {
      console.error('Error storing historical predictions:', historyError2);
    }

    // Return response with predictions
    return new Response(
      JSON.stringify({
        oneDay: {
          price: oneDayPred.predictedPrice,
          accuracy: oneDayPred.accuracyScore,
          confidence: oneDayPred.confidenceLevel
        },
        oneWeek: {
          price: oneWeekPred.predictedPrice,
          accuracy: oneWeekPred.accuracyScore,
          confidence: oneWeekPred.confidenceLevel
        },
        oneMonth: {
          price: oneMonthPred.predictedPrice,
          accuracy: oneMonthPred.accuracyScore,
          confidence: oneMonthPred.confidenceLevel
        }
      }),
      {
        headers: corsHeaders,
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in prediction function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : 'Unknown error'
      }),
      {
        headers: corsHeaders,
        status: 400,
      }
    );
  } finally {
    // Clean up TensorFlow memory
    try {
      tf.disposeVariables();
    } catch (error) {
      console.error('Error disposing TensorFlow variables:', error);
    }
  }
}

// Simplified model training with better error handling
async function trainModel(historicalData: any[]): Promise<tf.LayersModel> {
  if (!Array.isArray(historicalData) || historicalData.length < 10) {
    throw new Error('Insufficient historical data for training');
  }

  try {
    const windowSize = 5; // Reduced window size to minimize memory usage
    const features = [];
    const labels = [];

    for (let i = windowSize; i < historicalData.length; i++) {
      const window = historicalData.slice(i - windowSize, i);
      features.push([
        window.map(d => d.predicted_price || 0),
        window.map(d => d.accuracy_score || 50)
      ]);
      labels.push([historicalData[i].predicted_price || 0]);
    }

    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
      inputShape: [windowSize, 2]
    }));
    
    model.add(tf.layers.flatten());
    
    model.add(tf.layers.dense({
      units: 1,
      activation: 'linear'
    }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });

    const xs = tf.tensor3d(features);
    const ys = tf.tensor2d(labels);

    await model.fit(xs, ys, {
      epochs: 10, // Reduced epochs to minimize processing time
      batchSize: 32,
      shuffle: true,
      validationSplit: 0.1
    });

    // Clean up tensors
    xs.dispose();
    ys.dispose();

    return model;
  } catch (error) {
    throw new Error(`Model training failed: ${error.message}`);
  }
}

// Simplified prediction generation
async function generatePrediction(
  model: tf.LayersModel,
  currentPrice: number,
  aiScore: number,
  historicalData: any[],
  days: number
): Promise<PredictionMetrics> {
  try {
    const windowSize = 5;
    if (historicalData.length < windowSize) {
      throw new Error('Insufficient historical data for prediction');
    }

    const window = historicalData.slice(-windowSize);
    const input = tf.tensor3d([[
      window.map(d => d.predicted_price || currentPrice),
      window.map(d => d.accuracy_score || aiScore)
    ]]);

    const prediction = model.predict(input) as tf.Tensor;
    const predictedPrice = prediction.dataSync()[0];

    // Simple confidence calculation
    const confidenceScore = Math.min(aiScore / 100, 1);
    
    let confidenceLevel: 'low' | 'medium' | 'high';
    if (confidenceScore >= 0.7) confidenceLevel = 'high';
    else if (confidenceScore >= 0.4) confidenceLevel = 'medium';
    else confidenceLevel = 'low';

    const accuracyScore = Math.round(confidenceScore * 100);

    // Clean up tensors
    prediction.dispose();
    input.dispose();

    return {
      predictedPrice: parseFloat(predictedPrice.toFixed(2)),
      confidenceLevel,
      accuracyScore
    };
  } catch (error) {
    throw new Error(`Prediction generation failed: ${error.message}`);
  }
}

// Main handler using Deno.serve
Deno.serve(async (req) => {
  return await handleRequest(req);
});