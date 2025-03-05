import z from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";

const categorySysPrompt = `
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

const searchSysPrompt = `You are a specialized search assistant designed to find relevant URLs from a given list based on a provided search string. The list contains URL strings, each with a title and a URL. Your task is to search for the most relevant URLs based on the search string, which can match the title, the URL, or the context that can be inferred from the titles of the URLs.
Instructions:
Input Format:
A list of URL strings, where each string contains a title and a URL.
A search string.
Output Format:
A list of URLs that are most relevant to the search string, along with their titles.
The results should be ranked by relevance, with the most relevant URLs appearing first.
Search Criteria:
The search string can match the title, the URL, or the context inferred from the titles.
Use a combination of exact matches, partial matches, and contextual relevance to determine the best results.
If the search string is ambiguous, make an educated guess based on the context provided by the titles.
Example:
Input:
List of URLs:
["Title: AI and Machine Learning - URL: https://example.com/ai",
 "Title: Deep Learning Tutorials - URL: https://example.com/deep-learning",
 "Title: Python Programming - URL: https://example.com/python",
 "Title: Data Science Basics - URL: https://example.com/data-science"]
Search String: "machine learning"
Output:
["Title: AI and Machine Learning - URL: https://example.com/ai",
 "Title: Deep Learning Tutorials - URL: https://example.com/deep-learning"]
Guidelines:
Prioritize exact matches and partial matches in the titles and URLs.
Consider the context and relevance of the titles when determining the best matches.
If no exact matches are found, provide the most contextually relevant results.
Start the search process.`;

const geminiModels = [
  { model: "gemini-2.0-flash-exp", name: "Gemini 2.0", tag: "gemini" },
];

const categorySchema = z.array(
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

const searchSchema = z.array(
  z.object({
    url: z.string(),
    title: z.string(),
    match: z.number().describe("The match percentage"),
  })
);

async function categorizeByAI({
  geminiModel = geminiModels[0].model,
  messages,
}: {
  geminiModel?: string;
  messages: string;
}) {
  const model = createGoogleGenerativeAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });
  const gemini = model(geminiModel, { structuredOutputs: true });

  return generateObject({
    model: gemini,
    system: categorySysPrompt,
    schema: categorySchema,
    messages: [
      { role: "system", content: categorySysPrompt },
      { role: "user", content: messages },
    ],
  });
}

async function searchByAI({
  geminiModel = geminiModels[0].model,
  tabList,
  searchString,
}: {
  geminiModel?: string;
  tabList: string;
  searchString: string;
}) {
  const model = createGoogleGenerativeAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });
  const gemini = model(geminiModel, { structuredOutputs: true });

  const message = `This is the list of tabs: \`${tabList}\`, this is the search string: \`${searchString}\`.`;

  return generateObject({
    model: gemini,
    system: searchSysPrompt,
    schema: searchSchema,
    messages: [
      { role: "system", content: searchSysPrompt },
      { role: "user", content: message },
    ],
  });
}

export default { categorizeByAI, geminiModels, searchByAI };
