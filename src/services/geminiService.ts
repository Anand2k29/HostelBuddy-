import { GoogleGenAI } from "@google/genai";
import { IssueCategory, IssuePriority } from '../../../types';

export const analyzeIssueWithAI = async (description: string, apiKey: string) => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Analyze the following hostel issue description provided by a student.
      Determine the most appropriate CATEGORY from: [WIFI, PLUMBING, ELECTRICAL, FURNITURE, CLEANING, OTHER].
      Determine the PRIORITY from: [LOW, MEDIUM, HIGH, CRITICAL] based on urgency and impact.
      Provide a brief 1-sentence summary.
      
      Description: "${description}"
      
      Respond STRICTLY in this JSON format:
      {
        "category": "CATEGORY_NAME",
        "priority": "PRIORITY_LEVEL",
        "summary": "Brief summary here"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as { category: IssueCategory, priority: IssuePriority, summary: string };

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return null;
  }
};