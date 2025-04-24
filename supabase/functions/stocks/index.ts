import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Use multiple API keys to handle rate limiting
const API_KEYS = [
  "3KOFMQJZDPNBA2BB",
  "IGXZ0OGJWK9SPZRK",
  "D4X8BGXVNY9XVJB2",
  "RNXK9LVNJ2BXMY7P"
];

let currentKeyIndex = 0;

// Add delay between API calls to avoid rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAlphaVantageData(symbol: string) {
  const maxRetries = API_KEYS.length;
  let attempts = 0;
  let lastError = null;

  while (attempts < maxRetries) {
    try {
      const apiKey = API_KEYS[currentKeyIndex];
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
        {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Supabase Edge Function'
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check for API limit message
      if (data.Note || data["Error Message"]) {
        console.log(`API key ${currentKeyIndex} rate limited or error, trying next key...`);
        lastError = new Error(data.Note || data["Error Message"]);
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        attempts++;
        await delay(1000);
        continue;
      }

      if (!data["Global Quote"] || Object.keys(data["Global Quote"]).length === 0) {
        throw new Error("No quote data available");
      }

      const quote = data["Global Quote"];
      
      return {
        price: parseFloat(quote["05. price"]) || 0,
        change: parseFloat(quote["09. change"]) || 0,
        percentChange: parseFloat(quote["10. change percent"].replace('%', '')) || 0,
        volume: parseInt(quote["06. volume"]) || 0,
        marketCap: 0,
      };
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed for ${symbol}:`, error);
      lastError = error;
      currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
      attempts++;
      await delay(1000);
    }
  }
  
  throw new Error(`Failed to fetch stock data for ${symbol} after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { symbol } = await req.json();
    
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: "Symbol is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // First, check if the stock exists in the database
    const { data: existingStock, error: fetchError } = await supabaseClient
      .from("stocks")
      .select("*")
      .eq("symbol", symbol)
      .single();

    if (fetchError) {
      return new Response(
        JSON.stringify({ error: `Stock ${symbol} not found in database` }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch real-time data
    let stockData;
    try {
      stockData = await fetchAlphaVantageData(symbol);
    } catch (error) {
      console.error("Error fetching real-time data:", error);
      // Fallback to database values
      stockData = {
        price: existingStock.price || 0,
        change: existingStock.change || 0,
        percentChange: existingStock.percent_change || 0,
        volume: existingStock.volume || 0,
        marketCap: existingStock.market_cap || 0,
      };
    }

    // Update stock data in database
    const { error: updateError } = await supabaseClient
      .from("stocks")
      .update({
        price: stockData.price,
        change: stockData.change,
        percent_change: stockData.percentChange,
        volume: stockData.volume,
        updated_at: new Date().toISOString(),
      })
      .eq("symbol", symbol);

    if (updateError) {
      console.error("Error updating stock data:", updateError);
    }

    // Generate and store predictions
    try {
      const baseUrl = supabaseUrl.replace(/\/$/, '');
      const predictionResponse = await fetch(`${baseUrl}/functions/v1/predict`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          symbol,
          currentPrice: stockData.price,
          aiScore: existingStock.ai_score
        }),
      });

      if (!predictionResponse.ok) {
        throw new Error(`Failed to generate predictions: ${predictionResponse.statusText}`);
      }
    } catch (predictionError) {
      console.error("Error generating predictions:", predictionError);
    }

    return new Response(JSON.stringify(stockData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in stocks function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined
      }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});