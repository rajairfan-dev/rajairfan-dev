import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'pl', name: 'Polski' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '中文' },
  { code: 'sv', name: 'Svenska' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
];

const HEADERS: Record<string, Record<string, string>> = {
  en: { name: 'Name', room: 'Room', email: 'Email', checkIn: 'Check-In', checkOut: 'Check-Out', lang: 'Language' },
  de: { name: 'Name', room: 'Zimmer', email: 'E-Mail', checkIn: 'Anreise', checkOut: 'Abreise', lang: 'Sprache' },
  it: { name: 'Nome', room: 'Camera', email: 'E-mail', checkIn: 'Check-In', checkOut: 'Check-Out', lang: 'Lingua' },
  es: { name: 'Nombre', room: 'Habitación', email: 'Correo', checkIn: 'Entrada', checkOut: 'Salida', lang: 'Idioma' },
  fr: { name: 'Nom', room: 'Chambre', email: 'E-mail', checkIn: 'Arrivée', checkOut: 'Départ', lang: 'Langue' },
  nl: { name: 'Naam', room: 'Kamer', email: 'E-mail', checkIn: 'Inchecken', checkOut: 'Uitchecken', lang: 'Taal' },
  pl: { name: 'Imię', room: 'Pokój', email: 'E-mail', checkIn: 'Zameldowanie', checkOut: 'Wymeldowanie', lang: 'Język' },
  ru: { name: 'Имя', room: 'Номер', email: 'Эл. почта', checkIn: 'Заезд', checkOut: 'Выезд', lang: 'Язык' },
  ar: { name: 'الاسم', room: 'الغرفة', email: 'البريد الإلكتروني', checkIn: 'تاريخ الوصول', checkOut: 'تاريخ المغادرة', lang: 'اللغة' },
  zh: { name: '姓名', room: '房间', email: '邮箱', checkIn: '入住', checkOut: '退房', lang: '语言' },
  sv: { name: 'Namn', room: 'Rum', email: 'E-post', checkIn: 'Incheckning', checkOut: 'Utcheckning', lang: 'Språk' },
  ja: { name: '名前', room: '部屋', email: 'メール', checkIn: 'チェックイン', checkOut: 'チェックアウト', lang: '言語' },
  ko: { name: '이름', room: '객실', email: '이메일', checkIn: '체크인', checkOut: '체크아웃', lang: '언어' },
};

export const exportGuestData = async (
  guests: any[],
  format: 'xlsx' | 'csv' | 'pdf' | 'zip',
  langCode: string
) => {
  const h = HEADERS[langCode] || HEADERS.en;

  const formattedData = guests.map((g) => ({
    [h.name]: g.name || '',
    [h.room]: g.room_number || '',
    [h.email]: g.email || 'N/A',
    [h.checkIn]: g.check_in_date || '',
    [h.checkOut]: g.check_out_date || '',
    [h.lang]: g.language || '',
  }));

  if (format === 'xlsx' || format === 'csv') {
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Guests');
    const fileType = format === 'csv' ? 'csv' : 'xlsx';
    XLSX.writeFile(workbook, `Guests_${langCode}.${fileType}`, { bookType: fileType });
  } else if (format === 'pdf') {
    const doc = new jsPDF();
    const tableHeaders = Object.values(h);
    const tableRows = formattedData.map((obj) => Object.values(obj));
    doc.setFontSize(16);
    doc.text('Guest Records', 14, 15);
    (doc as any).autoTable({ head: [tableHeaders], body: tableRows, startY: 22 });
    doc.save(`Guests_${langCode}.pdf`);
  } else if (format === 'zip') {
    const zip = new JSZip();
    const csvWorksheet = XLSX.utils.json_to_sheet(formattedData);
    const csvContent = XLSX.utils.sheet_to_csv(csvWorksheet);
    zip.file(`Guests_${langCode}.csv`, csvContent);
    zip.file(`Guests_${langCode}.json`, JSON.stringify(guests, null, 2));
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `Guests_Export_${langCode}.zip`);
  }
};
