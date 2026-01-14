// Deno-compatible import handling for Supabase functions
// @ts-expect-error Deno import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-expect-error Deno import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderRequest {
  plan: "pro" | "ultra";
  email: string;
  userId?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plan, email, userId }: OrderRequest = await req.json();

    if (!plan || !email) {
      console.error("Missing required fields:", { plan, email });
      return new Response(
        JSON.stringify({ error: "Missing required fields: plan and email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials not configured");
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Define pricing (in smallest currency unit - cents for USD)
    const pricing = {
      pro: 500, // $5.00
      ultra: 1000, // $10.00
    };

    const amount = pricing[plan];
    if (!amount) {
      console.error("Invalid plan:", plan);
      return new Response(
        JSON.stringify({ error: "Invalid plan selected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Creating Razorpay order for ${plan} plan, amount: ${amount} cents`);

    // Create Razorpay order
    const orderData = {
      amount: amount, // Razorpay expects amount in smallest currency unit
      currency: "USD",
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan: plan,
        email: email,
      },
    };

    const authString = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error("Razorpay API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to create payment order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const order = await razorpayResponse.json();
    console.log("Razorpay order created:", order.id);

    // Store the order in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await supabase.from("subscriptions").insert({
      user_id: userId || null,
      user_email: email,
      plan: plan,
      razorpay_order_id: order.id,
      amount: amount,
      currency: "USD",
      status: "pending",
    });

    if (dbError) {
      console.error("Database error:", dbError);
      // Continue anyway, payment can still proceed
    }

    return new Response(
      JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: RAZORPAY_KEY_ID,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to create order" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
