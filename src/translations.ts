export type Language = 
  | 'en' | 'de' | 'it' | 'nl' | 'fr' 
  | 'es' | 'pl' | 'ru' | 'ar' | 'zh' 
  | 'sv' | 'ja' | 'ko';

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

export const languageList: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
];

export const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    guests: 'Guests',
    requests: 'Requests',
    aiConcierge: 'AI Concierge',
    settings: 'Settings',
    occupancyRate: 'Occupancy Rate',
    activeGuests: 'Active Guests',
    checkedIn: 'Checked-in',
    pendingRequests: 'Pending Requests',
    actionRequired: 'Action required',
    resolutionEfficiency: 'Resolution Efficiency',
    requestsDone: 'Requests done',
    liveDemandTitle: 'Live Service Demand Distribution',
    housekeepingDemand: 'Housekeeping & Amenities',
    diningDemand: 'Dining & Room Service',
    conciergeDemand: 'Concierge, Ski & Tours',
    quickCheckIn: 'Quick Guest Check-In',
    guestName: 'Guest Name',
    roomNumber: 'Room Number (e.g. 104)',
    checkInDate: 'Check-In Date',
    checkOutDate: 'Check-Out Date',
    preferredLang: 'Preferred Language',
    registerGuest: 'Register Guest',
    hotelSettingsTitle: 'Hotel Settings & Configuration',
    hotelSettingsSubtitle: 'Manage hotel info, multi-language settings, and security',
    generalConfig: 'General Configuration',
    hotelName: 'Hotel Name',
    wifiSsid: 'Wi-Fi Name (SSID)',
    wifiPass: 'Wi-Fi Password',
    breakfastTimings: 'Breakfast Timings',
    checkoutTime: 'Checkout Time',
    accountSecurity: 'Account Security',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    updatePassword: 'Update Password',
    aiWelcome: "Welcome to AlpineStay! I am your 24/7 digital concierge for Northern Italy.\n\n• Wi-Fi: AlpineStay_Guest | Pass: alpine2026\n• Breakfast: 7:00 AM – 10:30 AM\n• Checkout: 11:00 AM\n\nHow may I assist your luxury stay today?",
    promptTowels: "🧹 Extra Towels",
    promptWater: "💧 Water Bottles",
    promptTours: "🏎️ Lombardy & Modena",
    promptSki: "🏔️ Dolomites Skiing",
    promptDining: "🍝 Michelin Dining"
  },
  de: {
    dashboard: 'Dashboard',
    guests: 'Gäste',
    requests: 'Anfragen',
    aiConcierge: 'KI-Concierge',
    settings: 'Einstellungen',
    occupancyRate: 'Belegungsrate',
    activeGuests: 'Aktive Gäste',
    checkedIn: 'Eingecheckt',
    pendingRequests: 'Offene Anfragen',
    actionRequired: 'Handlungsbedarf',
    resolutionEfficiency: 'Lösungseffizienz',
    requestsDone: 'Erledigte Anfragen',
    liveDemandTitle: 'Live-Service-Nachfrageverteilung',
    housekeepingDemand: 'Reinigung & Ausstattung',
    diningDemand: 'Gastronomie & Zimmerservice',
    conciergeDemand: 'Concierge, Ski & Touren',
    quickCheckIn: 'Schneller Gäste-Check-In',
    guestName: 'Name des Gastes',
    roomNumber: 'Zimmernummer (z.B. 104)',
    checkInDate: 'Check-In-Datum',
    checkOutDate: 'Check-Out-Datum',
    preferredLang: 'Bevorzugte Sprache',
    registerGuest: 'Gast Registrieren',
    hotelSettingsTitle: 'Hoteleinstellungen & Konfiguration',
    hotelSettingsSubtitle: 'Verwalten Sie Hotelinfos, Mehrsprachigkeit und Sicherheit',
    generalConfig: 'Allgemeine Konfiguration',
    hotelName: 'Hotelname',
    wifiSsid: 'WLAN-Name (SSID)',
    wifiPass: 'WLAN-Passwort',
    breakfastTimings: 'Frühstückszeiten',
    checkoutTime: 'Check-Out-Zeit',
    accountSecurity: 'Konto-Sicherheit',
    newPassword: 'Neues Passwort',
    confirmPassword: 'Passwort Bestätigen',
    updatePassword: 'Passwort Aktualisieren',
    aiWelcome: "Willkommen bei AlpineStay! Ich bin Ihr digitaler 24/7-Concierge.\n\n• WLAN: AlpineStay_Guest | Pass: alpine2026\n• Frühstück: 07:00 – 10:30 Uhr\n• Check-out: 11:00 Uhr\n\nWie kann ich Ihnen heute helfen?",
    promptTowels: "🧹 Zusätzliche Handtücher",
    promptWater: "💧 Wasserflaschen",
    promptTours: "🏎️ Lombardei & Modena",
    promptSki: "🏔️ Dolomiten Skifahren",
    promptDining: "🍝 Michelin Gastronomie"
  },
  it: {
    dashboard: 'Pannello Di Controllo',
    guests: 'Ospiti',
    requests: 'Richieste',
    aiConcierge: 'Concierge IA',
    settings: 'Impostazioni',
    occupancyRate: 'Tasso di Occupazione',
    activeGuests: 'Ospiti In House',
    checkedIn: 'Registrati',
    pendingRequests: 'Richieste In Attesa',
    actionRequired: 'Azione richiesta',
    resolutionEfficiency: 'Efficienza Risoluzione',
    requestsDone: 'Richieste completate',
    liveDemandTitle: 'Distribuzione Domanda Servizi in Tempo Reale',
    housekeepingDemand: 'Pulizia e Servizi',
    diningDemand: 'Ristorazione e Servizio in Camera',
    conciergeDemand: 'Concierge, Ski e Tour',
    quickCheckIn: 'Registrazione Rapida Ospite',
    guestName: 'Nome Ospite',
    roomNumber: 'Numero Camera (es. 104)',
    checkInDate: 'Data Check-In',
    checkOutDate: 'Data Check-Out',
    preferredLang: 'Lingua Preferita',
    registerGuest: 'Registra Ospite',
    hotelSettingsTitle: 'Impostazioni e Configurazione Hotel',
    hotelSettingsSubtitle: 'Gestisci informazioni hotel, impostazioni multilingua e sicurezza',
    generalConfig: 'Configurazione Generale',
    hotelName: 'Nome Hotel',
    wifiSsid: 'Nome Wi-Fi (SSID)',
    wifiPass: 'Password Wi-Fi',
    breakfastTimings: 'Orari Colazione',
    checkoutTime: 'Orario Check-Out',
    accountSecurity: 'Sicurezza Account',
    newPassword: 'Nuova Password',
    confirmPassword: 'Conferma Nuova Password',
    updatePassword: 'Aggiorna Password',
    aiWelcome: "Benvenuto su AlpineStay! Sono il tuo concierge digitale 24/7.\n\n• Wi-Fi: AlpineStay_Guest | Pass: alpine2026\n• Colazione: 07:00 – 10:30\n• Check-out: 11:00\n\nCome posso assisterti oggi?",
    promptTowels: "🧹 Asciugamani Extra",
    promptWater: "💧 Bottiglie d'Acqua",
    promptTours: "🏎️ Lombardia e Modena",
    promptSki: "🏔️ Sci sulle Dolomiti",
    promptDining: "🍝 Ristoranti Stellati"
  },
  nl: {
    dashboard: 'Dashboard', guests: 'Gasten', requests: 'Verzoeken', aiConcierge: 'AI Concierge', settings: 'Instellingen',
    occupancyRate: 'Bezetting', activeGuests: 'Actieve Gasten', checkedIn: 'Ingecheckt', pendingRequests: 'In Behandeling', actionRequired: 'Actie vereist', resolutionEfficiency: 'Oplossingssnelheid', requestsDone: 'Verzoeken afgerond', liveDemandTitle: 'Live Vraagverdeling Services', housekeepingDemand: 'Huishouding & Voorzieningen', diningDemand: 'Diner & Kamerservice', conciergeDemand: 'Concierge & Tours', quickCheckIn: 'Snelle Incheck', guestName: 'Naam Gast', roomNumber: 'Kamernummer', checkInDate: 'Incheckdatum', checkOutDate: 'Uitcheckdatum', preferredLang: 'Voorkeurstaal', registerGuest: 'Registreer Gast', hotelSettingsTitle: 'Hotel Instellingen', hotelSettingsSubtitle: 'Beheer hotelinformatie en talen', generalConfig: 'Algemene Configuratie', hotelName: 'Hotelnaam', wifiSsid: 'Wi-Fi Naam', wifiPass: 'Wi-Fi Wachtwoord', breakfastTimings: 'Ontbijttijden', checkoutTime: 'Uitchecktijd', accountSecurity: 'Accountbeveiliging', newPassword: 'Nieuw Wachtwoord', confirmPassword: 'Bevestig Wachtwoord', updatePassword: 'Wachtwoord Bijwerken', aiWelcome: "Welkom bij AlpineStay! Ik ben uw digitale concierge.\n\n• Wi-Fi: AlpineStay_Guest | Pass: alpine2026\n• Ontbijt: 07:00 – 10:30\n• Uitchecken: 11:00\n\nHoe kan ik u helpen?", promptTowels: "🧹 Extra handdoeken", promptWater: "💧 Waterflessen", promptTours: "🏎️ Tours", promptSki: "🏔️ Skiën", promptDining: "🍝 Dineren"
  },
  fr: {
    dashboard: 'Tableau de Bord', guests: 'Clients', requests: 'Demandes', aiConcierge: 'Concierge IA', settings: 'Paramètres',
    occupancyRate: "Taux d'occupation", activeGuests: 'Clients Actifs', checkedIn: 'Enregistré', pendingRequests: 'Demandes en Attente', actionRequired: 'Action requise', resolutionEfficiency: 'Efficacité de Résolution', requestsDone: 'Demandes traitées', liveDemandTitle: 'Distribution de la Demande en Direct', housekeepingDemand: 'Ménage & Équipements', diningDemand: 'Restauration & Room Service', conciergeDemand: 'Concierge & Excursions', quickCheckIn: 'Enregistrement Rapide', guestName: 'Nom du Client', roomNumber: 'Numéro de Chambre', checkInDate: "Date d'arrivée", checkOutDate: 'Date de départ', preferredLang: 'Langue Préférée', registerGuest: 'Enregistrer le Client', hotelSettingsTitle: "Paramètres de l'Hôtel", hotelSettingsSubtitle: 'Gérer les informations, la langue et la sécurité', generalConfig: 'Configuration Générale', hotelName: "Nom de l'Hôtel", wifiSsid: 'Nom Wi-Fi (SSID)', wifiPass: 'Mot de Passe Wi-Fi', breakfastTimings: 'Horaires du Petit-Déjeuner', checkoutTime: 'Heure de Départ', accountSecurity: 'Sécurité du Compte', newPassword: 'Nouveau Mot de Passe', confirmPassword: 'Confirmer le Mot de Passe', updatePassword: 'Mettre à Jour', aiWelcome: "Bienvenue à AlpineStay! Je suis votre concierge numérique.\n\n• Wi-Fi: AlpineStay_Guest | Pass: alpine2026\n• Petit-déjeuner: 07:00 – 10:30\n• Départ: 11:00\n\nComment puis-je vous aider?", promptTowels: "🧹 Serviettes extra", promptWater: "💧 Bouteilles d'eau", promptTours: "🏎️ Excursions", promptSki: "🏔️ Ski", promptDining: "🍝 Gastronomie"
  },
  es: {
    dashboard: 'Panel de Control', guests: 'Huéspedes', requests: 'Solicitudes', aiConcierge: 'Conserje IA', settings: 'Ajustes',
    occupancyRate: 'Tasa de Ocupación', activeGuests: 'Huéspedes Activos', checkedIn: 'Registrado', pendingRequests: 'Solicitudes Pendientes', actionRequired: 'Acción requerida', resolutionEfficiency: 'Eficiencia de Resolución', requestsDone: 'Solicitudes completadas', liveDemandTitle: 'Distribución de la Demanda en Vivo', housekeepingDemand: 'Limpieza y Servicios', diningDemand: 'Restaurante y Servicio de Habitaciones', conciergeDemand: 'Conserjería y Tours', quickCheckIn: 'Registro Rápido', guestName: 'Nombre del Huésped', roomNumber: 'Número de Habitación', checkInDate: 'Fecha de Entrada', checkOutDate: 'Fecha de Salida', preferredLang: 'Idioma Preferido', registerGuest: 'Registrar Huésped', hotelSettingsTitle: 'Configuración del Hotel', hotelSettingsSubtitle: 'Gestione información del hotel, idiomas y seguridad', generalConfig: 'Configuración General', hotelName: 'Nombre del Hotel', wifiSsid: 'Nombre Wi-Fi (SSID)', wifiPass: 'Contraseña Wi-Fi', breakfastTimings: 'Horario del Desayuno', checkoutTime: 'Hora de Salida', accountSecurity: 'Seguridad de la Cuenta', newPassword: 'Nueva Contraseña', confirmPassword: 'Confirmar Contraseña', updatePassword: 'Actualizar Contraseña', aiWelcome: "¡Bienvenido a AlpineStay! Soy su conserje digital.\n\n• Wi-Fi: AlpineStay_Guest | Pass: alpine2026\n• Desayuno: 07:00 – 10:30\n• Salida: 11:00\n\n¿En qué puedo ayudarle hoy?", promptTowels: "🧹 Toallas Extra", promptWater: "💧 Botellas de Agua", promptTours: "🏎️ Tours", promptSki: "🏔️ Esquí", promptDining: "🍝 Gastronomía"
  },
  pl: {
    dashboard: 'Pulpit', guests: 'Goście', requests: 'Prośby', aiConcierge: 'Koncjerż AI', settings: 'Ustawienia',
    occupancyRate: 'Stopień Zajętości', activeGuests: 'Aktywni Goście', checkedIn: 'Zameldowani', pendingRequests: 'Oczekujące Prośby', actionRequired: 'Wymaga działania', resolutionEfficiency: 'Efektywność Realizacji', requestsDone: 'Zrealizowane prośby', liveDemandTitle: 'Rozkład Zapotrzebowania na Usługi Na Żywo', housekeepingDemand: 'Sprzątanie i Udogodnienia', diningDemand: 'Gastronomia i Obsługa Pokoju', conciergeDemand: 'Koncepcyjne & Wycieczki', quickCheckIn: 'Szybkie Zameldowanie', guestName: 'Imię i Nazwisko', roomNumber: 'Numer Pokoju', checkInDate: 'Data Zameldowania', checkOutDate: 'Data Wymeldowania', preferredLang: 'Preferowany Język', registerGuest: 'Zarejestruj Gościa', hotelSettingsTitle: 'Ustawienia Hotelu', hotelSettingsSubtitle: 'Zarządzaj informacjami, językami i bezpieczeństwem', generalConfig: 'Konfiguracja Ogólna', hotelName: 'Nazwa Hotelu', wifiSsid: 'Nazwa Wi-Fi (SSID)', wifiPass: 'Hasło Wi-Fi', breakfastTimings: 'Godziny Śniadań', checkoutTime: 'Godzina Wymeldowania', accountSecurity: 'Bezpieczeństwo Konta', newPassword: 'Nowe Hasło', confirmPassword: 'Potwierdź Hasło', updatePassword: 'Aktualizuj Hasło', aiWelcome: "Witamy w AlpineStay! Jestem Twoim cyfrowym konportem.\n\n• Wi-Fi: AlpineStay_Guest | Pass: alpine2026\n• Śniadanie: 07:00 – 10:30\n• Wymeldowanie: 11:00\n\nW czym mogę pomóc?", promptTowels: "🧹 Dodatkowe ręczniki", promptWater: "💧 Woda butelkowana", promptTours: "🏎️ Wycieczki", promptSki: "🏔️ Narty", promptDining: "🍝 Restauracje"
  },
  ru: {
    dashboard: 'Панель Управления', guests: 'Гости', requests: 'Запросы', aiConcierge: 'ИИ Консьерж', settings: 'Настройки',
    occupancyRate: 'Загрузка Отеля', activeGuests: 'Активные Гости', checkedIn: 'Заселены', pendingRequests: 'Ожидающие Запросы', actionRequired: 'Требует внимания', resolutionEfficiency: 'Эффективность Решения', requestsDone: 'Выполненные запросы', liveDemandTitle: 'Распределение Спроса на Услуги в Реальном Времени', housekeepingDemand: 'Уборка и Удобства', diningDemand: 'Ресторан и Обслуживание Номеров', conciergeDemand: 'Консьерж и Экскурсии', quickCheckIn: 'Быстрая Регистрация', guestName: 'Имя Гостя', roomNumber: 'Номер Комнаты', checkInDate: 'Дата Заезда', checkOutDate: 'Дата Выезда', preferredLang: 'Предпочитаемый Язык', registerGuest: 'Зарегистрировать Гостя', hotelSettingsTitle: 'Настройки Отеля', hotelSettingsSubtitle: 'Управление информацией о геле, языками и безопасностью', generalConfig: 'Общие Настройки', hotelName: 'Название Отеля', wifiSsid: 'Сеть Wi-Fi (SSID)', wifiPass: 'Пароль Wi-Fi', breakfastTimings: 'Время Завтрака', checkoutTime: 'Время Выезда', accountSecurity: 'Безопасность Аккаунта', newPassword: 'Новый Пароль', confirmPassword: 'Подтвердите Пароль', updatePassword: 'Обновить Пароль', aiWelcome: "Добро пожаловать в AlpineStay! Я ваш цифровой консьерж.\n\n• Wi-Fi: AlpineStay_Guest | Pass: alpine2026\n• Завтрак: 07:00 – 10:30\n• Выезд: 11:00\n\nЧем я могу вам помочь?", promptTowels: "🧹 Доп. полотенца", promptWater: "💧 Вода", promptTours: "🏎️ Экскурсии", promptSki: "🏔️ Лыжи", promptDining: "🍝 Рестораны"
  },
  ar: {
    dashboard: 'لوحة التحكم', guests: 'الضيوف', requests: 'الطلبات', aiConcierge: 'المساعد الذكي', settings: 'الإعدادات',
    occupancyRate: 'نسبة الإشغال', activeGuests: 'الضيوف الحاليون', checkedIn: 'تم تسجيل الوصول', pendingRequests: 'الطلبات المعلقة', actionRequired: 'يتطلب إجراء', resolutionEfficiency: 'كفاءة الحل', requestsDone: 'الطلبات المكتملة', liveDemandTitle: 'توزيع الطلب على الخدمات المباشرة', housekeepingDemand: 'التنظيف والمرافق', diningDemand: 'المطاعم وخدمة الغرف', conciergeDemand: 'الاستعلامات والجولات', quickCheckIn: 'تسجيل وصول سريع', guestName: 'اسم الضيف', roomNumber: 'رقم الغرفة', checkInDate: 'تاريخ الوصول', checkOutDate: 'تاريخ المغادرة', preferredLang: 'اللغة المفضلة', registerGuest: 'تسجيل الضيف', hotelSettingsTitle: 'إعدادات الفندق', hotelSettingsSubtitle: 'إدارة معلومات الفندق واللغات والأمان', generalConfig: 'التكوين العام', hotelName: 'اسم الفندق', wifiSsid: 'اسم الواي فاي', wifiPass: 'كلمة مرور الواي فاي', breakfastTimings: 'مواعيد الإفطار', checkoutTime: 'وقت المغادرة', accountSecurity: 'أمان الحساب', newPassword: 'كلمة المرور الجديدة', confirmPassword: 'تأكيد كلمة المرور', updatePassword: 'تحديث كلمة المرور', aiWelcome: "مرحبًا بك في AlpineStay! أنا مساعدك الرقمي.\n\n• الواي فاي: AlpineStay_Guest | كلمة المرور: alpine2026\n• الإفطار: 07:00 – 10:30\n• المغادرة: 11:00\n\nكيف يمكنني مساعدتك اليوم؟", promptTowels: "🧹 مناشف إضافية", promptWater: "💧 زجاجات مياه", promptTours: "🏎️ جولات سياحية", promptSki: "🏔️ التزلج", promptDining: "🍝 مطاعم"
  },
  zh: {
    dashboard: '仪表板', guests: '客人', requests: '请求', aiConcierge: 'AI 礼宾', settings: '设置',
    occupancyRate: '入住率', activeGuests: '在住客人', checkedIn: '已入住', pendingRequests: '待处理请求', actionRequired: '需要处理', resolutionEfficiency: '解决效率', requestsDone: '已完成请求', liveDemandTitle: '实时服务需求分布', housekeepingDemand: '客房清洁与设施', diningDemand: '餐饮与客房服务', conciergeDemand: '礼宾与旅游', quickCheckIn: '快速办理入住', guestName: '客人姓名', roomNumber: '房间号', checkInDate: '入住日期', checkOutDate: '退房日期', preferredLang: '首选语言', registerGuest: '登记客人', hotelSettingsTitle: '酒店设置与配置', hotelSettingsSubtitle: '管理酒店信息、多语言设置与安全', generalConfig: '常规配置', hotelName: '酒店名称', wifiSsid: 'Wi-Fi 名称 (SSID)', wifiPass: 'Wi-Fi 密码', breakfastTimings: '早餐时间', checkoutTime: '退房时间', accountSecurity: '账户安全', newPassword: '新密码', confirmPassword: '确认新密码', updatePassword: '更新密码', aiWelcome: "欢迎来到 AlpineStay！我是您的 24/7 数字礼宾。\n\n• Wi-Fi: AlpineStay_Guest | 密码: alpine2026\n• 早餐: 07:00 – 10:30\n• 退房: 11:00\n\n今天有什么可以帮您？", promptTowels: "🧹 额外毛巾", promptWater: "💧 瓶装水", promptTours: "🏎️ 观光行程", promptSki: "🏔️ 滑雪", promptDining: "🍝 米其林餐饮"
  },
  sv: {
    dashboard: 'Översikt', guests: 'Gäster', requests: 'Förfrågningar', aiConcierge: 'AI Concierge', settings: 'Inställningar',
    occupancyRate: 'Beläggningsgrad', activeGuests: 'Incheckade Gäster', checkedIn: 'Incheckade', pendingRequests: 'Väntande Begäranden', actionRequired: 'Åtgärd krävs', resolutionEfficiency: 'Lösningseffektivitet', requestsDone: 'Slutförda begäranden', liveDemandTitle: 'Realtidsfördelning av Tjänsteförfrågningar', housekeepingDemand: 'Städning & Belysning', diningDemand: 'Middag & Rumsservice', conciergeDemand: 'Concierge & Turer', quickCheckIn: 'Snabb Incheckning', guestName: 'Gästens Namn', roomNumber: 'Rumsnummer', checkInDate: 'Incheckningsdatum', checkOutDate: 'Utcheckningsdatum', preferredLang: 'Föredraget Språk', registerGuest: 'Registrera Gäst', hotelSettingsTitle: 'Hotellinställningar', hotelSettingsSubtitle: 'Hantera hotellinformation, språk och säkerhet', generalConfig: 'Allmän Konfiguration', hotelName: 'Hotellnamn', wifiSsid: 'Wi-Fi-namn', wifiPass: 'Wi-Fi-lösenord', breakfastTimings: 'Frukosttider', checkoutTime: 'Utcheckningstid', accountSecurity: 'Kontosäkerhet', newPassword: 'Nytt Lösenord', confirmPassword: 'Bekräfta Lösenord', updatePassword: 'Uppdatera Lösenord', aiWelcome: "Välkommen till AlpineStay! Jag är din digitala concierge.\n\n• Wi-Fi: AlpineStay_Guest | Lösenord: alpine2026\n• Frukost: 07:00 – 10:30\n• Utcheckning: 11:00\n\nHur kan jag hjälpa dig?", promptTowels: "🧹 Extra handdukar", promptWater: "💧 Vattenflaskor", promptTours: "🏎️ Turer", promptSki: "🏔️ Skidåkning", promptDining: "🍝 Restautanger"
  },
  ja: {
    dashboard: 'ダッシュボード', guests: 'ゲスト', requests: 'リクエスト', aiConcierge: 'AI コンシェルジュ', settings: '設定',
    occupancyRate: '客室稼働率', activeGuests: '滞在中のお客様', checkedIn: 'チェックイン済', pendingRequests: '保留中のリクエスト', actionRequired: '対応が必要', resolutionEfficiency: '解決効率', requestsDone: '完了したリクエスト', liveDemandTitle: 'リアルタイムサービス需要分布', housekeepingDemand: '清掃＆アメニティ', diningDemand: 'お食事＆ルームサービス', conciergeDemand: 'コンシェルジュ＆ツアー', quickCheckIn: 'クイックチェックイン', guestName: 'お客様のお名前', roomNumber: '部屋番号', checkInDate: 'チェックイン日', checkOutDate: 'チェックアウト日', preferredLang: '希望言語', registerGuest: 'ゲストを登録', hotelSettingsTitle: 'ホテル設定と構成', hotelSettingsSubtitle: 'ホテル情報、多言語設定、セキュリティの管理', generalConfig: '基本設定', hotelName: 'ホテル名', wifiSsid: 'Wi-Fi名 (SSID)', wifiPass: 'Wi-Fiパスワード', breakfastTimings: '朝食時間', checkoutTime: 'チェックアウト時間', accountSecurity: 'アカウントセキュリティ', newPassword: '新しいパスワード', confirmPassword: 'パスワードの確認', updatePassword: 'パスワードを更新', aiWelcome: "AlpineStayへようこそ！24時間対応デジタルコンシェルジュです。\n\n• Wi-Fi: AlpineStay_Guest | パスワード: alpine2026\n• 朝食: 07:00 – 10:30\n• チェックアウト: 11:00\n\n本日はどのようなご用件でしょうか？", promptTowels: "🧹 追加のタオル", promptWater: "💧 ボトル水", promptTours: "🏎️ ツアー案内", promptSki: "🏔️ スキー情報", promptDining: "🍝 ディナー予約"
  },
  ko: {
    dashboard: '대시보드', guests: '고객', requests: '요청 사항', aiConcierge: 'AI 컨시어지', settings: '설정',
    occupancyRate: '객실 점유율', activeGuests: '투숙 중인 고객', checkedIn: '체크인 완료', pendingRequests: '대기 중인 요청', actionRequired: '조치 필요', resolutionEfficiency: '처리 효율성', requestsDone: '완료된 요청', liveDemandTitle: '실시간 서비스 수요 분배', housekeepingDemand: '하우스키핑 및 어메니티', diningDemand: '다이닝 및 룸서비스', conciergeDemand: '컨시어지 및 투어', quickCheckIn: '빠른 고객 체크인', guestName: '고객 성함', roomNumber: '객실 번호', checkInDate: '체크인 날짜', checkOutDate: '체크아웃 날짜', preferredLang: '선호 언어', registerGuest: '고객 등록', hotelSettingsTitle: '호텔 설정 및 구성', hotelSettingsSubtitle: '호텔 정보, 다국어 설정 및 보안 관리', generalConfig: '일반 구성', hotelName: '호텔 이름', wifiSsid: 'Wi-Fi 이름 (SSID)', wifiPass: 'Wi-Fi 비밀번호', breakfastTimings: '조식 시간', checkoutTime: '체크아웃 시간', accountSecurity: '계정 보안', newPassword: '새 비밀번호', confirmPassword: '비밀번호 확인', updatePassword: '비밀번호 업데이트', aiWelcome: "AlpineStay에 오신 것을 환영합니다! 24시간 디지털 컨시어지입니다.\n\n• Wi-Fi: AlpineStay_Guest | 비밀번호: alpine2026\n• 조식: 07:00 – 10:30\n• 체크아웃: 11:00\n\n오늘 어떤 도움이 필요하신가요?", promptTowels: "🧹 추가 타월", promptWater: "💧 생수 요청", promptTours: "🏎️ 투어 추천", promptSki: "🏔️ 스키 정보", promptDining: "🍝 식당 추천"
  }
};
