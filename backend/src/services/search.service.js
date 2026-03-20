import { TavilySearch } from "@langchain/tavily";

const tavilyTool = new TavilySearch({
    apiKey: process.env.TAVILY_API_KEY,
    maxResults: 5,
    searchDepth: 'basic',
});


export async function searchContent({ query }) {

    const response = await tavilyTool.invoke({ query });

    if (!response?.results?.length) return "No data found";

    return JSON.stringify(response);
}