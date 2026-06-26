"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { 
  Plus, Trash2, Upload, Image as ImageIcon, X, 
  Heart, Music, Utensils, Cake, Camera, GlassWater, 
  Star, MapPin, Calendar, Sparkles, Waves, Clock, 
  Users, PartyPopper, Check, ChevronDown, Bell, Lock, Code
} from "lucide-react";

interface SettingsPanelProps {
  initialSettings: Record<string, string>;
}

const EVENT_PRESETS: Record<string, any> = {
  wedding: {
    envelope_text_tk: "Toý çakylygy",
    envelope_text_ru: "Свадебное приглашение",
    welcome_text_tk: "Hormatly [name], Sizi toýymyza çagyrýarys!",
    welcome_text_ru: "Дорогой(ая) [name], приглашаем вас на нашу свадьбу!",
    timing: [
      { time: "15:00", title_tk: "Çakylyk", title_ru: "Встреча гостей", desc_tk: "Milli däp-dessurlar", desc_ru: "Сбор гостей и фуршет", icon: "Clock" },
      { time: "18:00", title_tk: "Toý dabarasy", title_ru: "Торжество", desc_tk: "Prazdnik dabarasy başlanýar", desc_ru: "Начало банкета", icon: "GlassWater" },
      { time: "22:00", title_tk: "Toý torty", title_ru: "Свадебный торт", desc_tk: "Süýji pursat", desc_ru: "Разрезание торта", icon: "Cake" }
    ]
  },
  birthday: {
    envelope_text_tk: "Doglan gün çakylygy",
    envelope_text_ru: "Приглашение на День рождения",
    welcome_text_tk: "Hormatly [name], Sizi doglan günüme çagyrýaryn!",
    welcome_text_ru: "Дорогой(ая) [name], приглашаю тебя на мой день рождения!",
    timing: [
      { time: "17:00", title_tk: "Myhmanlary garşylamak", title_ru: "Сбор гостей", desc_tk: "Şadyýan pursatlar", desc_ru: "Встреча друзей и велкам-зона", icon: "PartyPopper" },
      { time: "19:00", title_tk: "Şou meýilnamasy", title_ru: "Развлекательная программа", desc_tk: "Oýunlar we tanslar", desc_ru: "Веселье, конкурсы и танцы", icon: "Music" },
      { time: "21:00", title_tk: "Doglan gün torty", title_ru: "Праздничный торт", desc_tk: "Arzuw etmek pursady", desc_ru: "Задувание свечей и торт", icon: "Cake" }
    ]
  },
  anniversary: {
    envelope_text_tk: "Ýubileý çakylygy",
    envelope_text_ru: "Приглашение на Юбилей",
    welcome_text_tk: "Hormatly [name], Sizi ýubileý dabaramyza çagyrýarys!",
    welcome_text_ru: "Дорогой(ая) [name], приглашаем вас на наш юбилейный вечер!",
    timing: [
      { time: "18:00", title_tk: "Garşylamak", title_ru: "Встреча гостей", desc_tk: "Hatyra pursatlary", desc_ru: "Аперитив и памятные фото", icon: "Camera" },
      { time: "19:00", title_tk: "Ýubileý dabarasy", title_ru: "Торжественный вечер", desc_tk: "Sözler we gutlaglar", desc_ru: "Поздравления и банкет", icon: "Star" },
      { time: "21:30", title_tk: "Tort kesmek", title_ru: "Праздничный торт", desc_tk: "Süýji pursat", desc_ru: "Торжественное разрезание торта", icon: "Cake" }
    ]
  },
  corporate: {
    envelope_text_tk: "Korporatiw çakylygy",
    envelope_text_ru: "Приглашение на мероприятие",
    welcome_text_tk: "Hormatly hyzmatdaşlar, Sizi dabaramyza çagyrýarys!",
    welcome_text_ru: "Уважаемые партнеры и коллеги, приглашаем вас на наше событие!",
    timing: [
      { time: "10:00", title_tk: "Hasaba alyş", title_ru: "Регистрация", desc_tk: "Kofe-breýk", desc_ru: "Кофе-брейк и нетворкинг", icon: "Clock" },
      { time: "11:00", title_tk: "Tanyşdyryş", title_ru: "Официальная часть", desc_tk: "Prezentasiýalar", desc_ru: "Доклады и презентации", icon: "Users" },
      { time: "18:00", title_tk: "Gala agşam", title_ru: "Гала-ужин", desc_tk: "Fursat dabarasy", desc_ru: "Вечерний фуршет и общение", icon: "GlassWater" }
    ]
  },
  other: {
    envelope_text_tk: "Çakylyk",
    envelope_text_ru: "Приглашение",
    welcome_text_tk: "Hormatly [name], Sizi dabaramyza çagyrýarys!",
    welcome_text_ru: "Дорогой(ая) [name], приглашаем вас на наше событие!",
    timing: [
      { time: "18:00", title_tk: "Başlanýan wagty", title_ru: "Начало", desc_tk: "Garşylamak", desc_ru: "Сбор гостей", icon: "Clock" },
      { time: "19:00", title_tk: "Esasy bölümi", title_ru: "Основная программа", desc_tk: "Dabara", desc_ru: "Праздник", icon: "Star" }
    ]
  }
};

const ICON_LIST = [
  { name: "Heart", icon: Heart },
  { name: "Music", icon: Music },
  { name: "Utensils", icon: Utensils },
  { name: "Cake", icon: Cake },
  { name: "Camera", icon: Camera },
  { name: "GlassWater", icon: GlassWater },
  { name: "Star", icon: Star },
  { name: "MapPin", icon: MapPin },
  { name: "Calendar", icon: Calendar },
  { name: "Sparkles", icon: Sparkles },
  { name: "Waves", icon: Waves },
  { name: "Clock", icon: Clock },
  { name: "Users", icon: Users },
  { name: "PartyPopper", icon: PartyPopper },
];

const InputGroup = ({ label, tkKey, ruKey, settings, setSettings, type = "text", isTextarea = false }: any) => (
  <div className="space-y-4">
    <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">{label}</label>
    <div className="grid grid-cols-1 gap-4">
      <div className="relative">
        <span className="absolute -left-8 top-2 text-[10px] font-bold text-wedding-sage">TK</span>
        {isTextarea ? (
          <textarea
            value={settings[tkKey] || ""}
            onChange={(e) => setSettings({ ...settings, [tkKey]: e.target.value })}
            className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 focus:border-wedding-sage outline-none transition-colors resize-none"
            rows={3}
          />
        ) : (
          <input
            type={type}
            value={settings[tkKey] || ""}
            onChange={(e) => setSettings({ ...settings, [tkKey]: e.target.value })}
            className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 focus:border-wedding-sage outline-none transition-colors"
          />
        )}
      </div>
      <div className="relative">
        <span className="absolute -left-8 top-2 text-[10px] font-bold text-wedding-graphite/30">RU</span>
        {isTextarea ? (
          <textarea
            value={settings[ruKey] || ""}
            onChange={(e) => setSettings({ ...settings, [ruKey]: e.target.value })}
            className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 focus:border-wedding-sage outline-none transition-colors resize-none"
            rows={3}
          />
        ) : (
          <input
            type={type}
            value={settings[ruKey] || ""}
            onChange={(e) => setSettings({ ...settings, [ruKey]: e.target.value })}
            className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 focus:border-wedding-sage outline-none transition-colors"
          />
        )}
      </div>
    </div>
  </div>
);

const IconPicker = ({ selected, onSelect }: { selected: string, onSelect: (name: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const SelectedIcon = ICON_LIST.find(i => i.name === selected)?.icon || Clock;

  return (
    <div className="relative">
      <label className="block text-[10px] uppercase tracking-widest text-wedding-graphite/40 mb-1">Иконка</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 flex items-center justify-center bg-wedding-sage/10 rounded-2xl text-wedding-sage hover:bg-wedding-sage hover:text-white transition-all shadow-sm"
      >
        <SelectedIcon className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-full left-0 mt-4 p-4 bg-white/95 backdrop-blur-xl border border-wedding-sage/20 rounded-[2rem] shadow-2xl z-[70] grid grid-cols-4 gap-2 w-64"
            >
              {ICON_LIST.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onSelect(item.name);
                    setIsOpen(false);
                  }}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                    selected === item.name 
                      ? "bg-wedding-sage text-white shadow-lg" 
                      : "hover:bg-wedding-sage/10 text-wedding-graphite/60"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const CollapsibleSection = ({ title, description, icon: Icon, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="glass-card rounded-[3rem] shadow-xl border-white/40 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 sm:p-12 flex items-center justify-between text-left hover:bg-wedding-sage/5 transition-colors group"
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-wedding-sage/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="text-wedding-sage w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-3xl font-serif text-wedding-graphite">{title}</h2>
            <p className="text-[10px] sm:text-xs text-wedding-graphite/40 uppercase tracking-widest mt-1">{description}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-10 h-10 rounded-full bg-wedding-sage/5 flex items-center justify-center"
        >
          <ChevronDown className="w-6 h-6 text-wedding-sage" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-8 sm:px-12 pb-12 border-t border-wedding-sage/5 pt-8 sm:pt-12">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SettingsPanel({ initialSettings }: SettingsPanelProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockPass, setUnlockPass] = useState("");
  const [showError, setShowError] = useState(false);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockPass === "masterkey") {
      setIsUnlocked(true);
      setShowError(false);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  if (!isUnlocked) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 px-4"
      >
        <div className="glass-card p-12 rounded-[3rem] shadow-2xl border-white/40 max-w-md w-full text-center space-y-8">
          <div className="w-20 h-20 bg-wedding-sage/10 rounded-3xl flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10 text-wedding-sage" />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-wedding-graphite mb-2">Доступ ограничен</h2>
            <p className="text-xs text-wedding-graphite/40 uppercase tracking-widest">Введите Master Key для управления настройками</p>
          </div>
          <form onSubmit={handleUnlock} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                value={unlockPass}
                onChange={(e) => setUnlockPass(e.target.value)}
                className={`w-full bg-white/50 border-b-2 py-3 text-center outline-none transition-all font-serif text-xl ${showError ? 'border-red-400 text-red-500' : 'border-wedding-sage/30 focus:border-wedding-sage'}`}
                autoFocus
              />
              {showError && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-[10px] uppercase tracking-widest mt-2"
                >
                  Неверный ключ доступа
                </motion.p>
              )}
            </div>
            <Button type="submit" className="w-full rounded-full py-4 shadow-xl shadow-wedding-sage/20">
              Разблокировать
            </Button>
          </form>
        </div>
      </motion.div>
    );
  }

  const safeParse = (str: string, fallback: any) => {
    try {
      return str ? JSON.parse(str) : fallback;
    } catch {
      return fallback;
    }
  };

  const timing = safeParse(settings.timing_json, []);
  const venuePhotos = safeParse(settings.venue_photos_json, []);
  const dressCodeColors = safeParse(settings.dress_code_colors_json, ['#8A9A5B', '#F7E7CE', '#36454F', '#D4AF37']);

  function updateTiming(index: number, field: string, value: string) {
    const newTiming = [...timing];
    newTiming[index] = { ...newTiming[index], [field]: value };
    setSettings({ ...settings, timing_json: JSON.stringify(newTiming) });
  }

  function addEvent() {
    const newTiming = [...timing, { 
      time: "12:00", 
      title_tk: "", 
      title_ru: "", 
      desc_tk: "", 
      desc_ru: "",
      icon: "Clock"
    }];
    setSettings({ ...settings, timing_json: JSON.stringify(newTiming) });
  }

  function removeEvent(index: number) {
    const newTiming = timing.filter((_: any, i: number) => i !== index);
    setSettings({ ...settings, timing_json: JSON.stringify(newTiming) });
  }

  function updateVenuePhoto(index: number, field: string, value: string) {
    const newPhotos = [...venuePhotos];
    newPhotos[index] = { ...newPhotos[index], [field]: value };
    setSettings({ ...settings, venue_photos_json: JSON.stringify(newPhotos) });
  }

  async function handleVenuePhotoUpload(index: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) updateVenuePhoto(index, "url", data.url);
    } catch {
      setMessage("Ошибка при загрузке");
    }
  }

  function addVenuePhoto() {
    const newPhotos = [...venuePhotos, { url: "", caption: "" }];
    setSettings({ ...settings, venue_photos_json: JSON.stringify(newPhotos) });
  }

  function removeVenuePhoto(index: number) {
    const newPhotos = venuePhotos.filter((_: any, i: number) => i !== index);
    setSettings({ ...settings, venue_photos_json: JSON.stringify(newPhotos) });
  }

  function updateDressCodeColor(index: number, value: string) {
    const newColors = [...dressCodeColors];
    newColors[index] = value;
    setSettings({ ...settings, dress_code_colors_json: JSON.stringify(newColors) });
  }

  function addDressCodeColor() {
    const newColors = [...dressCodeColors, "#ffffff"];
    setSettings({ ...settings, dress_code_colors_json: JSON.stringify(newColors) });
  }

  function removeDressCodeColor(index: number) {
    const newColors = dressCodeColors.filter((_: any, i: number) => i !== index);
    setSettings({ ...settings, dress_code_colors_json: JSON.stringify(newColors) });
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, settingKey: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage("Загрузка файла, пожалуйста подождите...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setSettings({ ...settings, [settingKey]: data.url });
        setMessage("Файл успешно загружен! Не забудьте сохранить изменения.");
      }
    } catch {
      setMessage("Ошибка при загрузке");
    }
  }

  async function saveSettings() {
    setIsSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify(settings),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setMessage("Настройки сохранены!");
      } else {
        setMessage("Ошибка при сохранении");
      }
    } catch {
      setMessage("Ошибка сети");
    } finally {
      setIsSaving(false);
    }
  }

  async function testTelegram() {
    if (!settings.telegram_bot_token || !settings.telegram_chat_id) {
      setMessage("Введите токен и ID чата");
      return;
    }
    
    setIsTestingTelegram(true);
    setMessage("Отправка теста...");
    try {
      // Сначала сохраняем, чтобы бот использовал новые настройки
      const saveRes = await fetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify(settings),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!saveRes.ok) throw new Error("Ошибка сохранения");

      const res = await fetch("/api/admin/telegram/test", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Тестовое сообщение отправлено!");
      } else {
        setMessage("❌ Ошибка: " + (data.error || "проверьте данные"));
      }
    } catch (err) {
      setMessage("❌ Ошибка при тестировании");
    } finally {
      setIsTestingTelegram(false);
    }
  }

  const handleEventTypeChange = (newType: string) => {
    const preset = EVENT_PRESETS[newType];
    if (preset && confirm(`Применить стандартные настройки для типа "${newType}"? Это обновит тексты приветствия, конверта и программу дня.`)) {
      setSettings({
        ...settings,
        event_type: newType,
        envelope_text_tk: preset.envelope_text_tk,
        envelope_text_ru: preset.envelope_text_ru,
        welcome_text_tk: preset.welcome_text_tk,
        welcome_text_ru: preset.welcome_text_ru,
        timing_json: JSON.stringify(preset.timing)
      });
    } else {
      setSettings({ ...settings, event_type: newType });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-32"
    >
      <CollapsibleSection title="Общие настройки" description="Тип события, имена и дата" icon={Heart} defaultOpen={true}>
        <div className="space-y-8">
          <div className="space-y-4 max-w-xs">
            <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Тип мероприятия</label>
            <select 
              value={settings.event_type || "wedding"}
              onChange={(e) => handleEventTypeChange(e.target.value)}
              className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 outline-none text-sm font-serif"
            >
              <option value="wedding">Свадьба / Toý</option>
              <option value="birthday">День рождения / Doglan gün</option>
              <option value="anniversary">Юбилей / Ýubileý</option>
              <option value="corporate">Корпоратив / Korporatiw</option>
              <option value="other">Другое / Başga</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <InputGroup 
              label={
                settings.event_type === "wedding" ? "Имя Невесты" : 
                settings.event_type === "birthday" ? "Имя Именинника" : 
                settings.event_type === "corporate" ? "Название компании" : "Имя 1"
              } 
              tkKey="bride_name_tk" 
              ruKey="bride_name_ru" 
              settings={settings} 
              setSettings={setSettings} 
            />
            <InputGroup 
              label={
                settings.event_type === "wedding" ? "Имя Жениха" : 
                settings.event_type === "birthday" ? "Возраст / Тема" : 
                settings.event_type === "corporate" ? "Название события" : "Имя 2"
              } 
              tkKey="groom_name_tk" 
              ruKey="groom_name_ru" 
              settings={settings} 
              setSettings={setSettings} 
            />
            <div className="col-span-1 md:col-span-2">
              <InputGroup label="Приветственный текст" tkKey="welcome_text_tk" ruKey="welcome_text_ru" settings={settings} setSettings={setSettings} isTextarea />
            </div>
            <div className="col-span-1 md:col-span-2">
              <InputGroup label="Дедлайн RSVP" tkKey="rsvp_deadline_text_tk" ruKey="rsvp_deadline_text_ru" settings={settings} setSettings={setSettings} />
            </div>
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Дата события</label>
              <input type="date" value={settings.wedding_date || ""} onChange={(e) => setSettings({ ...settings, wedding_date: e.target.value })} className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 outline-none" />
            </div>
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Время начала</label>
              <input type="time" value={settings.wedding_time || ""} onChange={(e) => setSettings({ ...settings, wedding_time: e.target.value })} className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 outline-none" />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Локация и Карта" description="Где пройдет торжество" icon={MapPin}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <InputGroup label="Название места" tkKey="venue_name_tk" ruKey="venue_name_ru" settings={settings} setSettings={setSettings} />
          <InputGroup label="Адрес" tkKey="venue_address_tk" ruKey="venue_address_ru" settings={settings} setSettings={setSettings} />
          <div className="col-span-1 md:col-span-2 space-y-4">
            <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Карта (Yandex Widget URL)</label>
            <input value={settings.map_url || ""} onChange={(e) => setSettings({ ...settings, map_url: e.target.value })} className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 outline-none" />
          </div>
          <div className="col-span-1 md:col-span-2 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif text-wedding-graphite">Фото места проведения</h3>
              <Button onClick={addVenuePhoto} variant="outline" className="rounded-full px-4 h-8 text-[10px] border-wedding-sage text-wedding-sage"><Plus className="w-3 h-3 mr-1" /> Добавить</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {venuePhotos.map((photo: any, idx: number) => (
                <div key={idx} className="bg-white/40 p-4 rounded-2xl border border-wedding-sage/10 relative group">
                  <div className="aspect-video bg-wedding-sage/5 rounded-xl mb-3 overflow-hidden flex items-center justify-center relative">
                    {photo.url ? <img src={photo.url} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-wedding-sage/20" />}
                    <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all opacity-0 group-hover:opacity-100">
                      <Upload className="text-white w-6 h-6" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleVenuePhotoUpload(idx, e.target.files[0])} />
                    </label>
                  </div>
                  <input value={photo.caption} onChange={(e) => updateVenuePhoto(idx, "caption", e.target.value)} placeholder="Подпись..." className="w-full bg-transparent border-b border-wedding-sage/20 py-1 text-sm outline-none" />
                  <button onClick={() => removeVenuePhoto(idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Оформление и Музыка" description="Цвета, музыка и дресс-код" icon={Sparkles}>
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Визуальная тема сайта и админки</label>
              <select 
                value={settings.site_theme || "theme-sage"}
                onChange={(e) => setSettings({ ...settings, site_theme: e.target.value })}
                className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 outline-none text-sm font-serif"
              >
                <option value="theme-sage">Классическая (Зелено-золотая)</option>
                <option value="theme-blush">Романтичная (Пыльная роза)</option>
                <option value="theme-ocean">Морская (Темно-синяя)</option>
                <option value="theme-terracotta">Теплая (Терракота и беж)</option>
                <option value="theme-monochrome">Современная (Черно-белая)</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Шрифт главных заголовков</label>
              <select 
                value={settings.heading_font || "Playfair_Display"}
                onChange={(e) => setSettings({ ...settings, heading_font: e.target.value })}
                className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 outline-none text-sm"
              >
                <option value="Playfair_Display" style={{ fontFamily: "var(--font-playfair)" }}>Playfair Display (Классика)</option>
                <option value="Montserrat" style={{ fontFamily: "var(--font-montserrat)" }}>Montserrat (Без засечек)</option>
                <option value="Merriweather" style={{ fontFamily: "var(--font-merriweather)" }}>Merriweather (Строгий)</option>
                <option value="PT_Serif" style={{ fontFamily: "var(--font-ptserif)" }}>PT Serif (Газетный)</option>
                <option value="Lora" style={{ fontFamily: "var(--font-lora)" }}>Lora (Мягкий)</option>
                <option value="EB_Garamond" style={{ fontFamily: "var(--font-ebgaramond)" }}>EB Garamond (Книжный)</option>
                <option value="Roboto_Slab" style={{ fontFamily: "var(--font-robotoslab)" }}>Roboto Slab (Массивный)</option>
                <option value="Cormorant_Garamond" style={{ fontFamily: "var(--font-cormorant)" }}>Cormorant Garamond (Утонченный)</option>
                <option value="Yeseva_One" style={{ fontFamily: "var(--font-yeseva)" }}>Yeseva One (Контрастный)</option>
                <option value="Pattaya" style={{ fontFamily: "var(--font-pattaya)" }}>Pattaya (Каллиграфия)</option>
                <option value="Comfortaa" style={{ fontFamily: "var(--font-comfortaa)" }}>Comfortaa (Округлый)</option>
                <option value="Custom" className="font-bold text-wedding-green">✨ Свой шрифт (Загрузить)</option>
              </select>

              {settings.heading_font === 'Custom' && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-wedding-sage/30">
                  <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50 mb-2">Файл шрифта (.ttf, .woff, .otf)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="file" 
                      accept=".ttf,.otf,.woff,.woff2"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        try {
                          const res = await fetch('/api/admin/upload', {
                            method: 'POST',
                            body: formData
                          });
                          const data = await res.json();
                          if (data.url) {
                            setSettings({ ...settings, custom_heading_font_url: data.url });
                          } else {
                            alert('Ошибка загрузки шрифта');
                          }
                        } catch (err) {
                          alert('Ошибка загрузки шрифта');
                        }
                      }}
                      className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-wedding-sage/20 file:text-wedding-green hover:file:bg-wedding-sage/30"
                    />
                  </div>
                  {settings.custom_heading_font_url && (
                    <p className="text-xs text-green-600 mt-2">✓ Шрифт успешно загружен</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-wedding-sage/5">
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Музыка (MP3)</label>
              <div className="flex gap-4">
                <input value={settings.music_url || ""} onChange={(e) => setSettings({ ...settings, music_url: e.target.value })} className="flex-1 bg-white/50 border-b border-wedding-sage/30 py-2 outline-none" />
                <label className="cursor-pointer bg-wedding-sage text-white px-4 py-2 rounded-xl text-xs uppercase tracking-widest">
                  Загрузить <input type="file" className="hidden" accept="audio/*" onChange={(e) => handleUpload(e, "music_url")} />
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Фон сайта</label>
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-white/50 rounded-lg overflow-hidden border border-wedding-sage/20">
                  {settings.main_bg && <img src={settings.main_bg} className="w-full h-full object-cover" />}
                </div>
                <label className="cursor-pointer bg-wedding-sage/10 text-wedding-sage px-4 py-2 rounded-xl text-xs uppercase tracking-widest">
                  Выбрать <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "main_bg")} />
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-wedding-sage/5">
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Дресс-код: Цвета</label>
              <div className="flex flex-wrap gap-4">
                {dressCodeColors.map((color: string, idx: number) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <input type="color" value={color} onChange={(e) => updateDressCodeColor(idx, e.target.value)} className="w-10 h-10 rounded-full cursor-pointer bg-transparent" />
                    <button onClick={() => removeDressCodeColor(idx)} className="text-[10px] text-red-400">Удалить</button>
                  </div>
                ))}
                <button onClick={addDressCodeColor} className="w-10 h-10 rounded-full border-2 border-dashed border-wedding-sage/30 flex items-center justify-center text-wedding-sage">+</button>
              </div>
            </div>
            <InputGroup label="Текст дресс-кода" tkKey="dress_code_text_tk" ruKey="dress_code_text_ru" settings={settings} setSettings={setSettings} isTextarea />
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Шрифт конверта</label>
              <select 
                value={settings.envelope_font_family || "var(--font-playfair)"}
                onChange={(e) => setSettings({ ...settings, envelope_font_family: e.target.value })}
                className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 outline-none"
              >
                <option value="var(--font-playfair)">Playfair Display</option>
                <option value="var(--font-montserrat)">Montserrat</option>
                <option value="var(--font-script)">Pattaya</option>
                <option value="'Elzevir Regular', serif">Elzevir Regular</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-wedding-sage/5">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-wedding-graphite/40">Цвет верха</label>
              <div className="flex gap-2">
                <input type="color" value={settings.envelope_color_top || "#ffffff"} onChange={(e) => setSettings({ ...settings, envelope_color_top: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                <input type="text" value={settings.envelope_color_top || ""} onChange={(e) => setSettings({ ...settings, envelope_color_top: e.target.value })} className="w-full text-xs border-b border-wedding-sage/20 outline-none bg-transparent" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-wedding-graphite/40">Цвет низа</label>
              <div className="flex gap-2">
                <input type="color" value={settings.envelope_color_bottom || "#ffffff"} onChange={(e) => setSettings({ ...settings, envelope_color_bottom: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                <input type="text" value={settings.envelope_color_bottom || ""} onChange={(e) => setSettings({ ...settings, envelope_color_bottom: e.target.value })} className="w-full text-xs border-b border-wedding-sage/20 outline-none bg-transparent" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-wedding-graphite/40">Цвет внутри</label>
              <div className="flex gap-2">
                <input type="color" value={settings.envelope_color_inside || "#ffffff"} onChange={(e) => setSettings({ ...settings, envelope_color_inside: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                <input type="text" value={settings.envelope_color_inside || ""} onChange={(e) => setSettings({ ...settings, envelope_color_inside: e.target.value })} className="w-full text-xs border-b border-wedding-sage/20 outline-none bg-transparent" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-wedding-sage/5">
             <div className="space-y-4">
                <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Восковая печать</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/50 rounded-xl overflow-hidden border border-wedding-sage/20 flex items-center justify-center relative group">
                    {settings.envelope_seal_image ? <img src={settings.envelope_seal_image} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-wedding-sage/30" />}
                  </div>
                  <label className="cursor-pointer bg-wedding-sage/10 text-wedding-sage px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest">
                    Выбрать <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "envelope_seal_image")} />
                  </label>
                </div>
              </div>
             <div className="space-y-4">
                <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Текстура бумаги</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/50 rounded-xl overflow-hidden border border-wedding-sage/20 flex items-center justify-center relative group">
                    {settings.paper_texture ? <img src={settings.paper_texture} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-wedding-sage/30" />}
                  </div>
                  <label className="cursor-pointer bg-wedding-sage/10 text-wedding-sage px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest">
                    Выбрать <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "paper_texture")} />
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Декоративные цветы</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/50 rounded-xl overflow-hidden border border-wedding-sage/20 flex items-center justify-center relative group">
                    {settings.flowers_bg ? <img src={settings.flowers_bg} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-wedding-sage/30" />}
                  </div>
                  <label className="cursor-pointer bg-wedding-sage/10 text-wedding-sage px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest">
                    Выбрать <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "flowers_bg")} />
                  </label>
                </div>
              </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Наша история" description="Ваш путь вместе" icon={ImageIcon}>
        <div className="space-y-12">
          <InputGroup label="Заголовок" tkKey="love_story_title_tk" ruKey="love_story_title_ru" settings={settings} setSettings={setSettings} />
          <InputGroup label="Текст истории" tkKey="love_story_text_tk" ruKey="love_story_text_ru" settings={settings} setSettings={setSettings} isTextarea />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Главное фото</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-24 bg-white/50 rounded-xl overflow-hidden border border-wedding-sage/20">
                  {settings.love_story_image && <img src={settings.love_story_image} className="w-full h-full object-cover" />}
                </div>
                <label className="cursor-pointer bg-wedding-sage text-white px-4 py-2 rounded-xl text-xs uppercase tracking-widest">
                  Загрузить <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "love_story_image")} />
                </label>
              </div>
            </div>
            <InputGroup label="Цитата" tkKey="love_story_quote_tk" ruKey="love_story_quote_ru" settings={settings} setSettings={setSettings} />
          </div>
        </div>
      </CollapsibleSection>
      <CollapsibleSection title="Программа дня" description="Таймлайн событий" icon={Clock}>
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={addEvent} variant="outline" className="rounded-full px-4 h-8 text-[10px] border-wedding-sage text-wedding-sage flex items-center gap-2"><Plus className="w-3 h-3 mr-1" /> Добавить</Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {timing.map((event: any, index: number) => (
              <div key={index} className="p-6 bg-white/30 rounded-3xl border border-wedding-sage/10 relative group space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <input value={event.time} onChange={(e) => updateTiming(index, "time", e.target.value)} className="w-16 bg-transparent border-b border-wedding-sage/20 py-1 font-bold outline-none" />
                    <IconPicker selected={event.icon || "Clock"} onSelect={(iconName) => updateTiming(index, "icon", iconName)} />
                  </div>
                  <button onClick={() => removeEvent(index)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputGroup label="Событие" tkKey="title_tk" ruKey="title_ru" settings={event} setSettings={(newVal: any) => {
                    const newTiming = [...timing];
                    newTiming[index] = { ...newTiming[index], ...newVal };
                    setSettings({ ...settings, timing_json: JSON.stringify(newTiming) });
                  }} />
                  <InputGroup label="Описание" tkKey="desc_tk" ruKey="desc_ru" settings={event} setSettings={(newVal: any) => {
                    const newTiming = [...timing];
                    newTiming[index] = { ...newTiming[index], ...newVal };
                    setSettings({ ...settings, timing_json: JSON.stringify(newTiming) });
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Уведомления" description="Telegram и оповещения" icon={Bell}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Telegram уведомления</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSettings({ ...settings, telegram_notifications_enabled: settings.telegram_notifications_enabled === 'true' ? 'false' : 'true' })}
                className={`w-14 h-8 rounded-full transition-all relative ${settings.telegram_notifications_enabled === 'true' ? 'bg-wedding-sage shadow-lg shadow-wedding-sage/20' : 'bg-wedding-graphite/10'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${settings.telegram_notifications_enabled === 'true' ? 'left-7' : 'left-1'}`} />
              </button>
              <span className="text-sm font-medium text-wedding-graphite">
                {settings.telegram_notifications_enabled === 'true' ? 'Включены' : 'Выключены'}
              </span>
            </div>
            <p className="text-[10px] text-wedding-graphite/40 italic leading-relaxed">
              Получайте мгновенные сообщения о новых ответах гостей (RSVP).
            </p>
            <div className="pt-2">
              <Button 
                onClick={testTelegram} 
                disabled={isTestingTelegram}
                variant="outline" 
                className="rounded-xl px-4 h-9 text-[10px] border-wedding-sage/30 text-wedding-sage hover:bg-wedding-sage/5"
              >
                {isTestingTelegram ? "..." : "Проверить соединение"}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Telegram Bot Token</label>
            <input
              type="password"
              value={settings.telegram_bot_token || ""}
              onChange={(e) => setSettings({ ...settings, telegram_bot_token: e.target.value })}
              placeholder="123456:ABC-DEF..."
              className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 focus:border-wedding-sage outline-none transition-colors"
            />
            <p className="text-[10px] text-wedding-graphite/40 italic leading-relaxed">
              Токен, полученный от @BotFather.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Telegram Chat ID</label>
            <input
              type="text"
              value={settings.telegram_chat_id || ""}
              onChange={(e) => setSettings({ ...settings, telegram_chat_id: e.target.value })}
              placeholder="Например: 123456789"
              className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 focus:border-wedding-sage outline-none transition-colors"
            />
            <p className="text-[10px] text-wedding-graphite/40 italic leading-relaxed">
              ID чата или пользователя, куда бот будет присылать уведомления.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 p-6 bg-wedding-sage/5 rounded-3xl border border-wedding-sage/10">
             <h4 className="text-sm font-serif text-wedding-graphite mb-2">Как настроить?</h4>
             <ol className="text-[10px] text-wedding-graphite/60 space-y-1 list-decimal ml-4">
               <li>Создайте бота через <a href="https://t.me/BotFather" target="_blank" className="text-wedding-sage underline">@BotFather</a> и получите <b>Token</b>.</li>
               <li>Введите полученный <b>Bot Token</b> в поле выше.</li>
               <li>Узнайте свой Chat ID через <a href="https://t.me/userinfobot" target="_blank" className="text-wedding-sage underline">@userinfobot</a>.</li>
               <li>Введите Chat ID выше и включите уведомления.</li>
             </ol>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Режим после свадьбы" description="Благодарность и архив фото" icon={PartyPopper}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="col-span-1 md:col-span-2">
            <InputGroup 
              label="Заголовок благодарности" 
              tkKey="thank_you_title_tk" 
              ruKey="thank_you_title_ru" 
              settings={settings} 
              setSettings={setSettings} 
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <InputGroup 
              label="Текст благодарности" 
              tkKey="thank_you_desc_tk" 
              ruKey="thank_you_desc_ru" 
              settings={settings} 
              setSettings={setSettings} 
              isTextarea
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Ссылка на проф. фото</label>
            <input
              type="text"
              value={settings.prof_photos_url || ""}
              onChange={(e) => setSettings({ ...settings, prof_photos_url: e.target.value })}
              placeholder="https://google.drive/..."
              className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 focus:border-wedding-sage outline-none transition-colors"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Ссылка на видео</label>
            <input
              type="text"
              value={settings.prof_videos_url || ""}
              onChange={(e) => setSettings({ ...settings, prof_videos_url: e.target.value })}
              placeholder="https://youtube.com/..."
              className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 focus:border-wedding-sage outline-none transition-colors"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Дата закрытия сайта</label>
            <input
              type="date"
              value={settings.site_close_date || ""}
              onChange={(e) => setSettings({ ...settings, site_close_date: e.target.value })}
              className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 focus:border-wedding-sage outline-none transition-colors"
            />
            <p className="text-[10px] text-wedding-graphite/40 italic leading-relaxed">
              После этой даты сайт перестанет открываться для гостей.
            </p>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Реклама разработчика" description="Кнопка заказа приглашений" icon={Code}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Показывать кнопку в футере</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSettings({ ...settings, developer_ad_enabled: settings.developer_ad_enabled === 'true' ? 'false' : 'true' })}
                className={`w-14 h-8 rounded-full transition-all relative ${settings.developer_ad_enabled === 'true' ? 'bg-wedding-sage shadow-lg shadow-wedding-sage/20' : 'bg-wedding-graphite/10'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${settings.developer_ad_enabled === 'true' ? 'left-7' : 'left-1'}`} />
              </button>
              <span className="text-sm font-medium text-wedding-graphite">
                {settings.developer_ad_enabled === 'true' ? 'Включена' : 'Выключена'}
              </span>
            </div>
            <p className="text-[10px] text-wedding-graphite/40 italic leading-relaxed">
              Включает кнопку "Заказать приглашение можно по номеру" в самом низу сайта.
            </p>
          </div>
          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-widest text-wedding-graphite/50">Ваш номер телефона</label>
            <input
              type="text"
              value={settings.developer_phone || ""}
              onChange={(e) => setSettings({ ...settings, developer_phone: e.target.value })}
              placeholder="+993 61 23 45 67"
              className="w-full bg-white/50 border-b border-wedding-sage/30 py-2 focus:border-wedding-sage outline-none transition-colors"
            />
            <p className="text-[10px] text-wedding-graphite/40 italic leading-relaxed">
              Номер будет использоваться для звонка и сохранения контакта (vCard).
            </p>
          </div>
        </div>
      </CollapsibleSection>

      <div className="flex items-center justify-between fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl glass-card p-4 rounded-full shadow-2xl border-white/60 z-50">
        <p className={`text-sm font-medium px-4 ${message.includes("Ошибка") ? "text-red-500" : "text-wedding-sage"}`}>{message}</p>
        <Button onClick={saveSettings} disabled={isSaving} className="rounded-full px-12 h-12">
          {isSaving ? "Сохранение..." : "Сохранить все изменения"}
        </Button>
      </div>
    </motion.div>
  );
}
