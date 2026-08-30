import { supabase } from './supabaseClient';

export async function getHotelContext(userLang: string = 'en') {
  try {
    const { data } = await supabase
      .from('hotel_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!data) {
      return {
        hotelName: 'AlpineStay',
        wifiName: 'AlpineStay_Guest',
        wifiPass: 'alpine2026',
        breakfastHours: '7:00 AM – 10:30 AM',
        checkoutTime: '11:00 AM'
      };
    }

    return {
      hotelName: data.hotel_name || 'AlpineStay',
      wifiName: data.wifi_name || 'AlpineStay_Guest',
      wifiPass: data.wifi_password || 'alpine2026',
      checkoutTime: data.checkout_time || '11:00 AM',
      breakfastHours: data.breakfast_hours || '7:00 AM – 10:30 AM'
    };
  } catch (err) {
    return {
      hotelName: 'AlpineStay',
      wifiName: 'AlpineStay_Guest',
      wifiPass: 'alpine2026',
      breakfastHours: '7:00 AM – 10:30 AM',
      checkoutTime: '11:00 AM'
    };
  }
}

export async function askHotelAI(userMessage: string, roomNumber: string = '', userLang: string = 'en') {
  const context = await getHotelContext(userLang);
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    return "Error: VITE_GROQ_API_KEY missing in Vercel settings.";
  }

  try {
    const systemPrompt = `You are AlpineStay AI, an elite digital concierge for ${context.hotelName} near Lake Garda and the Dolomites.
Guest Room: ${roomNumber || 'Guest'}.
Wi-Fi: ${context.wifiName} | Pass: ${context.wifiPass}
Breakfast: ${context.breakfastHours} | Checkout: ${context.checkoutTime}

CRITICAL RULES & LANGUAGE POLICY:
1. MULTILINGUAL SUPPORT: You fluently understand and respond in ALL global languages (English, Italian, German, Russian, Arabic, French, Spanish, Urdu, Hindi, Chinese, etc.).
2. If asked how many languages you support, state clearly: "I support over 100+ global languages fluently to assist guests from all around the world." NEVER say you only support 3 languages.
3. Match the language of the guest automatically.
4. FORMATTING: Use clean bullet points ('• ') and bold headers (**Header:**). Never use '###' or single asterisks (*word*).
5. TONE: Warm, high-end luxury hospitality concierge. Keep replies concise and beautifully structured.`;

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
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (data.error) {
      return `Groq API Error: ${data.error.message || "Invalid Request"}`;
    }

    return data.choices?.[0]?.message?.content || "I am unable to assist at the moment.";
  } catch (error: any) {
    return `Network Error: ${error.message || "Failed to reach server"}`;
  }
}
