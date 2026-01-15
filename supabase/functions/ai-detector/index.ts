import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SentenceAnalysis {
  text: string;
  score: number;
  flags: string[];
}

interface DetectionResult {
  overallScore: number;
  verdict: "human" | "mixed" | "ai";
  confidence: number;
  sentenceAnalysis: SentenceAnalysis[];
  patterns: {
    name: string;
    description: string;
    severity: "low" | "medium" | "high";
  }[];
  summary: string;
}

// AI detection patterns and heuristics
const AI_PATTERNS = [
  { pattern: /\b(furthermore|moreover|additionally|consequently|nevertheless)\b/gi, name: "Formal Transitions", severity: "medium" as const },
  { pattern: /\b(it is (worth noting|important to note|essential to understand))\b/gi, name: "Hedging Phrases", severity: "high" as const },
  { pattern: /\b(in (conclusion|summary)|to (summarize|conclude))\b/gi, name: "Explicit Conclusions", severity: "medium" as const },
  { pattern: /\b(this (demonstrates|illustrates|highlights|suggests|indicates))\b/gi, name: "Demonstrative Language", severity: "medium" as const },
  { pattern: /\b(plays a (crucial|vital|key|important|significant) role)\b/gi, name: "Cliché Phrases", severity: "high" as const },
  { pattern: /\b(in today'?s (world|society|age|era))\b/gi, name: "Generic Temporals", severity: "high" as const },
  { pattern: /\b(has (become|evolved|emerged|transformed))\b/gi, name: "Evolution Language", severity: "low" as const },
  { pattern: /\b(various|numerous|countless|myriad)\s+(aspects|factors|elements|ways)\b/gi, name: "Vague Quantifiers", severity: "medium" as const },
  { pattern: /\b(it is (clear|evident|obvious) that)\b/gi, name: "Assertive Phrases", severity: "medium" as const },
  { pattern: /\b(the (importance|significance|impact|role) of)\b/gi, name: "Abstract Importance", severity: "low" as const },
];

function analyzeSentences(text: string): SentenceAnalysis[] {
  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  return sentences.map(sentence => {
    const trimmed = sentence.trim();
    if (!trimmed) return null;
    
    let score = 0;
    const flags: string[] = [];
    
    // Check each pattern
    for (const { pattern, name, severity } of AI_PATTERNS) {
      const matches = trimmed.match(pattern);
      if (matches) {
        const weight = severity === "high" ? 20 : severity === "medium" ? 12 : 6;
        score += weight * matches.length;
        if (!flags.includes(name)) flags.push(name);
      }
    }
    
    // Check sentence structure patterns
    const words = trimmed.split(/\s+/);
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    
    // AI tends to use longer words consistently
    if (avgWordLength > 6) {
      score += 8;
      flags.push("High vocabulary complexity");
    }
    
    // Check for perfect punctuation and capitalization
    if (/^[A-Z].*[.!?]$/.test(trimmed) && !/[,;:]/.test(trimmed) === false) {
      score += 3;
    }
    
    // Normalize score to 0-100
    score = Math.min(100, Math.max(0, score));
    
    return {
      text: trimmed,
      score,
      flags
    };
  }).filter(Boolean) as SentenceAnalysis[];
}

function detectPatterns(text: string): DetectionResult["patterns"] {
  const detectedPatterns: DetectionResult["patterns"] = [];
  
  for (const { pattern, name, severity } of AI_PATTERNS) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      detectedPatterns.push({
        name,
        description: `Found ${matches.length} instance(s): "${matches.slice(0, 2).join('", "')}"${matches.length > 2 ? '...' : ''}`,
        severity
      });
    }
  }
  
  // Additional pattern checks
  const sentences = text.split(/[.!?]+/).filter(s => s.trim());
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
  
  if (avgSentenceLength > 20 && avgSentenceLength < 30) {
    detectedPatterns.push({
      name: "Uniform Sentence Length",
      description: `Average sentence length of ${avgSentenceLength.toFixed(1)} words suggests AI consistency`,
      severity: "medium"
    });
  }
  
  // Check for lack of contractions (AI often avoids them)
  const contractionRatio = (text.match(/\b(n't|'s|'re|'ve|'ll|'d|'m)\b/g) || []).length / sentences.length;
  if (contractionRatio < 0.1 && text.length > 200) {
    detectedPatterns.push({
      name: "Formal Style (No Contractions)",
      description: "Text avoids contractions, which is common in AI-generated content",
      severity: "low"
    });
  }
  
  return detectedPatterns.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });
}

function calculateOverallScore(sentenceAnalysis: SentenceAnalysis[], patterns: DetectionResult["patterns"]): number {
  if (sentenceAnalysis.length === 0) return 0;
  
  // Base score from sentence analysis
  const avgSentenceScore = sentenceAnalysis.reduce((sum, s) => sum + s.score, 0) / sentenceAnalysis.length;
  
  // Pattern bonus
  let patternBonus = 0;
  for (const pattern of patterns) {
    patternBonus += pattern.severity === "high" ? 8 : pattern.severity === "medium" ? 5 : 2;
  }
  
  const totalScore = avgSentenceScore * 0.7 + Math.min(patternBonus, 30);
  
  return Math.min(100, Math.max(0, Math.round(totalScore)));
}

function generateSummary(score: number, patterns: DetectionResult["patterns"], sentenceCount: number): string {
  if (score >= 70) {
    return `This text shows strong indicators of AI generation. ${patterns.length} distinct patterns were detected across ${sentenceCount} sentences. The writing style exhibits typical AI characteristics including formal language, consistent structure, and common AI phrases.`;
  } else if (score >= 40) {
    return `This text shows mixed signals. While some sentences appear human-written, others contain AI-like patterns. This could indicate AI-assisted writing or heavily edited AI content. ${patterns.length} potential AI patterns were identified.`;
  } else {
    return `This text appears to be primarily human-written. The writing style shows natural variation and personal voice. Only ${patterns.length} minor patterns were flagged, which can occur in human writing as well.`;
  }
}

// @ts-expect-error - Deno namespace is available in the runtime environment
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (text.trim().split(/\s+/).length < 30) {
      return new Response(
        JSON.stringify({ error: "Text must be at least 30 words for accurate detection" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Perform analysis
    const sentenceAnalysis = analyzeSentences(text);
    const patterns = detectPatterns(text);
    const overallScore = calculateOverallScore(sentenceAnalysis, patterns);
    
    // Determine verdict
    let verdict: "human" | "mixed" | "ai";
    if (overallScore >= 70) {
      verdict = "ai";
    } else if (overallScore >= 40) {
      verdict = "mixed";
    } else {
      verdict = "human";
    }

    // Calculate confidence based on text length and pattern count
    const wordCount = text.trim().split(/\s+/).length;
    let confidence = 70;
    if (wordCount > 100) confidence += 10;
    if (wordCount > 200) confidence += 10;
    if (patterns.length > 3) confidence += 5;
    confidence = Math.min(98, confidence);

    const result: DetectionResult = {
      overallScore,
      verdict,
      confidence,
      sentenceAnalysis: sentenceAnalysis.slice(0, 20), // Limit to first 20 sentences
      patterns,
      summary: generateSummary(overallScore, patterns, sentenceAnalysis.length)
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("AI Detector error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to analyze text" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
