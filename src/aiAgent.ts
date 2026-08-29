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

    // Dynamic language translation fetch karein (fallback to English)
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
