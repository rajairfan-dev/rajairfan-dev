import React, { useState } from 'react';
import { 
  Building2, 
  Wifi, 
  KeyRound, 
  Clock, 
  Globe, 
  ShieldCheck, 
  Save, 
  Lock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

// Screenshots me maujood tamam 13 Languages
export const ALL_LANGUAGES = [
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
  { code: 'ko', label: '한국어', flag: '🇰🇷' }
];

// Dynamic UI Dictionary & Professional Pre-filled Templates per Language
const UI_DICTIONARY: Record<string, any> = {
  en: {
    title: "Hotel Settings & Configuration",
    subtitle: "Manage hotel info, multi-language settings, and security",
    genConfig: "General Configuration",
    genSub: "Basic hotel details for guest WiFi & information",
    hotelName: "Hotel Name",
    wifiName: "Wi-Fi Name (SSID)",
    wifiPass: "Wi-Fi Password",
    bfTime: "Breakfast Timings",
    coTime: "Checkout Time",
    multiLang: "Multi-Language Translations",
    multiSub: "Customize AI Concierge templates & prompts per language",
    editing: "EDITING LANGUAGE",
    welMsg: "Welcome Greeting Message",
    welVal: "Welcome to AlpineStay! We are delighted to have you with us. How can we assist you today?",
    askPlaceholder: "AI Concierge Input Placeholder",
    askVal: "Ask me anything about your stay, WiFi, or room service...",
    wifiTemplate: "WiFi Info Template Message",
    wifiVal: "Free Guest Wi-Fi: Connect to 'AlpineStay_Guest' using password 'alpine2026'.",
    checkoutTemplate: "Checkout Info Template Message",
    checkoutVal: "Standard Checkout time is 11:00 AM. Please let us know if you need late checkout.",
    saveBtn: "Save All Settings & Languages",
    secTitle: "Account Security",
    secSub: "Update admin credentials and password",
    newPass: "New Password",
    confPass: "Confirm New Password",
    updatePassBtn: "Update Password",
    toastSuccess: "Settings saved successfully!"
  },
  de: {
    title: "Hoteleinstellungen & Konfiguration",
    subtitle: "Verwalten Sie Hotelinformationen, mehrsprachige Einstellungen und Sicherheit",
    genConfig: "Allgemeine Konfiguration",
    genSub: "Grundlegende Hoteldetails für Gäste-WLAN & Informationen",
    hotelName: "Hotelname",
    wifiName: "WLAN-Name (SSID)",
    wifiPass: "WLAN-Passwort",
    bfTime: "Frühstückszeiten",
    coTime: "Check-out-Zeit",
    multiLang: "Mehrsprachige Übersetzungen",
    multiSub: "Passen Sie KI-Concierge-Vorlagen & Eingabeaufforderungen an",
    editing: "SPRACHE BEARBEITEN",
    welMsg: "Willkommensnachricht",
    welVal: "Willkommen im AlpineStay! Wir freuen uns, Sie bei uns zu haben. Wie können wir Ihnen helfen?",
    askPlaceholder: "KI-Concierge-Eingabetext",
    askVal: "Fragen Sie mich etwas über Ihren Aufenthalt, WLAN oder Zimmerservice...",
    wifiTemplate: "WLAN-Info-Vorlage",
    wifiVal: "Kostenloses Gäste-WLAN: Verbinden Sie sich mit 'AlpineStay_Guest' (Passwort: alpine2026).",
    checkoutTemplate: "Check-out-Info-Vorlage",
    checkoutVal: "Die reguläre Check-out-Zeit ist 11:00 Uhr. Teilen Sie uns mit, wenn Sie Spät-Check-out wünschen.",
    saveBtn: "Alle Einstellungen & Sprachen speichern",
    secTitle: "Kontosicherheit",
    secSub: "Administrator-Anmeldeinformationen und Passwort aktualisieren",
    newPass: "Neues Passwort",
    confPass: "Neues Passwort bestätigen",
    updatePassBtn: "Passwort aktualisieren",
    toastSuccess: "Einstellungen erfolgreich gespeichert!"
  },
  it: {
    title: "Impostazioni e Configurazione Hotel",
    subtitle: "Gestisci informazioni sull'hotel, impostazioni multilingue e sicurezza",
    genConfig: "Configurazione Generale",
    genSub: "Dettagli base dell'hotel per Wi-Fi ospiti e informazioni",
    hotelName: "Nome Hotel",
    wifiName: "Nome Wi-Fi (SSID)",
    wifiPass: "Password Wi-Fi",
    bfTime: "Orari Colazione",
    coTime: "Orario Checkout",
    multiLang: "Traduzioni Multilingue",
    multiSub: "Personalizza i messaggi e le risposte del Concierge IA",
    editing: "MODIFICA LINGUA",
    welMsg: "Messaggio di Benvenuto",
    welVal: "Benvenuto a AlpineStay! Siamo felici di averti con noi. Come possiamo aiutarti oggi?",
    askPlaceholder: "Segnaposto Input Concierge IA",
    askVal: "Chiedimi qualsiasi cosa sul soggiorno, Wi-Fi o servizio in camera...",
    wifiTemplate: "Messaggio Template Wi-Fi",
    wifiVal: "Wi-Fi Gratuito Ospiti: Connettiti a 'AlpineStay_Guest' usando la password 'alpine2026'.",
    checkoutTemplate: "Messaggio Template Checkout",
    checkoutVal: "L'orario di checkout standard è alle 11:00. Facci sapere se desideri il late checkout.",
    saveBtn: "Salva Tutte le Impostazioni e Lingue",
    secTitle: "Sicurezza Account",
    secSub: "Aggiorna le credenziali amministratore e la password",
    newPass: "Nuova Password",
    confPass: "Conferma Nuova Password",
    updatePassBtn: "Aggiorna Password",
    toastSuccess: "Impostazioni salvate con successo!"
  },
  nl: {
    title: "Hotelinstellingen & Configuratie",
    subtitle: "Beheer hotelinformatie, meertalige instellingen en beveiliging",
    genConfig: "Algemene Configuratie",
    genSub: "Basis hotelgegevens voor gasten-WiFi en informatie",
    hotelName: "Hotelnaam",
    wifiName: "Wi-Fi Naam (SSID)",
    wifiPass: "Wi-Fi Wachtwoord",
    bfTime: "Ontbijttijden",
    coTime: "Uitchecktijd",
    multiLang: "Meertalige Vertalingen",
    multiSub: "Pas AI Concierge-sjablonen en prompts per taal aan",
    editing: "TAAL BEWERKEN",
    welMsg: "Welkomstbericht",
    welVal: "Welkom bij AlpineStay! We zijn blij u te mogen verwelkomen. Hoe kunnen we u vandaag helpen?",
    askPlaceholder: "AI Concierge Invoertekst",
    askVal: "Vraag mij alles over uw verblijf, Wi-Fi of kamerservice...",
    wifiTemplate: "Wi-Fi Info Sjabloon",
    wifiVal: "Gratis Wi-Fi voor gasten: Verbind met 'AlpineStay_Guest' met wachtwoord 'alpine2026'.",
    checkoutTemplate: "Uitchecken Info Sjabloon",
    checkoutVal: "Standaard uitchecktijd is 11:00 uur. Laat het ons weten als u laat wilt uitchecken.",
    saveBtn: "Alle Instellingen & Talen Opslaan",
    secTitle: "Accountbeveiliging",
    secSub: "Beheerdersgegevens en wachtwoord bijwerken",
    newPass: "Nieuw Wachtwoord",
    confPass: "Bevestig Nieuw Wachtwoord",
    updatePassBtn: "Wachtwoord Bijwerken",
    toastSuccess: "Instellingen succesvol opgeslagen!"
  },
  fr: {
    title: "Paramètres et Configuration de l'Hôtel",
    subtitle: "Gérez les informations de l'hôtel, le multilinguisme et la sécurité",
    genConfig: "Configuration Générale",
    genSub: "Détails de base pour le Wi-Fi invités et informations",
    hotelName: "Nom de l'Hôtel",
    wifiName: "Nom du Wi-Fi (SSID)",
    wifiPass: "Mot de passe Wi-Fi",
    bfTime: "Horaires du Petit-Déjeuner",
    coTime: "Heure de Départ",
    multiLang: "Traductions Multilingues",
    multiSub: "Personnalisez les modèles du Concierge IA par langue",
    editing: "MODIFICATION DE LA LANGUE",
    welMsg: "Message de Bienvenue",
    welVal: "Bienvenue à AlpineStay ! Nous sommes ravis de vous accueillir. Comment pouvons-nous vous aider ?",
    askPlaceholder: "Saisie Concierge IA",
    askVal: "Posez-moi des questions sur votre séjour, le Wi-Fi ou le service de chambre...",
    wifiTemplate: "Modèle Info Wi-Fi",
    wifiVal: "Wi-Fi Invité Gratuit : Connectez-vous à 'AlpineStay_Guest' avec le mot de passe 'alpine2026'.",
    checkoutTemplate: "Modèle Info Départ",
    checkoutVal: "L'heure de départ standard est 11:00. Prévenez-nous pour un départ tardif.",
    saveBtn: "Enregistrer tous les paramètres",
    secTitle: "Sécurité du Compte",
    secSub: "Mettre à jour les identifiants administrateur et le mot de passe",
    newPass: "Nouveau mot de passe",
    confPass: "Confirmer le mot de passe",
    updatePassBtn: "Mettre à jour le mot de passe",
    toastSuccess: "Paramètres enregistrés avec succès !"
  },
  es: {
    title: "Configuración del Hotel",
    subtitle: "Gestione información del hotel, idiomas y seguridad",
    genConfig: "Configuración General",
    genSub: "Detalles básicos del hotel para WiFi de huéspedes e información",
    hotelName: "Nombre del Hotel",
    wifiName: "Nombre de Wi-Fi (SSID)",
    wifiPass: "Contraseña de Wi-Fi",
    bfTime: "Horario de Desayuno",
    coTime: "Hora de Salida (Checkout)",
    multiLang: "Traducciones Multilingües",
    multiSub: "Personalice las plantillas del Concierge IA por idioma",
    editing: "EDITANDO IDIOMA",
    welMsg: "Mensaje de Bienvenida",
    welVal: "¡Bienvenido a AlpineStay! Estamos encantados de tenerle con nosotros. ¿En qué podemos ayudarle?",
    askPlaceholder: "Texto de Marcador del Concierge IA",
    askVal: "Pregúntame cualquier cosa sobre tu estancia, WiFi o servicio a la habitación...",
    wifiTemplate: "Plantilla de Información WiFi",
    wifiVal: "Wi-Fi gratuito para huéspedes: Conéctese a 'AlpineStay_Guest' con la contraseña 'alpine2026'.",
    checkoutTemplate: "Plantilla de Información de Checkout",
    checkoutVal: "La hora de salida estándar es a las 11:00 AM. Avísanos si necesitas salida tardía.",
    saveBtn: "Guardar Ajustes e Idiomas",
    secTitle: "Seguridad de la Cuenta",
    secSub: "Actualizar credenciales de administrador y contraseña",
    newPass: "Nueva Contraseña",
    confPass: "Confirmar Nueva Contraseña",
    updatePassBtn: "Actualizar Contraseña",
    toastSuccess: "¡Ajustes guardados con éxito!"
  },
  pl: {
    title: "Ustawienia i Konfiguracja Hotelu",
    subtitle: "Zarządzaj informacjami o hotelu, językami i bezpieczeństwem",
    genConfig: "Konfiguracja Ogólna",
    genSub: "Podstawowe informacje dla gości i WiFi",
    hotelName: "Nazwa Hotelu",
    wifiName: "Nazwa Wi-Fi (SSID)",
    wifiPass: "Hasło do Wi-Fi",
    bfTime: "Godziny Śniadania",
    coTime: "Godzina Wymeldowania",
    multiLang: "Tłumaczenia Wielojęzyczne",
    multiSub: "Dostosuj szablony AI Concierge dla każdego języka",
    editing: "EDYCJA JĘZYKA",
    welMsg: "Wiadomość Powitalna",
    welVal: "Witamy w AlpineStay! Cieszymy się, że jesteś z nami. W czym możemy Ci pomóc?",
    askPlaceholder: "Pole tekstowe AI Concierge",
    askVal: "Zapytaj mnie o cokolwiek dotyczącego pobytu, Wi-Fi lub obsługi pokoju...",
    wifiTemplate: "Szablon Informacji Wi-Fi",
    wifiVal: "Darmowe Wi-Fi dla gości: Połącz się z 'AlpineStay_Guest' używając hasła 'alpine2026'.",
    checkoutTemplate: "Szablon Wymeldowania",
    checkoutVal: "Standardowy czas wymeldowania to 11:00. Poinformuj nas, jeśli potrzebujesz późniejszego wymeldowania.",
    saveBtn: "Zapisz Wszystkie Ustawienia",
    secTitle: "Bezpieczeństwo Konta",
    secSub: "Aktualizuj dane administratora i hasło",
    newPass: "Nowe Hasło",
    confPass: "Potwierdź Nowe Hasło",
    updatePassBtn: "Aktualizuj Hasło",
    toastSuccess: "Ustawienia zostały pomyślnie zapisane!"
  },
  ru: {
    title: "Настройки и Конфигурация Отеля",
    subtitle: "Управление информацией об отеле, языками и безопасностью",
    genConfig: "Общая Конфигурация",
    genSub: "Основная информация о Wi-Fi и услугах для гостей",
    hotelName: "Название Отеля",
    wifiName: "Имя Wi-Fi (SSID)",
    wifiPass: "Пароль Wi-Fi",
    bfTime: "Время Завтрака",
    coTime: "Время Выезда",
    multiLang: "Многоязычные Переводы",
    multiSub: "Настройка шаблонов ИИ-Консьержа для каждого языка",
    editing: "РЕДАКТИРОВАНИЕ ЯЗЫКА",
    welMsg: "Приветственное Сообщение",
    welVal: "Добро пожаловать в AlpineStay! Мы рады видеть вас. Чем мы можем вам помочь?",
    askPlaceholder: "Поле ввода ИИ-Консьержа",
    askVal: "Спросите меня о вашем проживании, Wi-Fi или обслуживании в номерах...",
    wifiTemplate: "Шаблон Информации Wi-Fi",
    wifiVal: "Бесплатный Wi-Fi: Подключитесь к 'AlpineStay_Guest' с паролем 'alpine2026'.",
    checkoutTemplate: "Шаблон Выезда",
    checkoutVal: "Стандартное время выезда — 11:00. Сообщите нам, если вам нужен поздний выезд.",
    saveBtn: "Сохранить Все Настройки",
    secTitle: "Безопасность Аккаунта",
    secSub: "Обновление учетных данных администратора и пароля",
    newPass: "Новый Пароль",
    confPass: "Подтвердите Новый Пароль",
    updatePassBtn: "Обновить Пароль",
    toastSuccess: "Настройки успешно сохранены!"
  },
  ar: {
    title: "إعدادات وتكوين الفندق",
    subtitle: "إدارة معلومات الفندق واللغات المتعددة والأمان",
    genConfig: "التكوين العام",
    genSub: "تفاصيل الفندق الأساسية للواي فاي والمعلومات",
    hotelName: "اسم الفندق",
    wifiName: "اسم شبكة الواي فاي (SSID)",
    wifiPass: "كلمة سر الواي فاي",
    bfTime: "مواعيد الإفطار",
    coTime: "وقت المغادرة",
    multiLang: "الترجمات متعددة اللغات",
    multiSub: "تخصيص قوالب وتلميحات المساعد الذكي حسب اللغة",
    editing: "تعديل اللغة",
    welMsg: "رسالة الترحيب",
    welVal: "مرحباً بك في AlpineStay! يسعدنا وجودك معنا. كيف يمكننا مساعدتك اليوم؟",
    askPlaceholder: "نص حقل المساعد الذكي",
    askVal: "اسألني عن أي شيء يخص إقامتك، الواي فاي، أو خدمة الغرف...",
    wifiTemplate: "قالب معلومات الواي فاي",
    wifiVal: "واي فاي مجاني للضيوف: اتصل بـ 'AlpineStay_Guest' باستعمال كلمة السر 'alpine2026'.",
    checkoutTemplate: "قالب معلومات المغادرة",
    checkoutVal: "وقت المغادرة القياسي هو 11:00 صباحاً. يرجى إبلاغنا إذا كنت بحاجة لتأخير المغادرة.",
    saveBtn: "حفظ جميع الإعدادات واللغات",
    secTitle: "أمان الحساب",
    secSub: "تحديث بيانات المسؤول وكلمة المرور",
    newPass: "كلمة المرور الجديدة",
    confPass: "تأكيد كلمة المرور",
    updatePassBtn: "تحديث كلمة المرور",
    toastSuccess: "تم حفظ الإعدادات بنجاح!"
  },
  zh: {
    title: "酒店设置与配置",
    subtitle: "管理酒店信息、多语言设置和安全",
    genConfig: "通用配置",
    genSub: "客人 Wi-Fi 和信息的基本酒店详细信息",
    hotelName: "酒店名称",
    wifiName: "Wi-Fi 名称 (SSID)",
    wifiPass: "Wi-Fi 密码",
    bfTime: "早餐时间",
    coTime: "退房时间",
    multiLang: "多语言翻译",
    multiSub: "按语言自定义 AI 管家模板和提示",
    editing: "正在编辑语言",
    welMsg: "欢迎消息",
    welVal: "欢迎来到 AlpineStay！很高兴您的光临。今天有什么可以帮您？",
    askPlaceholder: "AI 管家输入占位符",
    askVal: "向我询问有关您的住宿、Wi-Fi 或客房服务的任何问题...",
    wifiTemplate: "Wi-Fi 信息模板消息",
    wifiVal: "免费客人 Wi-Fi：连接到 'AlpineStay_Guest'，密码为 'alpine2026'。",
    checkoutTemplate: "退房信息模板消息",
    checkoutVal: "标准退房时间为上午 11:00。如果您需要延迟退房，请告诉我们。",
    saveBtn: "保存所有设置和语言",
    secTitle: "账户安全",
    secSub: "更新管理员凭据和密码",
    newPass: "新密码",
    confPass: "确认新密码",
    updatePassBtn: "更新密码",
    toastSuccess: "设置保存成功！"
  },
  sv: {
    title: "Hotellinställningar och Konfiguration",
    subtitle: "Hantera hotellinformation, flerspråkiga inställningar och säkerhet",
    genConfig: "Allmän Konfiguration",
    genSub: "Grundläggande hotellinformation för gäst-WiFi och information",
    hotelName: "Hotellnamn",
    wifiName: "Wi-Fi Namn (SSID)",
    wifiPass: "Wi-Fi Lösenord",
    bfTime: "Frukosttider",
    coTime: "Utcheckningstid",
    multiLang: "Flerspråkiga Översättningar",
    multiSub: "Anpassa AI Concierge-mallar och meddelanden per språk",
    editing: "REDIGERAR SPRÅK",
    welMsg: "Välkomstmeddelande",
    welVal: "Välkommen till AlpineStay! Vi är glada att ha dig hos oss. Hur kan vi hjälpa dig idag?",
    askPlaceholder: "AI Concierge Inmatningstext",
    askVal: "Fråga mig vad som helst om din vistelse, Wi-Fi eller rumsservice...",
    wifiTemplate: "Wi-Fi Info Mall",
    wifiVal: "Gratis Gäst-Wi-Fi: Anslut till 'AlpineStay_Guest' med lösenord 'alpine2026'.",
    checkoutTemplate: "Utcheckningsinfo Mall",
    checkoutVal: "Standard utcheckningstid är 11:00. Meddela oss om du behöver sen utcheckning.",
    saveBtn: "Spara Alla Inställningar och Språk",
    secTitle: "Kontosäkerhet",
    secSub: "Uppdatera administratörsinformation och lösenord",
    newPass: "Nytt Lösenord",
    confPass: "Bekräfta Nytt Lösenord",
    updatePassBtn: "Uppdatera Lösenord",
    toastSuccess: "Inställningarna har sparats!"
  },
  ja: {
    title: "ホテル設定と構成",
    subtitle: "ホテル情報、多言語設定、セキュリティの管理",
    genConfig: "基本構成",
    genSub: "ゲスト用Wi-Fiおよび基本ホテル情報",
    hotelName: "ホテル名",
    wifiName: "Wi-Fi名 (SSID)",
    wifiPass: "Wi-Fiパスワード",
    bfTime: "朝食時間",
    coTime: "チェックアウト時間",
    multiLang: "多言語翻訳",
    multiSub: "言語ごとにAIコンシェルジュテンプレートをカスタマイズ",
    editing: "編集中の言語",
    welMsg: "ウェルカムメッセージ",
    welVal: "AlpineStayへようこそ！ご宿泊を心より歓迎いたします。本日はどのようなご用件でしょうか？",
    askPlaceholder: "AIコンシェルジュ入力プレースホルダー",
    askVal: "滞在、Wi-Fi、ルームサービスについて何でもお尋ねください...",
    wifiTemplate: "Wi-Fi情報テンプレート",
    wifiVal: "無料ゲストWi-Fi: パスワード 'alpine2026' で 'AlpineStay_Guest' に接続してください。",
    checkoutTemplate: "チェックアウト情報テンプレート",
    checkoutVal: "通常のチェックアウト時間は午前11:00です。レイトチェックアウトをご希望の場合はお知らせください。",
    saveBtn: "すべての設定と言語を保存",
    secTitle: "アカウントセキュリティ",
    secSub: "管理者資格情報とパスワードの更新",
    newPass: "新しいパスワード",
    confPass: "新しいパスワードの確認",
    updatePassBtn: "パスワードを更新",
    toastSuccess: "設定が正常に保存されました！"
  },
  ko: {
    title: "호텔 설정 및 구성",
    subtitle: "호텔 정보, 다국어 설정 및 보안 관리",
    genConfig: "일반 구성",
    genSub: "게스트 Wi-Fi 및 기본 호텔 정보",
    hotelName: "호텔 이름",
    wifiName: "Wi-Fi 이름 (SSID)",
    wifiPass: "Wi-Fi 비밀번호",
    bfTime: "조식 시간",
    coTime: "체크아웃 시간",
    multiLang: "다국어 번역",
    multiSub: "언어별 AI 컨시어지 템플릿 및 프롬프트 맞춤 설정",
    editing: "언어 편집 중",
    welMsg: "환영 메시지",
    welVal: "AlpineStay에 오신 것을 환영합니다! 모시게 되어 기쁩니다. 오늘 무엇을 도와드릴까요?",
    askPlaceholder: "AI 컨시어지 입력 텍스트",
    askVal: "숙박, Wi-Fi, 룸서비스에 대해 무엇이든 물어보세요...",
    wifiTemplate: "Wi-Fi 정보 템플릿",
    wifiVal: "무료 게스트 Wi-Fi: 비밀번호 'alpine2026'을 사용하여 'AlpineStay_Guest'에 연결하세요.",
    checkoutTemplate: "체크아웃 정보 템플릿",
    checkoutVal: "표준 체크아웃 시간은 오전 11:00입니다. 레이트 체크아웃이 필요한 경우 알려주세요.",
    saveBtn: "모든 설정 및 언어 저장",
    secTitle: "계정 보안",
    secSub: "관리자 자격 증명 및 비밀번호 업데이트",
    newPass: "새 비밀번호",
    confPass: "새 비밀번호 확인",
    updatePassBtn: "비밀번호 업데이트",
    toastSuccess: "설정이 성공적으로 저장되었습니다!"
  }
};

export default function Settings() {
  const [currentLang, setCurrentLang] = useState<string>('de');
  const [showToast, setShowToast] = useState(false);

  // Form States
  const [hotelName, setHotelName] = useState('AlpineStay');
  const [wifiSsid, setWifiSsid] = useState('AlpineStay_Guest');
  const [wifiPassword, setWifiPassword] = useState('alpine2026');
  const [breakfastTime, setBreakfastTime] = useState('7:00 AM - 10:30 AM');
  const [checkoutTime, setCheckoutTime] = useState('11:00 AM');

  // Dynamic Dictionary lookup with fallback to English
  const t = UI_DICTIONARY[currentLang] || UI_DICTIONARY.en;

  const [templates, setTemplates] = useState(UI_DICTIONARY);

  const handleLangChange = (langCode: string) => {
    setCurrentLang(langCode);
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const updateTemplateField = (field: string, value: string) => {
    setTemplates(prev => ({
      ...prev,
      [currentLang]: {
        ...(prev[currentLang] || UI_DICTIONARY[currentLang] || UI_DICTIONARY.en),
        [field]: value
      }
    }));
  };

  const currentLangObj = ALL_LANGUAGES.find(l => l.code === currentLang);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Header Control - Dynamic Active App Language Dropdown */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Active App Language:
          </span>
        </div>
        <select 
          value={currentLang} 
          onChange={(e) => handleLangChange(e.target.value)}
          className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
        >
          {ALL_LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center space-x-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-bold">{t.toastSuccess}</span>
        </div>
      )}

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">{t.subtitle}</p>
      </div>

      {/* 1. General Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base">{t.genConfig}</h2>
            <p className="text-xs text-slate-400">{t.genSub}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.hotelName}</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.wifiName}</label>
              <div className="relative">
                <Wifi className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.wifiPass}</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.bfTime}</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={breakfastTime}
                  onChange={(e) => setBreakfastTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.coTime}</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={checkoutTime}
                  onChange={(e) => setCheckoutTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Multi-Language Translations & Dynamic Template Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base">{t.multiLang}</h2>
            <p className="text-xs text-slate-400">{t.multiSub}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Language Selector Badges (All 13 Languages) */}
          <div className="flex flex-wrap gap-2">
            {ALL_LANGUAGES.map((item) => {
              const active = currentLang === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleLangChange(item.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  <span>{item.flag}</span>
                </button>
              );
            })}
          </div>

          {/* Active Template Editor Box */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-5">
            <div className="flex items-center space-x-2 text-indigo-700 font-extrabold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>{t.editing}: {currentLangObj?.label.toUpperCase()} {currentLangObj?.flag}</span>
            </div>

            {/* Template 1: Welcome Greeting */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.welMsg}</label>
              <textarea
                rows={3}
                value={templates[currentLang]?.welVal || t.welVal}
                onChange={(e) => updateTemplateField('welVal', e.target.value)}
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition leading-relaxed"
              />
            </div>

            {/* Template 2: Input Placeholder */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.askPlaceholder}</label>
              <input
                type="text"
                value={templates[currentLang]?.askVal || t.askVal}
                onChange={(e) => updateTemplateField('askVal', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Template 3: WiFi Template Message */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.wifiTemplate}</label>
              <input
                type="text"
                value={templates[currentLang]?.wifiVal || t.wifiVal}
                onChange={(e) => updateTemplateField('wifiVal', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Template 4: Checkout Template Message */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.checkoutTemplate}</label>
              <input
                type="text"
                value={templates[currentLang]?.checkoutVal || t.checkoutVal}
                onChange={(e) => updateTemplateField('checkoutVal', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <button
            onClick={triggerToast}
            type="button"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition flex items-center justify-center space-x-2 shadow-md shadow-indigo-100"
          >
            <Save className="w-4 h-4" />
            <span>{t.saveBtn}</span>
          </button>
        </div>
      </div>

      {/* 3. Account Security Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-base">{t.secTitle}</h2>
            <p className="text-xs text-slate-400">{t.secSub}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.newPass}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{t.confPass}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          <button
            onClick={triggerToast}
            type="button"
            className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition flex items-center space-x-2 shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>{t.updatePassBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
    }
