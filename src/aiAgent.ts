import { supabase } from './supabaseClient';

export async function askHotelAI(userQuery: string, roomNumber?: string) {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      console.error("Error: VITE_GROQ_API_KEY is missing!");
      return "API Key configuration error. Please check your Vercel settings.";
    }

    let guestContext = "Guest details not specified.";
    if (roomNumber) {
      const { data } = await supabase.from('guests').select('*').eq('room_number', roomNumber).maybeSingle();
      if (data) {
        guestContext = `Guest Name: ${data.name}, Room: ${data.room_number}, Status: ${data.status}`;
      }
    }

    const systemPrompt = `
      You are AlpineStay AI, an intelligent hotel concierge assistant. 
      Hotel Details:
      - Wi-Fi Name: AlpineStay_Guest (Password: alpine2026)
      - Breakfast Time: 7:00 AM to 10:30 AM at Dining Hall
      - Checkout Time: 11:00 AM
      - Room Service: 24/7 Available
      - Room Availability: Deluxe Rooms and Suites are available.
      
      Current Guest Context: ${guestContext}
      
      Respond politely, helpfully, and concisely to the guest.
    `;

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
          { role: "user", content: userQuery }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API Response Error:", data);
      return `API Error: ${data.error?.message || "Failed to fetch response"}`;
    }

    return data.choices?.[0]?.message?.content || "No response generated.";
  } catch (error: any) {
    console.error("Network or Code Catch Error:", error);
    return "Connection error. Please check your internet or API settings.";
  }
}
