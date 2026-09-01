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

// Helper to automatically log physical room requests into Supabase
async function autoCreateServiceRequest(roomNumber: string, messageText: string) {
  if (!roomNumber) return;
  
  const requestKeywords = ['towel', 'water', 'clean', 'pillow', 'blanket', 'soap', 'housekeeping', 'fix', 'toiletries', 'bring'];
  const lowerMsg = messageText.toLowerCase();
  
  const isRequest = requestKeywords.some(keyword => lowerMsg.includes(keyword));
  
  if (isRequest) {
    try {
      await supabase.from('guest_requests').insert([
        {
          room_number: roomNumber,
          request_text: messageText,
          status: 'pending'
        }
      ]);
    } catch (err) {
      console.error('Error logging guest request:', err);
    }
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

  // Trigger background check for service requests
  autoCreateServiceRequest(roomNumber, userMessage);

  try {
    const systemPrompt = `You are AlpineStay Concierge, an ultra-luxury 5-star digital assistant for ${context.hotelName} serving Northern Italy.

HOTEL DETAILS:
- Current Guest Room: ${roomNumber || 'Not Specified'}
- Wi-Fi Network: ${context.wifiName}
- Wi-Fi Password: ${context.wifiPass}
- Breakfast Hours: ${context.breakfastHours}
- Checkout Time: ${context.checkoutTime}

CRITICAL RULES:
1. SERVICE REQUEST ACKNOWLEDGEMENT: If the guest asks for physical items or services (e.g. extra towels, water, housekeeping, pillows), warmly confirm that you have notified the hotel front desk/staff for Room ${roomNumber || 'their room'}.
2. CONTEXT MEMORY: Always remember previous messages in the conversation history to answer follow-ups correctly.
3. ACCURATE INFORMATION: Never fabricate fake URLs. If you don't have exact verified links, provide names/locations or suggest searching Google/TripAdvisor.
4. TONE & FORMAT: Ultra-professional, warm, bespoke 5-star concierge. Use clean bullet points (•) for lists.
5. LANGUAGE: Respond in guest's language (${userLang}).`;

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
