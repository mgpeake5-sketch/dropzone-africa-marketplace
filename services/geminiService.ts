
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Using mock data.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getStyleSuggestion = async (sneakerName: string): Promise<string> => {
  if (!API_KEY) {
    return new Promise(resolve => setTimeout(() => resolve(`For the ${sneakerName}, try a monochrome look. Pair them with black slim-fit joggers and a slightly oversized black hoodie. This lets the sneaker's silhouette stand out. For a pop of contrast, a crisp white graphic tee underneath would complete the outfit. This is a mock response because the API key is not configured.`), 1000));
  }
  
  try {
    const prompt = `You are a world-class fashion stylist specializing in sneaker culture. Provide a concise, stylish, and actionable outfit suggestion for someone wearing the "${sneakerName}". Keep it to one paragraph. Focus on a clean, modern aesthetic.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        // FIX: The `generateContent` API uses the `contents` property for the prompt.
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching style suggestion from Gemini:", error);
    return `Could not generate a style suggestion for ${sneakerName} at this time. Please try again later.`;
  }
};
