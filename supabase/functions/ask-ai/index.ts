import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()

    // Check for API Key
    const apiKey = Deno.env.get('KIMI_API_KEY')
    if (!apiKey) {
      throw new Error('Missing KIMI_API_KEY environment variable. Please set it using `supabase secrets set KIMI_API_KEY=your_key`')
    }

    if (!query) {
      return new Response(
        JSON.stringify({ keywords: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      )
    }

    // Call Moonshot AI API
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "moonshot-v1-8k",
            messages: [
                {
                    role: "system",
                    content: "You are a search query optimizer. Given a user query, extract 3-5 specific keywords or short phrases that are most likely to appear in the title or URL of relevant web pages. Return ONLY a JSON array of strings. Do not include explanations or markdown code blocks."
                },
                {
                    role: "user",
                    content: query
                }
            ],
            temperature: 0.3
        })
    })

    if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Moonshot API Error: ${response.status} ${errorData}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || "[]"

    // Parse the response
    let keywords: string[] = []
    try {
        // Remove markdown code blocks if present (```json ... ```) and clean up
        const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim()
        keywords = JSON.parse(jsonString)
    } catch (e) {
        console.error("Failed to parse keywords JSON", e)
        // Fallback: simplistic split if JSON fails, though prompt instructs JSON
        keywords = content.split(/[\s,]+/).filter((w: string) => w.length > 2)
    }

    return new Response(
      JSON.stringify({ keywords }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )
  }
})
