import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { toolName, inputs, outputs } = await req.json();

    const inputSummary = Object.entries(inputs || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    const outputSummary = Object.entries(outputs || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!anthropicKey) {
      const explanation = `Your ${toolName} results show: ${outputSummary}. These values were calculated based on your inputs (${inputSummary}). Adjust the inputs to explore different scenarios.`;
      return new Response(JSON.stringify({ explanation }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `You are a helpful analytical assistant. Briefly explain what these ${toolName} results mean in plain English (2-3 sentences max). Inputs: ${inputSummary}. Results: ${outputSummary}.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const explanation = data?.content?.[0]?.text || `Your ${toolName} results: ${outputSummary}.`;

    return new Response(JSON.stringify({ explanation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
