// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Plan limits (words per month)
const PLAN_LIMITS = {
  free: 5000,
  pro: 50000,
  ultra: Infinity, // Unlimited
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Get user from auth header
  const authHeader = req.headers.get('authorization');
  let userId: string | null = null;
  let userPlan: 'free' | 'pro' | 'ultra' = 'free';

  if (authHeader) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id || null;

    // Get user's plan
    if (userId) {
      const adminClient = createClient(supabaseUrl, supabaseServiceKey);
      const { data: profile } = await adminClient
        .from('profiles')
        .select('subscribed_plan')
        .eq('id', userId)
        .maybeSingle();

      if (profile?.subscribed_plan) {
        userPlan = profile.subscribed_plan as 'free' | 'pro' | 'ultra';
      }
    }
  }

  try {
    const { text, level, style, model } = await req.json();

    if (!text || text.trim().length === 0) {
      throw new Error("Text is required");
    }

    const wordsCount = text.trim().split(/\s+/).length;

    // Check usage limits for authenticated users
    if (userId) {
      const adminClient = createClient(supabaseUrl, supabaseServiceKey);

      // Get current month's usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: usageData } = await adminClient
        .from('usage_logs')
        .select('words_count')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString());

      const currentUsage = usageData?.reduce((sum: number, log: any) => sum + (log.words_count || 0), 0) || 0;
      const planLimit = PLAN_LIMITS[userPlan];

      console.log(`User ${userId} (${userPlan}): ${currentUsage}/${planLimit} words used`);

      if (planLimit !== Infinity && currentUsage + wordsCount > planLimit) {
        const remaining = Math.max(0, planLimit - currentUsage);
        return new Response(JSON.stringify({
          error: `Monthly limit reached. You have ${remaining} words remaining this month. Upgrade your plan for more words.`,
          limitReached: true,
          currentUsage,
          planLimit,
          remaining,
          plan: userPlan
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      // For non-authenticated users, apply a per-request limit
      if (wordsCount > 200) {
        return new Response(JSON.stringify({
          error: "Free users are limited to 200 words per request. Please sign up for more!",
          requiresAuth: true
        }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Validate level access
    if (level === 'pro' && userPlan === 'free') {
      return new Response(JSON.stringify({
        error: "Pro mode requires a Pro or Ultra subscription.",
        requiresUpgrade: true,
        requiredPlan: 'pro'
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (level === 'ultra' && userPlan !== 'ultra') {
      return new Response(JSON.stringify({
        error: "Ultra mode requires an Ultra subscription.",
        requiresUpgrade: true,
        requiredPlan: 'ultra'
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Model selection based on plan
    let selectedModel = "google/gemini-2.5-flash"; // default
    if (model && userPlan !== 'free') {
      const allowedModels = [
        "google/gemini-2.5-flash",
        "google/gemini-2.5-pro",
        "openai/gpt-5-mini",
      ];
      if (userPlan === 'ultra') {
        allowedModels.push("openai/gpt-5", "google/gemini-2.5-flash-lite");
      }
      if (allowedModels.includes(model)) {
        selectedModel = model;
      }
    }

    // Build the system prompt based on humanization level and writing style
    const levelInstructions = {
      lite: "Make minimal changes to the text while making it sound more natural and human-written. Keep the original structure and most vocabulary intact.",
      pro: "Moderately rewrite the text to sound more natural and human. Vary sentence structure, use more conversational language, and add natural transitions.",
      ultra: "Completely transform the text to sound authentically human-written. Use varied vocabulary, natural speech patterns, contractions, and conversational flow. Make it undetectable as AI-generated."
    };

    const styleInstructions = {
      general: "Use a balanced, neutral tone suitable for any audience.",
      academic: "Maintain an academic and scholarly tone with proper terminology, formal language, and citation-ready formatting.",
      business: "Use professional business language with clear, concise communication appropriate for corporate settings.",
      creative: "Employ creative and engaging language with vivid descriptions and expressive word choices.",
      casual: "Use a friendly, relaxed tone with conversational language and informal expressions."
    };

    const systemPrompt = `You are an expert text humanizer. Your task is to rewrite AI-generated or robotic-sounding text to make it sound naturally human-written.

Humanization Level: ${level?.toUpperCase() || 'PRO'}
${levelInstructions[level as keyof typeof levelInstructions] || levelInstructions.pro}

Writing Style: ${style?.toUpperCase() || 'GENERAL'}
${styleInstructions[style as keyof typeof styleInstructions] || styleInstructions.general}

IMPORTANT RULES:
1. Preserve the original meaning and key information
2. Do NOT add disclaimers, notes, or explanations
3. Do NOT mention that you've rewritten or humanized the text
4. Output ONLY the humanized text, nothing else
5. Maintain the approximate length of the original text
6. Use natural variations in sentence length
7. Include appropriate transitions between ideas
8. Avoid overused AI phrases like "dive into", "in conclusion", "it's important to note"`;

    console.log(`Humanizing text with level: ${level}, style: ${style}, model: ${selectedModel}, words: ${wordsCount}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please humanize the following text:\n\n${text}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "raw_ai_result",
              description: "Return the humanized text with an estimated human score",
              parameters: {
                type: "object",
                properties: {
                  humanizedText: {
                    type: "string",
                    description: "The humanized version of the input text"
                  },
                  humanScore: {
                    type: "number",
                    description: "Estimated probability (0-100) that the text would be classified as human-written by AI detectors. Higher is better."
                  },
                  improvements: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of 2-3 key improvements made to the text"
                  }
                },
                required: ["humanizedText", "humanScore", "improvements"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "raw_ai_result" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please check your account." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();

    // Parse tool call response
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "raw_ai_result") {
      throw new Error("Invalid response format from AI");
    }

    const result = JSON.parse(toolCall.function.arguments);
    const { humanizedText, humanScore, improvements } = result;

    if (!humanizedText) {
      throw new Error("No humanized text in response");
    }

    // Log usage if user is authenticated
    if (userId) {
      const adminClient = createClient(supabaseUrl, supabaseServiceKey);

      await adminClient.from('usage_logs').insert({
        user_id: userId,
        words_count: wordsCount,
      });
      console.log(`Logged ${wordsCount} words for user ${userId}`);
    }

    console.log("Successfully humanized text with score:", humanScore);

    return new Response(JSON.stringify({
      humanizedText,
      humanScore: Math.min(100, Math.max(0, humanScore)),
      improvements,
      wordsUsed: wordsCount,
      model: selectedModel
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in raw-ai function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});