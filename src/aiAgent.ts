import { supabase } from './supabaseClient';

export interface HotelContext {
  hotelName: string;
  wifiName: string;
  wifiPass: string;
  breakfastHours: string;
  checkoutTime: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const DEFAULT_CONTEXT: HotelContext = {
  hotelName: 'AlpineStay',
  wifiName: 'AlpineStay_Guest',
  wifiPass: 'alpine2026',
  breakfastHours: '7:00 AM – 10:30 AM',
  checkoutTime: '11:00 AM',
};

export async function getHotelContext(userLang: string = 'en'): Promise<HotelContext> {
  try {
    const { data, error } = await supabase
      .from('hotel_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error || !data) return DEFAULT_CONTEXT;

    return {
      hotelName: data.hotel_name || DEFAULT_CONTEXT.hotelName,
      wifiName: data.wifi_name || DEFAULT_CONTEXT.wifiName,
      wifiPass: data.wifi_password || DEFAULT_CONTEXT.wifiPass,
      checkoutTime: data.checkout_time || DEFAULT_CONTEXT.checkoutTime,
      breakfastHours: data.breakfast_hours || DEFAULT_CONTEXT.breakfastHours,
    };
  } catch (err) {
    return DEFAULT_CONTEXT;
  }
}

export async function askHotelAI(
  userMessage: string, 
  roomNumber: string = '', 
  historyMessages: ChatMessage[] = [],
  userLang: string = 'en'
): Promise<string> {
  const context = await getHotelContext(userLang);
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    return "Configuration Alert: API Key missing in environment settings.";
  }

  try {
    const systemPrompt = `You are AlpineStay Concierge, an ultra-luxury 5-star digital assistant for ${context.hotelName} serving Northern Italy.

HOTEL DETAILS:
- Room: ${roomNumber || 'Guest'}
- Wi-Fi Network: ${context.wifiName}
- Wi-Fi Password: ${context.wifiPass}
- Breakfast Hours: ${context.breakfastHours}
- Checkout Time: ${context.checkoutTime}

CRITICAL RULES:
1. CONTEXT MEMORY: Always remember previous messages in the conversation history. When guests ask follow-up questions (e.g., "give me the website link", "what is their menu?"), refer back to the exact places or restaurants mentioned in recent context.
2. ACCURATE INFORMATION & NO FAKE LINKS: Never hallucinate or invent fake website URLs (e.g., www.alpinestay.com/guest-dining). If you do not have the verified official website URL for a local restaurant, provide their exact name, address/locality, or suggest searching them on Google/TripAdvisor instead of giving non-existent links.
3. TONE & FORMAT: Ultra-professional, warm, sophisticated 5-star concierge. Use clean bullet points (•) for lists. Ensure text is structured, direct, and helpful. Do not inject hotel Wi-Fi details into specific dining/tour answers unless asked.
4. LANGUAGE: Respond seamlessly in the guest's language (${userLang}).`;

    const payloadMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      { role: "user", content: roomNumber ? `[Guest Room ${roomNumber}]: ${userMessage}` : userMessage }
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: payloadMessages,
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (data.error) {
      return `Service Unavailable: ${data.error.message || "Request Error"}`;
    }

    return data.choices?.[0]?.message?.content || "I am currently unable to process your request.";
  } catch (error: any) {
    return `Connection Error: ${error.message || "Failed to reach server"}`;
  }
}
