import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TOOL_KEYWORDS: Record<string, string[]> = {
  "mortgage-calculator": ["mortgage", "home loan", "house payment", "buy house"],
  "compound-interest-calculator": ["investment", "savings growth", "compound", "interest"],
  "budget-planner": ["budget", "expenses", "spending", "monthly plan"],
  "retirement-savings-calculator": ["retire", "retirement", "401k", "pension"],
  "bmi-calculator": ["bmi", "body mass", "weight", "overweight"],
  "calorie-needs-estimator": ["calories", "tdee", "diet", "nutrition", "lose weight"],
  "break-even-analysis": ["break even", "startup", "business launch", "profitability"],
  "profit-margin-calculator": ["profit margin", "business profit", "revenue"],
  "roi-calculator": ["roi", "return on investment"],
  "fuel-cost-estimator": ["fuel", "gas", "road trip", "travel"],
  "trip-budget-planner": ["travel", "vacation", "trip budget"],
  "inflation-calculator": ["inflation", "purchasing power", "prices"],
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const q = (query || "").toLowerCase();

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!anthropicKey) {
      const matched: string[] = [];
      for (const [slug, keywords] of Object.entries(TOOL_KEYWORDS)) {
        if (keywords.some((kw) => q.includes(kw))) {
          matched.push(slug);
        }
      }
      return new Response(JSON.stringify({ tools: matched.slice(0, 5) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const availableTools = Object.keys(TOOL_KEYWORDS).join(", ");
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: `Given this user goal: "${query}", which of these tool slugs are most relevant? Available: ${availableTools}. Return only a JSON array of up to 5 slugs, nothing else.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data?.content?.[0]?.text || "[]";
    const match = text.match(/\[.*?\]/s);
    const tools = match ? JSON.parse(match[0]) : [];

    return new Response(JSON.stringify({ tools }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err), tools: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
