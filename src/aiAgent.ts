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
        breakfastHours: '7:00 AM - 10:30 AM',
        checkoutTime: '11:00 AM'
      };
    }

    return {
      hotelName: data.hotel_name || 'AlpineStay',
      wifiName: data.wifi_name || 'AlpineStay_Guest',
      wifiPass: data.wifi_password || 'alpine2026',
      checkoutTime: data.checkout_time || '11:00 AM',
      breakfastHours: data.breakfast_hours || '7:00 AM - 10:30 AM'
    };
  } catch (err) {
    return {
      hotelName: 'AlpineStay',
      wifiName: 'AlpineStay_Guest',
      wifiPass: 'alpine2026',
      breakfastHours: '7:00 AM - 10:30 AM',
      checkoutTime: '11:00 AM'
    };
  }
}

export async function askHotelAI(userMessage: string, roomNumber: string = '', userLang: string = 'en') {
  const context = await getHotelContext(userLang);
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    return "Error: VITE_GROQ_API_KEY is not defined in environment variables.";
  }

  try {
    const systemPrompt = `You are an AI Concierge for ${context.hotelName}. Guest Room: ${roomNumber || 'None'}. Wi-Fi: ${context.wifiName}, Pass: ${context.wifiPass}, Breakfast: ${context.breakfastHours}, Checkout: ${context.checkoutTime}. Answer guest queries politely and concisely.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("GROQ API Error Object:", data.error);
      return `Groq API Error: ${data.error.message || "Invalid Request"}`;
    }

    return data.choices?.[0]?.message?.content || "I am unable to generate a response right now.";
  } catch (error: any) {
    console.error("GROQ Connection Error:", error);
    return `Network Error: ${error.message || "Failed to reach Groq server"}`;
  }
}
