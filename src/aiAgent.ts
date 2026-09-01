import { supabase } from './supabaseClient';

export interface HotelContext {
  hotelName: string;
  wifiName: string;
  wifiPass: string;
  breakfastHours: string;
  checkoutTime: string;
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

RESPONSE RULES:
1. TONE: Ultra-professional, warm, sophisticated, and bespoke 5-star hotel concierge.
2. GREETING & HOTEL INFO: Only include Wi-Fi & Checkout details on initial greetings (e.g. "hi", "hello", "welcome") or when explicitly requested by the guest. Do NOT inject Wi-Fi details into luxury itineraries or tour recommendations.
3. FORMATTING RULES: Use plain, clean bullet points (•) for lists. DO NOT use asterisks like '**' or '*' anywhere in your response. Do NOT use markdown headings like '###' or dividers like '---'. Ensure text renders clean without formatting markup.
4. TRIP RECOMMENDATIONS: Present multi-day itineraries elegantly using clear line breaks for Day, Morning, Afternoon, and Evening. Focus on Michelin dining, private transfers, and luxury experiences.
5. LANGUAGE: Seamlessly respond in the guest's language (${userLang}).`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.2
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
