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
    return "GROQ API Key missing in environment settings.";
  }

  // Live GROQ Llama-3 AI Call
  try {
    const systemPrompt = `You are a helpful, smart AI Concierge for "${context.hotelName}". 
Guest Room Number: ${roomNumber || 'Not specified'}.
Hotel Details:
- Wi-Fi Network: ${context.wifiName}
- Wi-Fi Password: ${context.wifiPass}
- Breakfast Timings: ${context.breakfastHours}
- Check-out Time: ${context.checkoutTime}

Answer any guest question naturally, politely, and intelligently. Use bold text formatting for key information.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I apologize, I couldn't process that request right now.";
  } catch (error) {
    console.error("GROQ API Error:", error);
    return "Sorry, I am having trouble connecting to my AI brain. Please try again in a moment.";
  }
}
