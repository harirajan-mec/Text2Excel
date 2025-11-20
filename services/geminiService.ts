import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractDataFromText = async (text: string): Promise<ExtractedData> => {
  try {
    // Define the expected schema for the output
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        filename: {
          type: Type.STRING,
          description: "A short, descriptive filename for the excel file (without extension), e.g., 'sales_report_q1'.",
        },
        summary: {
          type: Type.STRING,
          description: "A brief 1-sentence summary of the data extracted.",
        },
        columns: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "The headers/column names for the tabular data.",
        },
        rows: {
          type: Type.ARRAY,
          items: {
            type: Type.ARRAY,
            items: { type: Type.STRING }, // Using string to be safe, but Gemini often handles mix well in JSON
            description: "The data rows corresponding to the columns. Ensure all rows have the same length as columns.",
          },
          description: "The list of rows containing the data.",
        },
      },
      required: ["filename", "columns", "rows"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Analyze the following text and extract any structured data found within it into a clean, tabular format suitable for an Excel spreadsheet.
        
        Instructions:
        1. Identify the main entities and attributes described in the text.
        2. Create meaningful column headers (e.g., "Date", "Product Name", "Amount", "Status").
        3. Standardize dates to ISO format (YYYY-MM-DD) if possible, or keep as legible string.
        4. Ensure every row has a value for every column (use empty string or null if missing).
        5. Generate a concise filename based on the content.
        
        Input Text:
        """
        ${text}
        """
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Low temperature for more deterministic data extraction
      },
    });

    if (!response.text) {
      throw new Error("No response received from Gemini.");
    }

    const parsedData = JSON.parse(response.text) as ExtractedData;
    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};