import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getHotelContext(userLang: string = 'en') {
  try {
    const { data, error } = await supabase
      .from('hotel_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      console.warn("Hotel settings not found, using fallback.");
      return {
        hotelName: 'AlpineStay',
        wifiName: 'AlpineStay_Guest',
        wifiPass: 'alpine2026',
        breakfastHours: '7:00 AM - 10:30 AM',
        checkoutTime: '11:00 AM',
        welcomeMsg: 'Welcome to AlpineStay'
      };
    }

    const translations = data.translations || {};
    const langData = translations[userLang] || translations['en'] || {};

    return {
      hotelName: data.hotel_name,
      wifiName: data.wifi_name,
      wifiPass: data.wifi_password,
      checkoutTime: data.checkout_time,
      breakfastHours: langData.breakfast || data.breakfast_hours || '7:00 AM - 10:30 AM',
      welcomeMsg: langData.welcome || `Welcome to ${data.hotel_name}`
    };
  } catch (err) {
    console.error("Error fetching context:", err);
    return null;
  }
}

// AI Engine Response Handler (Restored for App.tsx import)
export async function askHotelAI(userMessage: string, roomNumber: string = '', userLang: string = 'en') {
  const context = await getHotelContext(userLang);

  if (!context) {
    return "I am currently unable to fetch hotel details. Please contact the front desk.";
  }

  const query = userMessage.toLowerCase();

  if (query.includes('wifi') || query.includes('internet') || query.includes('password')) {
    return `**Wi-Fi Connection Details:**\nNetwork: **${context.wifiName}**\nPassword: **${context.wifiPass}**`;
  }

  if (query.includes('breakfast') || query.includes('khana') || query.includes('essen')) {
    return `**Breakfast Hours:**\nOur daily breakfast is served from **${context.breakfastHours}**.`;
  }

  if (query.includes('checkout') || query.includes('check out') || query.includes('leave')) {
    return `**Check-out Time:**\nStandard check-out is at **${context.checkoutTime}**.`;
  }

  return `${context.welcomeMsg}\n\nHow can I assist you further today? You can ask about Wi-Fi, breakfast hours, or check-out rules.`;
}
