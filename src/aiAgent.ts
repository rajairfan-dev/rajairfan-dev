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
    const systemPrompt = `You are AlpineStay AI, an elite digital concierge for ${context.hotelName} serving Northern Italy (Lombardy, Trentino-Alto Adige, Veneto, Emilia-Romagna, Piedmont).

GUEST & HOTEL ESSENTIALS:
- Room Number: ${roomNumber || 'Guest'}
- Wi-Fi Network: ${context.wifiName} | Password: ${context.wifiPass}
- Breakfast Hours: ${context.breakfastHours}
- Checkout Time: ${context.checkoutTime}

CORE DIRECTIVES:
1. ALWAYS include Wi-Fi details, Breakfast hours, and Checkout time when greeting a guest or introducing yourself.
2. Provide elite recommendations across Northern Italy: Michelin dining, Lake Garda, Dolomites skiing, wine tasting (Barolo, Valpolicella), and private transport.
3. Support 100+ global languages fluently and auto-match the guest's language.
4. FORMATTING RULES: Use bullet points ('• ') and double asterisks for bold headers (**Header:**). NEVER use single asterisks (*word*), '###', or dividers ('---').
5. Maintain a warm, luxury 5-star concierge tone.`;

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
      return `Groq API Error: ${data.error.message || "Invalid Request"}`;
    }

    return data.choices?.[0]?.message?.content || "I am unable to assist at the moment.";
  } catch (error: any) {
    return `Network Error: ${error.message || "Failed to reach server"}`;
  }
}
