import { createClient } from '@supabase/supabase-js';

// Supabase Connection Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getHotelContext() {
  try {
    // Database se dynamic hotel settings fetch karein
    const { data, error } = await supabase
      .from('hotel_settings')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      console.warn("Hotel settings not found, using default fallback.");
      return {
        hotelName: 'AlpineStay',
        wifiName: 'AlpineStay_Guest',
        wifiPass: 'alpine2026',
        breakfastHours: '7:00 AM - 10:30 AM',
        checkoutTime: '11:00 AM'
      };
    }

    return {
      hotelName: data.hotel_name,
      wifiName: data.wifi_name,
      wifiPass: data.wifi_password,
      breakfastHours: data.breakfast_hours,
      checkoutTime: data.checkout_time
    };
  } catch (err) {
    console.error("Error fetching context:", err);
    return null;
  }
}
