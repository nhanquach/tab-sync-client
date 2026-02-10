# AI Search Setup Guide

This guide explains how to set up the "Search with AI" feature, which uses Kimi AI (Moonshot) to generate smart search keywords from natural language queries.

## Architecture

1.  **Frontend (`src/pages/Home.tsx`):** Captures user input and toggles "AI Search" mode.
2.  **Supabase Client (`src/clients/supabaseClient.ts`):** Calls the `ask-ai` Edge Function.
3.  **Edge Function (`supabase/functions/ask-ai/index.ts`):**
    *   Securely holds the `KIMI_API_KEY`.
    *   Sends the user query to Moonshot AI.
    *   Returns a list of extracted keywords.
4.  **Database Query:** The frontend uses the returned keywords to perform an `OR` query against the `open_tabs` and `archived_tabs` tables.

## Prerequisites

*   [Supabase CLI](https://supabase.com/docs/guides/cli) installed and logged in.
*   A Moonshot AI (Kimi) API Key.

## Deployment Steps

### 1. Set the API Key Secret

Run the following command in your terminal to store your API key securely in Supabase. This ensures it is never exposed to the client.

```bash
supabase secrets set KIMI_API_KEY=your_moonshot_api_key_here
```

### 2. Deploy the Edge Function

Deploy the `ask-ai` function to your Supabase project.

```bash
supabase functions deploy ask-ai
```

### 3. Verify Deployment

You can test the function using the Supabase Dashboard or curl:

```bash
curl --request POST 'https://your-project-ref.supabase.co/functions/v1/ask-ai' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"query":"funny cat videos"}'
```

It should return:
```json
{
  "keywords": ["funny", "cat", "videos", "youtube"]
}
```

## Troubleshooting

*   **CORS Errors:** Ensure the `ask-ai` function includes the correct CORS headers (already included in the code).
*   **"Missing KIMI_API_KEY":** Double-check that you ran the `supabase secrets set` command.
*   **Empty Results:** If the AI returns no keywords, the search will fall back to the original search string.

## Security Note

The `KIMI_API_KEY` is only accessible within the server-side Edge Function environment. The client only receives the generated keywords, keeping your API usage secure and controllable.
