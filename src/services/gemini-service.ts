import z from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";

const systemPrompt = `
You are a highly efficient and accurate URL categorization expert. Your task is to analyze a given URL and its title and assign it to the most appropriate category from a predefined list.
**Instructions:**
1.  **Input:** You will receive a URL and its title in the following format:
    {
    url: string;
    title: string;
    }
2.  **Categories:**  Choose the *single* best category from the following list:
    *   News
    *   Technology
    *   Sports
    *   Entertainment
    *   Business/Finance
    *   Education
    *   Health/Fitness
    *   Travel
    *   Food/Cooking
    *   Shopping/E-commerce
    *   Social Media
    *   Government/Politics
    *   Other
3.  **Output:**  Respond with *only* the category name.  Do not include any explanations or additional text.
For example, \`"News": [{title: "News Title", url: "https://example.com"}, {title: "News Title 2", url: "https://example2.com"}]\`.

**Important Considerations:**
*   Prioritize the title for categorization, but use the URL to confirm or clarify if the title is ambiguous.
*   If the URL and title suggest multiple categories, choose the *most dominant* or *primary* category.
*   If none of the categories are appropriate, use "Other".
*   Be concise and accurate.  Your goal is speed and precision.
This is the list of urls in JSON string:`;

const geminiModels = [
  { model: "gemini-2.0-flash-exp", name: "Gemini 2.0", tag: "gemini" },
];

const schema = z.array(
  z.object({
    category: z.string(),
    urls: z.array(
      z.object({
        url: z.string(),
        title: z.string(),
      })
    ),
  })
);

async function chat({
  geminiModel = geminiModels[0].model,
  messages,
}: {
  geminiModel?: string;
  messages: string;
}) {
  console.log("🚀 . messages:", typeof messages, messages);
  const model = createGoogleGenerativeAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });
  const gemini = model(geminiModel, { structuredOutputs: true });

  return generateObject({
    model: gemini,
    system: systemPrompt,
    schema,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: messages },
    ],
  });
}

export default { chat, geminiModels };
