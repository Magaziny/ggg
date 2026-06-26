"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Guest {
  id: number;
  name: string;
  phone: string;
  attending: number;
  guests_count: number;
  drinks: string;
  allergies: string;
}

interface GuestContextType {
  guest: Guest | null;
  setGuest: (guest: Guest | null) => void;
  loading: boolean;
  logout: () => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/guest-login");
        const data = await res.json();
        if (data.authenticated) {
          setGuest(data.guest);
        }
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/guest-logout", { method: "POST" });
      setGuest(null);
      window.location.reload(); // Refresh to show login screen
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <GuestContext.Provider value={{ guest, setGuest, loading, logout }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error("useGuest must be used within a GuestProvider");
  }
  return context;
}
