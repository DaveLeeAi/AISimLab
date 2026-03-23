import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function calculate(slug: string, inputs: Record<string, number>): Record<string, number> | null {
  const v = (n: number) => inputs[`f${n}`] ?? 0;

  switch (slug) {
    case "mortgage-calculator": {
      const principal = v(1) - v(2);
      const r = v(3) / 100 / 12;
      const n = v(4) * 12;
      const payment = r === 0 ? principal / n : principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      return { o1: payment, o2: payment * n - principal, o3: payment * n + v(2), o4: principal };
    }
    case "compound-interest-calculator": {
      const amount = v(1) * Math.pow(1 + v(3) / 100 / v(4), v(4) * v(2));
      return { o1: amount, o2: amount - v(1), o3: ((amount - v(1)) / v(1)) * 100 };
    }
    case "bmi-calculator": {
      const bmi = v(2) > 0 ? (v(1) / (v(2) * v(2))) * 703 : 0;
      return { o1: Math.round(bmi * 10) / 10, o2: bmi < 18.5 ? 1 : bmi < 25 ? 2 : bmi < 30 ? 3 : 4 };
    }
    case "break-even-analysis": {
      const margin = v(3) - v(2);
      const units = margin > 0 ? Math.ceil(v(1) / margin) : 0;
      return { o1: units, o2: units * v(3), o3: margin };
    }
    case "profit-margin-calculator": {
      const gross = v(1) > 0 ? ((v(1) - v(2)) / v(1)) * 100 : 0;
      const net = v(1) > 0 ? ((v(1) - v(2) - v(3)) / v(1)) * 100 : 0;
      return { o1: gross, o2: net, o3: v(1) - v(2) - v(3) };
    }
    default:
      return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    const slug = parts[parts.length - 1];

    const authHeader = req.headers.get("Authorization");
    const apiKey = authHeader?.replace("Bearer ", "");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: keyData } = await supabase
      .from("api_keys")
      .select("*")
      .eq("key", apiKey)
      .maybeSingle();

    if (!keyData) {
      return new Response(JSON.stringify({ error: "Invalid API key" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const limit = keyData.plan === "pro" ? 10000 : 100;
    if ((keyData.requests_today || 0) >= limit) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const inputs: Record<string, number> = body.inputs || {};
    const outputs = calculate(slug, inputs);

    if (!outputs) {
      return new Response(JSON.stringify({ error: `Tool '${slug}' not found` }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase
      .from("api_keys")
      .update({
        requests_today: (keyData.requests_today || 0) + 1,
        total_requests: (keyData.total_requests || 0) + 1,
      })
      .eq("key", apiKey);

    return new Response(JSON.stringify({ tool: slug, outputs }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
