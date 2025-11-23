import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProcessingResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for structured context extraction
const contextExtractionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    entities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, description: "e.g., Person, Location, Concept, Event" }
        }
      }
    },
    relationships: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING, description: "Must match an entity name" },
          target: { type: Type.STRING, description: "Must match an entity name" },
          relation: { type: Type.STRING, description: "e.g., lives in, works on, happened at" }
        }
      }
    },
    vectorCoordinates: {
      type: Type.OBJECT,
      description: "Abstract 2D coordinates representing semantic meaning for visualization. Scale -100 to 100.",
      properties: {
        x: { type: Type.NUMBER },
        y: { type: Type.NUMBER },
        category: { type: Type.STRING, description: "High level cluster name" }
      }
    },
    summary: { type: Type.STRING }
  },
  required: ["entities", "relationships", "vectorCoordinates", "summary"]
};

export const processContextInput = async (input: string): Promise<ProcessingResult | null> => {
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this user input for the ShadowSync Context Engine. 
      Extract key entities, relationships for a knowledge graph, and generate pseudo-vector coordinates (-100 to 100) based on semantic meaning.
      Input: "${input}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: contextExtractionSchema,
        temperature: 0.1 // Low temperature for consistent extraction
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);
    
    return {
      entities: data.entities || [],
      relationships: data.relationships || [],
      vector: data.vectorCoordinates || { x: 0, y: 0, category: 'General' },
      summary: data.summary || ""
    };

  } catch (error) {
    console.error("Gemini processing error:", error);
    return null;
  }
};

export const queryAgent = async (query: string, contextSummary: string): Promise<string> => {
  if (!apiKey) return "I cannot connect to the intelligence layer (Missing API Key).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are ShadowSync, an AI with persistent distributed memory. 
        Use the provided CONTEXT LOG to answer the user's query. 
        If the answer isn't in the context, admit it but try to infer from what you know.
        Be concise, technical, and helpful.`,
      },
      contents: `CONTEXT LOG:
      ${contextSummary}
      
      USER QUERY:
      ${query}`
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Agent query error:", error);
    return "Error querying the agent.";
  }
};
