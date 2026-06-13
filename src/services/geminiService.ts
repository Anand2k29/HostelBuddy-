import { GoogleGenAI } from "@google/genai";
import { IssueCategory, IssuePriority } from '../types';

export const WEEKLY_MENU_DATABASE = {
  Monday: {
    Breakfast: { name: 'Breakfast', time: '07:30 - 09:00 AM', items: ['Idli Sambar', 'Coconut Chutney', 'Boiled Eggs / Banana', 'Tea / Coffee / Milk'] },
    Lunch: { name: 'Lunch', time: '12:30 - 02:00 PM', items: ['Steamed Rice', 'Dal Tadka', 'Alu Gobi Sukha', 'Chapatis', 'Curd & Salad'] },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Veg Samosa (2 pcs)', 'Green Chutney', 'Tea / Coffee'] },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Jeera Rice', 'Kadhi Pakora', 'Bhindi Fry', 'Chapatis', 'Rice Kheer'] }
  },
  Tuesday: {
    Breakfast: { name: 'Breakfast', time: '07:30 - 09:00 AM', items: ['Aloo Paratha', 'Chilled Curd & Pickle', 'Butter', 'Tea / Coffee / Milk'] },
    Lunch: { name: 'Lunch', time: '12:30 - 02:00 PM', items: ['Veg Dum Biryani', 'Onion Raita', 'Mirchi Ka Salan', 'Roasted Papad'] },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Onion Pakoda', 'Tomato Ketchup', 'Tea / Coffee'] },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Plain Rice', 'Paneer Butter Masala', 'Dal Makhani', 'Butter Roti', 'Gulab Jamun (1 pc)'] }
  },
  Wednesday: {
    Breakfast: { name: 'Breakfast', time: '07:30 - 09:00 AM', items: ['Indori Poha', 'Sev & Onion', 'Jalebi', 'Tea / Coffee / Milk'] },
    Lunch: { name: 'Lunch', time: '12:30 - 02:00 PM', items: ['Steamed Rice', 'Punjabi Rajma Masala', 'Aloo Gajar', 'Tandoori Roti', 'Spiced Buttermilk'] },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Grilled Veg Sandwich', 'Potato Chips', 'Tea / Coffee'] },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Steamed Rice', 'Egg Curry / Paneer Bhurji', 'Moong Dal', 'Chapatis', 'Vanilla Ice Cream'] }
  },
  Thursday: {
    Breakfast: { name: 'Breakfast', time: '07:30 - 09:00 AM', items: ['Veg Uttapam', 'Coconut & Tomato Chutney', 'Fruits', 'Tea / Coffee / Milk'] },
    Lunch: { name: 'Lunch', time: '12:30 - 02:00 PM', items: ['Jeera Rice', 'Yellow Dal Fry', 'Mix Veg Curry', 'Chapatis', 'Boondi Raita'] },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Dhokla with Mustard & Chilli', 'Imli Chutney', 'Tea / Coffee'] },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Veg Pulao', 'Malai Kofta Curry', 'Dal Lasuni', 'Butter Naan', 'Fruit Custard'] }
  },
  Friday: {
    Breakfast: { name: 'Breakfast', time: '07:30 - 09:00 AM', items: ['Puri (4 pcs)', 'Alu Tomato Curry', 'Suji Halwa', 'Tea / Coffee / Milk'] },
    Lunch: { name: 'Lunch', time: '12:30 - 02:00 PM', items: ['Steamed Rice', 'Sambhar & Rasam', 'Potato Fry (South Style)', 'Chapatis', 'Curd'] },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Aloo Bonda', 'Mint Chutney', 'Tea / Coffee'] },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Veg Fried Rice', 'Veg Manchurian Gravy', 'Spring Rolls', 'Chocolate Ice Cream'] }
  },
  Saturday: {
    Breakfast: { name: 'Breakfast', time: '07:30 - 09:00 AM', items: ['Chole Bhature', 'Sweet Lassi', 'Pickle & Salad', 'Tea / Coffee'] },
    Lunch: { name: 'Lunch', time: '12:30 - 02:00 PM', items: ['Steamed Rice', 'Dal Palak', 'Jeera Aloo', 'Chapatis', 'Butter Milk'] },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Sweet Cookies / Biscuits', 'Salted Peanuts', 'Tea / Coffee'] },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Plain Rice', 'Shahi Paneer', 'Dal Fry', 'Butter Roti', 'Bengali Rasgulla'] }
  },
  Sunday: {
    Breakfast: { name: 'Breakfast', time: '08:00 - 09:30 AM', items: ['Masala Dosa', 'Sambar & Chutney Duo', 'Boiled Eggs / Apple', 'Tea / Coffee / Milk'] },
    Lunch: { name: 'Lunch', time: '12:30 - 02:30 PM', items: ['Veg Thali Special', 'Shahi Kaju Curry', 'Veg Pulao', 'Dal Tadka', 'Butter Naan', 'Gulab Jamun'] },
    Snacks: { name: 'Snacks', time: '05:00 - 06:00 PM', items: ['Atta Maggi with Veggies', 'Tea / Coffee / Cold Coffee'] },
    Dinner: { name: 'Dinner', time: '07:30 - 09:00 PM', items: ['Steamed Rice', 'Sev Tomato Curry', 'Yellow Dal', 'Chapatis', 'Fresh Fruits'] }
  }
};

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to check for day keywords
const getDayFromQuery = (q: string): string => {
  const query = q.toLowerCase();
  if (query.includes('monday')) return 'Monday';
  if (query.includes('tuesday')) return 'Tuesday';
  if (query.includes('wednesday')) return 'Wednesday';
  if (query.includes('thursday')) return 'Thursday';
  if (query.includes('friday')) return 'Friday';
  if (query.includes('saturday')) return 'Saturday';
  if (query.includes('sunday')) return 'Sunday';
  
  if (query.includes('today')) {
    return DAYS_OF_WEEK[new Date().getDay()];
  }
  if (query.includes('tomorrow')) {
    return DAYS_OF_WEEK[(new Date().getDay() + 1) % 7];
  }
  if (query.includes('yesterday')) {
    return DAYS_OF_WEEK[(new Date().getDay() + 6) % 7];
  }
  return '';
};

// Helper to check for meal keywords
const getMealFromQuery = (q: string): string => {
  const query = q.toLowerCase();
  if (query.includes('breakfast')) return 'Breakfast';
  if (query.includes('lunch')) return 'Lunch';
  if (query.includes('snack') || query.includes('tea')) return 'Snacks';
  if (query.includes('dinner')) return 'Dinner';
  return '';
};

const isOpenRouterKey = (key: string) => {
  return key.startsWith('sk-or-') || key.startsWith('sk-');
};

export const analyzeIssueWithAI = async (description: string, apiKey: string) => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini");
    return null;
  }

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

  if (isOpenRouterKey(apiKey)) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "HostelBuddy"
        },
        body: JSON.stringify({
          model: "google/gemma-2-9b-it:free",
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) return null;

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      
      return JSON.parse(jsonStr) as { category: IssueCategory, priority: IssuePriority, summary: string };
    } catch (error) {
      console.error("OpenRouter analysis failed, trying fallback:", error);
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct:free",
            messages: [
              { role: "user", content: prompt }
            ]
          })
        });
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (!text) return null;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        return JSON.parse(jsonStr) as { category: IssueCategory, priority: IssuePriority, summary: string };
      } catch (innerError) {
        console.error("OpenRouter fallback analysis failed:", innerError);
        return null;
      }
    }
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
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
  const lastUserMessage = messages[messages.length - 1]?.text || '';
  const queryLower = lastUserMessage.toLowerCase();

  // 1. Intercept for Mess Menu pre-entries!
  const matchedDay = getDayFromQuery(queryLower);
  const matchedMeal = getMealFromQuery(queryLower);

  if (queryLower.includes('menu') || queryLower.includes('food') || queryLower.includes('mess') || queryLower.includes('breakfast') || queryLower.includes('lunch') || queryLower.includes('dinner') || queryLower.includes('snack')) {
    const day = matchedDay || DAYS_OF_WEEK[new Date().getDay()];
    const menuForDay = WEEKLY_MENU_DATABASE[day as keyof typeof WEEKLY_MENU_DATABASE];
    
    if (menuForDay) {
      // If specific meal requested
      if (matchedMeal) {
        const mealInfo = menuForDay[matchedMeal as keyof typeof menuForDay];
        return `📜 **${day}'s ${matchedMeal} Special Scroll:**\n\n` + 
               mealInfo.items.map(item => `  • ${item}`).join('\n') + 
               `\n\n⏰ *Kitchen Serving Hours:* ${mealInfo.time}`;
      } else {
        // Return full day's menu
        return `📜 **Full Menu Scroll for ${day}:**\n\n` + 
               `🍳 **Breakfast** (${menuForDay.Breakfast.time}):\n` +
               menuForDay.Breakfast.items.map(i => `  • ${i}`).join('\n') + `\n\n` +
               `🍲 **Lunch** (${menuForDay.Lunch.time}):\n` +
               menuForDay.Lunch.items.map(i => `  • ${i}`).join('\n') + `\n\n` +
               `🍿 **Snacks** (${menuForDay.Snacks.time}):\n` +
               menuForDay.Snacks.items.map(i => `  • ${i}`).join('\n') + `\n\n` +
               `🍖 **Dinner** (${menuForDay.Dinner.time}):\n` +
               menuForDay.Dinner.items.map(i => `  • ${i}`).join('\n');
      }
    }
  }

  // 2. Offline Fallback simulation (if API key missing)
  if (!apiKey) {
    await new Promise(resolve => setTimeout(resolve, 800)); // simulate typing delay
    
    if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
      return "Greetings, traveler! I am the Hostel Librarian Villager AI. Ask me about mess menus, gate passes, anti-ragging, or draft an issue report with my parchment system!";
    }
    if (queryLower.includes('gate') || queryLower.includes('pass') || queryLower.includes('outpass')) {
      return "You can apply for a digital Gate Pass under the **Gate Pass** section in your menu. Once approved by the Admin, you'll receive a secure QR code to scan at the main gate when entering or leaving.";
    }
    if (queryLower.includes('wifi') || queryLower.includes('internet')) {
      return "WiFi issues? I can draft a ticket for you! Would you like me to write a formal report? E.g., 'Dear Admin, the WiFi on the 3rd floor is extremely slow, affecting online classes. Please look into it.' You can copy this and paste it on the **Report Issue** page.";
    }
    if (queryLower.includes('ragging') || queryLower.includes('harass')) {
      return "HostelBuddy has a zero-tolerance policy for ragging. If you or anyone else is facing issues, please head to the **Anti-Ragging Cell** tab immediately or call the 24/7 National Anti-Ragging Helpline at 1800-180-5522.";
    }
    if (queryLower.includes('roommate') || queryLower.includes('friend')) {
      return "Looking for a roommate who shares your sleep schedule or dietary preferences? Check out our new **Roommate Finder** in the sidebar. Fill out a quick 4-question profile to match with others!";
    }
    return "Hmmn? That's an interesting question! I am running in local mock scribe mode because no Gemini API key is configured. If you set `VITE_API_KEY` in your environment, I can answer any general questions with live AI intelligence!";
  }

  const systemInstruction = `
    You are HostelBuddy AI Scribe, designed in the style of a wise Minecraft Librarian Villager. 
    You speak with a touch of game lore (using words like 'scrolls', 'emeralds', 'overlords' for admins, 'travelers' for students, 'tomes' for rules, 'quests' for complaints).
    You are helpful, polite, and witty.
    
    You have access to the hostel's official weekly mess menu data:
    ${JSON.stringify(WEEKLY_MENU_DATABASE, null, 2)}
    
    Timings: Breakfast (7:30-9:00 AM, Sun: 8:00-9:30 AM), Lunch (12:30-2:00 PM, Sun: 12:30-2:30 PM), Snacks (5:00-6:00 PM), Dinner (7:30-9:00 PM).
    
    You answer questions about hostel rules, outpasses, lost and found, and general hostel life. Keep your responses practical and formatted with clean markdown.
  `;

  // 3. OpenRouter Execution
  if (isOpenRouterKey(apiKey)) {
    try {
      const formattedMessages = [
        { role: "system", content: systemInstruction },
        ...messages.map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text
        }))
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "HostelBuddy"
        },
        body: JSON.stringify({
          model: "google/gemma-2-9b-it:free",
          messages: formattedMessages
        })
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      return text || "Hmm. I couldn't read that scroll. Try again?";
    } catch (error) {
      console.error("OpenRouter chat failed, attempting fallback:", error);
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct:free",
            messages: [
              { role: "system", content: systemInstruction },
              ...messages.map(m => ({
                role: m.role === 'model' ? 'assistant' : 'user',
                content: m.text
              }))
            ]
          })
        });
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        return text || "Hmm. My parchment transmission broke. Try again?";
      } catch (innerErr) {
        console.error("OpenRouter fallback chat failed:", innerErr);
        return "Oops! My redstone repeater disconnected from my AI core. Please try again.";
      }
    }
  }

  // 4. Live AI Execution (Gemini API SDK)
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
        systemInstruction: systemInstruction
      }
    });
    return response.text || "Hmm. I couldn't read that scroll. Try again?";
  } catch (error) {
    console.error("Gemini chat failed:", error);
    return "Oops! My redstone repeater disconnected from my AI core. Please try again.";
  }
};