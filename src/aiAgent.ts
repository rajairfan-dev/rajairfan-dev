import { supabase } from './supabaseClient';

// Key Vercel ki Environment Variable se aayegi
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || (import.meta as any).env?.GROQ_API_KEY; 

export async function askHotelAI(userQuery: string, roomNumber?: string) {
  try {
    let guestContext = "Guest details not specified.";
    if (roomNumber) {
      const { data } = await supabase.from('guests').select('*').eq('room_number', roomNumber).single();
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
      
      Current Guest Context: ${guestContext}
      
      Respond politely, helpfully, and concisely to the guest.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
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
    return data.choices?.[0]?.message?.content || "Sorry, I am having trouble processing your request.";
  } catch (error) {
    return "AI Concierge is currently offline.";
  }
}
