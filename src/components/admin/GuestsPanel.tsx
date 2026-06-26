"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Trash2, Phone, User, Check, X, Users, Download, Printer, FileDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Guest {
  id: number;
  name: string;
  phone: string;
  attending: number;
  guests_count: number;
  drinks: string;
  allergies: string;
  with_children: number;
  created_at: string;
}

interface GuestsPanelProps {
  initialGuests: Guest[];
}

export default function GuestsPanel({ initialGuests }: GuestsPanelProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Фильтрация
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "declined" | "pending">("all");
  const [childrenFilter, setChildrenFilter] = useState<"all" | "with_children">("all");

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (guest.phone && guest.phone.includes(searchTerm));
    
    const matchesStatus = 
      statusFilter === "all" ? true :
      statusFilter === "confirmed" ? guest.attending === 1 :
      statusFilter === "declined" ? (guest.attending === 0 && guest.created_at) :
      statusFilter === "pending" ? !guest.created_at : true;

    const matchesChildren = 
      childrenFilter === "all" ? true :
      childrenFilter === "with_children" ? guest.with_children === 1 : true;

    return matchesSearch && matchesStatus && matchesChildren;
  });

  const stats = {
    total: guests.reduce((acc, g) => acc + (Number(g.guests_count) || 1), 0),
    confirmed: guests.filter((g) => g.attending).reduce((acc, g) => acc + (Number(g.guests_count) || 1), 0),
    declined: guests.filter((g) => !g.attending && g.created_at).length,
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, phone: newPhone }),
      });
      if (res.ok) {
        const data = await res.json();
        setGuests([{ 
          id: data.id, 
          name: newName, 
          phone: newPhone, 
          attending: 0, 
          guests_count: 1, 
          drinks: "", 
          allergies: "", 
          with_children: 0,
          created_at: new Date().toISOString() 
        }, ...guests]);
        setNewName("");
        setNewPhone("");
        setShowAddForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Вы уверены, что хотите удалить этого гостя?")) return;
    try {
      const res = await fetch(`/api/admin/guests?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGuests(guests.filter(g => g.id !== id));
        if (selectedGuest?.id === id) setSelectedGuest(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportExcel = async () => {
    try {
      const res = await fetch("/api/admin/guests/export");
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Список_гостей_${new Date().toLocaleDateString()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const confirmedGuests = guests.filter(g => g.attending);
    const totalPers = confirmedGuests.reduce((acc, g) => acc + (Number(g.guests_count) || 1), 0);
    const withChildren = confirmedGuests.filter(g => g.with_children).length;
    const drinking = confirmedGuests.filter(g => g.drinks && !g.drinks.toLowerCase().includes("alkogolsyz") && !g.drinks.toLowerCase().includes("б/а")).length;
    const nonDrinking = confirmedGuests.filter(g => !g.drinks || g.drinks.toLowerCase().includes("alkogolsyz") || g.drinks.toLowerCase().includes("б/а")).length;

    const content = `
      <html>
        <head>
          <title>Список гостей - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            h1 { color: #8A9A5B; border-bottom: 2px solid #8A9A5B; padding-bottom: 10px; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th, td { border: 1px solid #eee; padding: 12px; text-align: left; }
            th { background: #f9fbf7; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; }
            tr:nth-child(even) { background: #fcfcfc; }
            .status { font-weight: bold; }
            .confirmed { color: #2e7d32; }
            .declined { color: #d32f2f; }
            .summary { margin-top: 40px; padding: 30px; background: #f9fbf7; border-radius: 20px; border: 1px solid #8A9A5B/20; }
            .summary-title { font-weight: bold; text-transform: uppercase; letter-spacing: 2px; color: #8A9A5B; margin-bottom: 15px; font-size: 16px; }
            .summary-grid { display: grid; grid-template-cols: repeat(2, 1fr); gap: 15px; }
            .summary-item { font-size: 15px; }
            .summary-item b { color: #8A9A5B; font-size: 18px; }
          </style>
        </head>
        <body>
          <h1>Список гостей на свадьбу</h1>
          <table>
            <thead>
              <tr>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Статус</th>
                <th>Кол-во</th>
                <th>Напитки</th>
                <th>Дети</th>
              </tr>
            </thead>
            <tbody>
              ${guests.map(g => `
                <tr>
                  <td>${g.name}</td>
                  <td>${g.phone || "—"}</td>
                  <td class="status ${g.attending ? 'confirmed' : 'declined'}">
                    ${g.attending ? "Придет" : (g.created_at ? "Не сможет" : "Ожидание")}
                  </td>
                  <td>${g.guests_count}</td>
                  <td>${g.drinks || "—"}</td>
                  <td>${g.with_children ? "Да" : "Нет"}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-title">Итоговая статистика (Подтвержденные)</div>
            <div class="summary-grid">
              <div class="summary-item">Всего персон: <b>${totalPers}</b></div>
              <div class="summary-item">С детьми: <b>${withChildren}</b> (групп)</div>
              <div class="summary-item">Пьющие: <b>${drinking}</b></div>
              <div class="summary-item">Не пьющие / Б/а: <b>${nonDrinking}</b></div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Modal for Guest Details */}
      <AnimatePresence>
        {selectedGuest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGuest(null)}
              className="absolute inset-0 bg-wedding-graphite/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="bg-wedding-sage/10 p-8 border-b border-wedding-sage/10 relative">
                <button 
                  onClick={() => setSelectedGuest(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-wedding-graphite/40" />
                </button>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-wedding-sage/20 flex items-center justify-center">
                    <User className="text-wedding-sage w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-wedding-graphite">{selectedGuest.name}</h3>
                    <p className="text-xs text-wedding-graphite/40 uppercase tracking-widest">Информация о госте</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-wedding-graphite/40 uppercase tracking-widest">Телефон</p>
                    <div className="flex items-center gap-2 text-wedding-graphite font-mono">
                      <Phone className="w-3.5 h-3.5 text-wedding-sage" />
                      {selectedGuest.phone || "Не указан"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-wedding-graphite/40 uppercase tracking-widest">Статус</p>
                    {selectedGuest.attending ? (
                      <span className="inline-flex items-center gap-1.5 text-green-700 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        Подтвердил
                      </span>
                    ) : (
                      <span className="text-wedding-graphite/40 font-medium">Ожидание ответа</span>
                    )}
                  </div>
                </div>

                <div className="h-px bg-wedding-sage/5" />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-wedding-graphite/40 uppercase tracking-widest">Количество гостей</p>
                    <p className="text-lg font-serif text-wedding-graphite">{selectedGuest.guests_count} чел.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-wedding-graphite/40 uppercase tracking-widest">Дети</p>
                    <p className="text-sm font-medium text-wedding-graphite">
                      {selectedGuest.with_children === 1 ? (
                        <span className="text-blue-600">С детьми</span>
                      ) : (
                        <span className="text-wedding-graphite/40">Без детей</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-wedding-graphite/40 uppercase tracking-widest">Дата регистрации</p>
                    <p className="text-sm text-wedding-graphite/60 italic">
                      {selectedGuest.created_at ? new Date(selectedGuest.created_at).toLocaleString("ru-RU") : "Добавлен вручную"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="glass-card p-4 rounded-2xl bg-wedding-sage/5 border-wedding-sage/10">
                    <p className="text-[10px] text-wedding-graphite/40 uppercase tracking-widest mb-2">Напитки</p>
                    <p className="text-wedding-graphite/80 italic">{selectedGuest.drinks || "Нет предпочтений"}</p>
                  </div>
                  <div className="glass-card p-4 rounded-2xl bg-red-50/50 border-red-100">
                    <p className="text-[10px] text-wedding-graphite/40 uppercase tracking-widest mb-2">Аллергии / Пожелания</p>
                    <p className="text-wedding-graphite/80 italic">{selectedGuest.allergies || "Нет особых пожеланий"}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 flex justify-end">
                <Button onClick={() => setSelectedGuest(null)} variant="outline" className="px-8 rounded-xl">
                  Закрыть
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-wedding-graphite flex items-center gap-3">
          <Users className="text-wedding-sage w-8 h-8" />
          Список гостей
        </h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant={showAddForm ? "outline" : "primary"}
          className="rounded-full px-6 flex items-center gap-2"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {showAddForm ? "Отмена" : "Добавить гостя"}
        </Button>
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={handleExportExcel}
          variant="outline"
          className="rounded-xl px-4 py-2 text-xs flex items-center gap-2 bg-white/50 border-wedding-sage/20 hover:bg-wedding-sage/10"
        >
          <FileDown className="w-4 h-4" />
          Экспорт в Excel
        </Button>
        <Button 
          onClick={handlePrint}
          variant="outline"
          className="rounded-xl px-4 py-2 text-xs flex items-center gap-2 bg-white/50 border-wedding-sage/20 hover:bg-wedding-sage/10"
        >
          <Printer className="w-4 h-4" />
          Печать / PDF
        </Button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddGuest} className="glass-card p-8 rounded-[2rem] border-white/40 flex flex-wrap gap-4 items-end bg-white/40">
              <div className="flex-1 min-w-[240px]">
                <label className="block text-xs text-wedding-graphite/50 uppercase tracking-widest mb-2 ml-2">Имя гостя</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wedding-sage" />
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Имя Фамилия"
                    className="w-full bg-white/60 border border-wedding-sage/20 rounded-2xl py-3 pl-11 pr-4 focus:border-wedding-sage outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div className="flex-1 min-w-[240px]">
                <label className="block text-xs text-wedding-graphite/50 uppercase tracking-widest mb-2 ml-2">Телефон</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-wedding-sage" />
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+993 61 123456"
                    className="w-full bg-white/60 border border-wedding-sage/20 rounded-2xl py-3 pl-11 pr-4 focus:border-wedding-sage outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="rounded-2xl px-8 h-[50px]">
                {loading ? "..." : "Добавить"}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Фильтры */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Поиск по имени или телефону..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/60 border border-wedding-sage/20 rounded-2xl py-3 pl-4 pr-4 focus:border-wedding-sage outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white/60 border border-wedding-sage/20 rounded-xl py-2 px-4 text-xs font-medium outline-none"
          >
            <option value="all">Все статусы</option>
            <option value="confirmed">Придут</option>
            <option value="declined">Не смогут</option>
            <option value="pending">Ожидают</option>
          </select>

          <select 
            value={childrenFilter}
            onChange={(e) => setChildrenFilter(e.target.value as any)}
            className="bg-white/60 border border-wedding-sage/20 rounded-xl py-2 px-4 text-xs font-medium outline-none"
          >
            <option value="all">Все (с детьми и без)</option>
            <option value="with_children">Только с детьми</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-[2rem] shadow-sm border-white/40">
          <p className="text-xs text-wedding-graphite/50 uppercase tracking-[0.2em] mb-3">Всего гостей</p>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-serif text-wedding-graphite">{stats.total}</p>
            <p className="text-wedding-sage font-medium">персон</p>
          </div>
        </div>
        <div className="glass-card p-8 rounded-[2rem] shadow-sm border-white/40">
          <p className="text-xs text-wedding-graphite/50 uppercase tracking-[0.2em] mb-3">Подтвердили</p>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-serif text-green-600">{stats.confirmed}</p>
            <p className="text-green-600/60 font-medium">придут</p>
          </div>
        </div>
        <div className="glass-card p-8 rounded-[2rem] shadow-sm border-white/40">
          <p className="text-xs text-wedding-graphite/50 uppercase tracking-[0.2em] mb-3">Отказались</p>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-serif text-red-400">{stats.declined}</p>
            <p className="text-red-400/60 font-medium">отказов</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] shadow-xl border-white/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-wedding-sage/5 border-b border-wedding-sage/10">
                <th className="px-8 py-6 font-semibold text-wedding-graphite/70 uppercase text-xs tracking-widest">Гость</th>
                <th className="px-8 py-6 font-semibold text-wedding-graphite/70 uppercase text-xs tracking-widest">Телефон</th>
                <th className="px-8 py-6 font-semibold text-wedding-graphite/70 uppercase text-xs tracking-widest">Статус</th>
                <th className="px-8 py-6 font-semibold text-wedding-graphite/70 uppercase text-xs tracking-widest text-center">Кол-во</th>
                <th className="px-8 py-6 font-semibold text-wedding-graphite/70 uppercase text-xs tracking-widest">Напитки/Пожелания</th>
                <th className="px-8 py-6 text-center">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wedding-sage/5">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-wedding-graphite/40 italic">
                    Ничего не найдено по вашему запросу...
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr 
                    key={guest.id} 
                    onClick={() => setSelectedGuest(guest)}
                    className="hover:bg-wedding-sage/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-serif text-lg text-wedding-graphite">{guest.name}</p>
                          <p className="text-[10px] text-wedding-graphite/30 uppercase mt-1">
                            {guest.created_at ? new Date(guest.created_at).toLocaleDateString("ru-RU", {
                              day: "2-digit",
                              month: "long",
                              hour: "2-digit",
                              minute: "2-digit",
                            }) : "Ручное добавление"}
                          </p>
                        </div>
                        {guest.with_children === 1 && (
                          <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">С детьми</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-wedding-graphite/60 font-mono text-sm">{guest.phone || "—"}</p>
                    </td>
                    <td className="px-8 py-6">
                      {guest.attending ? (
                        <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-100/50 px-4 py-1 rounded-full text-xs font-medium border border-green-200">
                          <Check className="w-3 h-3" />
                          Придет
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-medium border ${guest.created_at ? 'text-red-600 bg-red-50 border-red-100' : 'text-wedding-graphite/40 bg-gray-100 border-gray-200'}`}>
                          {guest.created_at ? "Не сможет" : "Ожидание"}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-wedding-graphite font-medium">{guest.guests_count}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="max-w-[200px] space-y-1">
                        <p className="text-wedding-graphite/70 text-sm truncate font-medium" title={guest.drinks}>
                          {guest.drinks}
                        </p>
                        <p className="text-wedding-graphite/50 text-xs italic line-clamp-1" title={guest.allergies}>
                          {guest.allergies}
                        </p>
                        {!guest.drinks && !guest.allergies && <span className="text-wedding-graphite/20">—</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button 
                        onClick={(e) => handleDelete(guest.id, e)}
                        className="p-2 text-red-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}


