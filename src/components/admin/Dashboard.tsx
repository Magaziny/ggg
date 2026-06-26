"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, CheckCircle, Baby, GlassWater, 
  ExternalLink, FileDown, Settings, 
  Copy, MessageCircle, PartyPopper, ChevronRight
} from "lucide-react";
import Link from "next/link";

interface Stats {
  total: number;
  confirmed: number;
  children: number;
  drinking: number;
  nonDrinking: number;
}

export default function Dashboard() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/admin/guests")
      .then(res => res.json())
      .then(data => {
        setGuests(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const stats: Stats = {
    total: guests.reduce((acc, g) => acc + (Number(g.guests_count) || 1), 0),
    confirmed: guests.filter(g => g.attending).reduce((acc, g) => acc + (Number(g.guests_count) || 1), 0),
    children: guests.filter(g => g.attending).reduce((acc, g) => acc + (Number(g.with_children) || 0), 0),
    drinking: guests.filter(g => g.attending && g.drinks && g.drinks.toLowerCase() !== "не пью").length,
    nonDrinking: guests.filter(g => g.attending && (!g.drinks || g.drinks.toLowerCase() === "не пью")).length,
  };

  const copyInviteLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="glass-card p-6 rounded-3xl border-white/40 shadow-lg hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs uppercase tracking-widest text-wedding-graphite/40 mb-1">{title}</p>
          <h3 className="text-3xl font-serif text-wedding-graphite group-hover:text-wedding-sage transition-colors">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  const handleExport = async () => {
    try {
      const res = await fetch("/api/admin/guests/export");
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "wedding_guests.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-wedding-sage border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif text-wedding-graphite">Обзор события</h1>
          <p className="text-wedding-graphite/40 uppercase tracking-widest text-xs mt-1">Добро пожаловать в центр управления</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={copyInviteLink}
            className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-wedding-sage/20 rounded-full text-xs uppercase tracking-widest text-wedding-graphite hover:bg-wedding-sage hover:text-white transition-all shadow-md"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Скопировано" : "Ссылка-приглашение"}
          </button>
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 bg-wedding-sage text-white rounded-full text-xs uppercase tracking-widest hover:bg-wedding-sage/90 transition-all shadow-md shadow-wedding-sage/20"
          >
            <ExternalLink className="w-4 h-4" />
            Просмотр сайта
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Всего гостей" value={stats.total} icon={Users} color="bg-blue-500" />
        <StatCard title="Подтвердили" value={stats.confirmed} icon={CheckCircle} color="bg-emerald-500" />
        <StatCard title="С детьми" value={stats.children} icon={Baby} color="bg-purple-500" />
        <StatCard title="Пьющие" value={stats.drinking} icon={GlassWater} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] border-white/40 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif text-wedding-graphite">Быстрые действия</h2>
              <Sparkles className="text-wedding-sage w-5 h-5" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={handleExport}
                className="flex items-center justify-between p-4 bg-white/40 hover:bg-wedding-sage/10 rounded-2xl border border-wedding-sage/5 transition-all group w-full text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-wedding-sage/10 flex items-center justify-center text-wedding-sage">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-wedding-graphite">Выгрузить отчет</span>
                </div>
                <ChevronRight className="w-4 h-4 text-wedding-graphite/20 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link href="/admin/settings" className="flex items-center justify-between p-4 bg-white/40 hover:bg-wedding-sage/10 rounded-2xl border border-wedding-sage/5 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <PartyPopper className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-wedding-graphite">Режим после свадьбы</span>
                </div>
                <ChevronRight className="w-4 h-4 text-wedding-graphite/20 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="flex items-center justify-between p-4 bg-white/40 hover:bg-wedding-sage/10 rounded-2xl border border-wedding-sage/5 transition-all group text-left">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-wedding-graphite">Связаться с гостями</span>
                </div>
                <ChevronRight className="w-4 h-4 text-wedding-graphite/20 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link href="/admin/settings" className="flex items-center justify-between p-4 bg-white/40 hover:bg-wedding-sage/10 rounded-2xl border border-wedding-sage/5 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <Settings className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-wedding-graphite">Настройки дизайна</span>
                </div>
                <ChevronRight className="w-4 h-4 text-wedding-graphite/20 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-white/40 shadow-lg">
             <h2 className="text-2xl font-serif text-wedding-graphite mb-6">Последние ответы</h2>
             <div className="space-y-4">
                {guests.slice(0, 5).map((guest, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white/20 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${guest.attending ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-400'}`} />
                      <div>
                        <p className="text-sm font-medium text-wedding-graphite">{guest.name}</p>
                        <p className="text-[10px] text-wedding-graphite/40 uppercase tracking-tighter">{new Date(guest.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-widest ${guest.attending ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                      {guest.attending ? 'Подтвердил' : 'Отклонил'}
                    </span>
                  </div>
                ))}
                {guests.length === 0 && <p className="text-center text-wedding-graphite/40 py-8 italic">Ответов пока нет</p>}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] bg-wedding-sage text-white shadow-xl shadow-wedding-sage/20 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h3 className="text-xl font-serif mb-2 relative z-10">Помощь в организации</h3>
            <p className="text-white/70 text-xs leading-relaxed mb-6 relative z-10">Если у вас возникли вопросы по работе админ-панели или нужны дополнительные функции — мы всегда на связи.</p>
            <a href="https://wa.me/yournumber" target="_blank" className="inline-flex items-center gap-2 bg-white text-wedding-sage px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all relative z-10">
              <MessageCircle className="w-4 h-4" /> Написать в WhatsApp
            </a>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-white/40 shadow-lg">
            <h3 className="text-lg font-serif text-wedding-graphite mb-4">Напитки</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <span className="text-xs text-wedding-graphite/40 uppercase tracking-widest">Пьют</span>
                  <span className="text-xl font-serif text-wedding-graphite">{stats.drinking} чел.</span>
               </div>
               <div className="w-full bg-wedding-sage/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${(stats.drinking / stats.confirmed) * 100 || 0}%` }} />
               </div>
               
               <div className="flex justify-between items-end pt-2">
                  <span className="text-xs text-wedding-graphite/40 uppercase tracking-widest">Не пьют</span>
                  <span className="text-xl font-serif text-wedding-graphite">{stats.nonDrinking} чел.</span>
               </div>
               <div className="w-full bg-wedding-sage/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(stats.nonDrinking / stats.confirmed) * 100 || 0}%` }} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);
