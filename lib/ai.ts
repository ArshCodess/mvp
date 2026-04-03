"use server"
import { GoogleGenAI } from "@google/genai";

// In-memory cache for command responses
const commandCache = new Map<string, unknown>();

export async function giveCommand(command: string) {
  // Check if command exists in cache
  if (commandCache.has(command)) {
    console.log("Returning cached response for command:", command);
    return commandCache.get(command);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: command,
      config: {
        systemInstruction: `You are EventlyAi. Extract event details from the user's command into a single JSON object matching this Zod schema:
            title: string (1-200 chars)
            description: string
            date: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
            location: string
            category: string
            imageUrl: valid URL or ""
            capacity: integer (min 0, 0=unlimited)
            highlights: {id: string, text: string}[]
            rewards: {id: string, icon: enum[🏆,🎁,📜,🤝,🎓,🍕,👕,💡,🌟,🎤], title: string, description: string}[]
            links: {id: string, label: string, url: string, type: enum[WHATSAPP, MEET, ZOOM, DISCORD, YOUTUBE, OTHER]}[]
            IMPORTANT:Provide ONLY the JSON object. No prose or markdown blocks.
            If information is missing, use "" for strings, 0 for capacity, and [] for arrays.
            Ensure the date is a valid ISO string.`,
      },
    });
    console.log(response.text);
    if (response.text) {
      try {
        const eventData = JSON.parse(response.text);
        // Cache the result
        commandCache.set(command, eventData);
        return eventData;
      } catch (error) {
        console.error("Error parsing AI response:", error);
        return null;
      }
    }

  } catch (error) {
    console.error("Error giving command to AI:", error);
  }
}