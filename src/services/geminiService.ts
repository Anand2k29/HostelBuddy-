import { GoogleGenAI } from "@google/genai";
import { IssueCategory, IssuePriority } from '../types';

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
      model: 'gemini-2.5-flash',
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

export const chatWithAI = async (
  messages: { role: 'user' | 'model'; text: string }[],
  apiKey: string
) => {
  if (!apiKey) {
    // Elegant fallback simulation
    const lastUserMessage = messages[messages.length - 1]?.text.toLowerCase() || '';
    await new Promise(resolve => setTimeout(resolve, 800)); // simulate typing delay
    
    if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi')) {
      return "Hi there! I'm HostelBuddy AI, your virtual campus companion. How can I help you today? You can ask me about mess timings, gate pass rules, or even ask me to help you write an issue report!";
    }
    if (lastUserMessage.includes('mess') || lastUserMessage.includes('food') || lastUserMessage.includes('dinner')) {
      return "The hostel mess timings are: Breakfast (7:30 AM - 9:00 AM), Lunch (12:30 PM - 2:00 PM), Snacks (5:00 PM - 6:00 PM), and Dinner (7:30 PM - 9:00 PM). Check out our new **Mess Menu** tab to see today's menu and leave your feedback!";
    }
    if (lastUserMessage.includes('gate') || lastUserMessage.includes('pass') || lastUserMessage.includes('outpass')) {
      return "You can apply for a digital Gate Pass under the **Gate Pass** section in your menu. Once approved by the Admin, you'll receive a secure QR code to scan at the main gate when entering or leaving.";
    }
    if (lastUserMessage.includes('wifi') || lastUserMessage.includes('internet')) {
      return "WiFi issues? I can draft a ticket for you! Would you like me to write a formal report? E.g., 'Dear Admin, the WiFi on the 3rd floor is extremely slow, affecting online classes. Please look into it.' You can copy this and paste it on the **Report Issue** page.";
    }
    if (lastUserMessage.includes('ragging') || lastUserMessage.includes('harass')) {
      return "HostelBuddy has a zero-tolerance policy for ragging. If you or anyone else is facing issues, please head to the **Anti-Ragging Cell** tab immediately or call the 24/7 National Anti-Ragging Helpline at 1800-180-5522.";
    }
    if (lastUserMessage.includes('roommate') || lastUserMessage.includes('friend')) {
      return "Looking for a roommate who shares your sleep schedule or dietary preferences? Check out our new **Roommate Finder** in the sidebar. Fill out a quick 4-question profile to match with others!";
    }
    return "That's an interesting question! I am running in mock mode because no Gemini API key is configured. If you set `VITE_API_KEY` in your environment, I can answer any general questions with live AI intelligence!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const contents = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: "You are HostelBuddy AI, a helpful, polite, and witty AI assistant for hostel students. You answer questions about hostel rules, mess schedules, report issue drafting, lost and found, and general hostel life. Keep your responses helpful, practical, and relatively concise. You can help write formal complaints or suggest troubleshooting steps."
      }
    });
    return response.text || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini chat failed:", error);
    return "Oops! I encountered an error while communicating with my AI brain. Please try again.";
  }
};