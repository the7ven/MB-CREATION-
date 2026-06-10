'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: any | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user ?? null;
      if (!mounted) return;
      setUser(sessionUser);
      if (sessionUser?.email) await fetchAdmin(sessionUser.email);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u?.email) fetchAdmin(u.email);
      else setIsAdmin(false);
    });

    return () => { mounted = false; listener?.subscription?.unsubscribe?.(); };
  }, []);

  const fetchAdmin = async (email: string) => {
    try {
      const { data } = await supabase
        .from('admins')         // ← ta table admins
        .select('email')
        .eq('email', email)
        .maybeSingle();
      setIsAdmin(Boolean(data));
    } catch {
      setIsAdmin(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}