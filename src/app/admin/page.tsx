'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Plus, Trash2, Loader2, LogOut, Package, ShoppingBag,
  Upload, History, ChevronDown, LayoutDashboard, Users,
  BarChart2, Mail, Calendar, Settings, Bell, Search,
  TrendingUp, Archive, ShieldCheck
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ============================================================
// TYPES
// ============================================================
type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  images: string[];
  is_available: boolean;
  category: string;
  badge: string;
  description: string;
  created_at: string;
  page: string | null;
  section: string | null;
  old_price: number | null;
  expires_in: string | null;
  hover_image_url: string | null;
  featured: boolean;
  sizes: string[];
  label_icon: string | null;
};

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  phone?: string;
  country?: string;
  city?: string;
  quartier?: string;
  street?: string;
  items: any;
  total_amount: number;
  status: string;
  created_at: string;
  is_test?: boolean;
  metadata?: any;
};

type HistoryItem = Order & { archived_at: string; original_order_id: string };

type AdminUser = {
  id: string;
  email: string;
  created_at: string;
};

type ActivePage = 'dashboard' | 'products' | 'orders' | 'history' | 'admins';

// ============================================================
// CONSTANTES
// ============================================================
const BUCKET = "mb-creation-article";

const CATEGORIES = [
  "Homme · Icone",
  "Homme · Icone 2.0",
  "Homme · Made of Africa",
  "Femme · Icone",
  "Femme · Icone 2.0",
  "Femme · Made of Africa",
  "Enfant · Made of Africa",
  "Trending · New Arrival",
  "Trending · Best Seller",
  "Trending · Special Offer",
];

const BADGES = ["Best Seller", "Nouveau", "Tendance", "Exclusif", "−30%", "3=2", "Retouches offertes", ""];

const SALES_DATA = [
  { month: 'Jan', current: 3.2, previous: 2.1 },
  { month: 'Fév', current: 4.8, previous: 3.0 },
  { month: 'Mar', current: 4.1, previous: 3.8 },
  { month: 'Avr', current: 6.5, previous: 4.2 },
  { month: 'Mai', current: 5.9, previous: 5.0 },
  { month: 'Jun', current: 8.2, previous: 5.8 },
  { month: 'Jul', current: 10.1, previous: 6.5 },
  { month: 'Aoû', current: 7.8, previous: 6.0 },
  { month: 'Sep', current: 9.4, previous: 7.2 },
  { month: 'Oct', current: 8.9, previous: 7.0 },
  { month: 'Nov', current: 11.5, previous: 8.5 },
  { month: 'Déc', current: 13.8, previous: 9.2 },
];

type RevenueRow = {
  year: number;
  month: number;
  amount: number;
  orders_count: number;
};

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({
  activePage,
  onNavigate,
  ordersCount,
  onSignOut,
}: {
  activePage: ActivePage;
  onNavigate: (p: ActivePage) => void;
  ordersCount: number;
  onSignOut: () => void;
}) {
  const navItems = [
    { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as ActivePage, label: 'Inventaire', icon: Package },
    { id: 'orders' as ActivePage, label: `Commandes (${ordersCount})`, icon: ShoppingBag },
    { id: 'history' as ActivePage, label: 'Historique', icon: History },
    { id: 'admins' as ActivePage, label: 'Admins', icon: ShieldCheck },
  ];

  const otherItems = [
    { label: 'Clients', icon: Users },
    { label: 'Analytique', icon: BarChart2 },
    { label: 'Messages', icon: Mail },
    { label: 'Calendrier', icon: Calendar },
  ];

  return (
    <aside className="w-56 min-h-screen bg-[#12121f] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/8">
        <div className="text-white font-black text-lg tracking-tight">MB-Creation</div>
        <div className="text-[#D4AF37] text-[9px] uppercase tracking-[0.35em] font-bold mt-0.5">Admin Panel</div>
      </div>

      {/* Nav principale */}
      <nav className="flex-1 py-4">
        <div className="px-3 mb-1">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/25 font-bold px-3 mb-2">Navigation</p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-medium transition-all mb-0.5 text-left ${
                activePage === id
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-l-2 border-[#D4AF37] pl-[10px]'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <div className="px-3 mt-4">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/25 font-bold px-3 mb-2">Autres</p>
          {otherItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-medium text-white/30 cursor-default mb-0.5"
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Bas de sidebar */}
      <div className="px-3 py-4 border-t border-white/8 space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all">
          <Settings size={14} />
          Paramètres
        </button>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-medium text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={14} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

// ============================================================
// TOPBAR
// ============================================================
function Topbar({ title, newOrderCount, onBellClick }: { title: string; newOrderCount: number; onBellClick: () => void }) {
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <div className="text-sm font-semibold text-stone-800">{title}</div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs text-gray-400 w-44">
          <Search size={12} />
          Rechercher...
        </div>
        <button onClick={onBellClick} className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors">
          <Bell size={15} className="text-gray-400" />
          {newOrderCount > 0 ? (
            <span className="absolute top-0.5 right-0.5 flex h-5 min-w-[1.2rem] items-center justify-center rounded-full bg-[#D4AF37] px-1.5 text-[10px] font-black text-black">
              {newOrderCount}
            </span>
          ) : (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
          )}
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors">
          <Mail size={15} className="text-gray-400" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[10px] font-bold text-[#12121f]">
          MB
        </div>
      </div>
    </header>
  );
}

// ============================================================
// STAT CARD
// ============================================================
function StatCard({
  label, value, sub, color,
}: {
  label: string; value: string | number; sub: string; color: 'gold' | 'blue' | 'green' | 'purple';
}) {
  const colors = {
    gold:   { bg: 'bg-amber-50',  icon: 'text-[#D4AF37]',  dot: 'bg-[#D4AF37]' },
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-500',   dot: 'bg-blue-500' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-600',  dot: 'bg-green-500' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', dot: 'bg-purple-500' },
  };
  const c = colors[color];

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      <div className={`w-9 h-9 rounded-lg ${c.bg} ${c.icon} flex items-center justify-center mb-3`}>
        <div className={`w-2 h-2 rounded-full ${c.dot}`} />
      </div>
      <div className="text-2xl font-black text-stone-900">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{label}</div>
      <div className="text-[10px] text-gray-300 mt-0.5">{sub}</div>
    </div>
  );
}

// ============================================================
// TOP PRODUCTS BAR
// ============================================================
function TopProductBar({ name, pct, color }: { name: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-3 last:mb-0">
      <div className="text-xs text-stone-700 w-28 truncate shrink-0">{name}</div>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="text-[10px] text-gray-400 w-7 text-right">{pct}%</div>
    </div>
  );
}

// ============================================================
// PAGE DASHBOARD
// ============================================================
function DashboardPage({
  products,
  orders,
  history,
  customerCount,
  salesData,
  topProducts,
  simulateOrders,
  simulateCount,
  simulateLoading,
  simulateMessage,
  onCountChange,
}: {
  products: Product[];
  orders: Order[];
  history: HistoryItem[];
  customerCount: number;
  salesData: typeof SALES_DATA;
  topProducts: { name: string; pct: number; color: string }[];
  simulateOrders?: (n?: number) => Promise<void>;
  simulateCount: number;
  simulateLoading: boolean;
  simulateMessage: string | null;
  onCountChange: (value: number) => void;
}) {
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0)
    + history
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const formatRevenue = (amount: number) => {
    if (amount <= 0) return '—';
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
    return `${amount.toLocaleString('fr-FR')}`;
  };

  const parseItems = (items: any) => {
    if (Array.isArray(items)) return items;
    if (typeof items === 'string') { try { return JSON.parse(items); } catch { return []; } }
    return [];
  };

  const statusColor = (s: string) =>
    s === 'completed' ? 'bg-green-50 text-green-700' :
    s === 'cancelled' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-700';

  const statusLabel = (s: string) =>
    s === 'completed' ? 'Terminée' : s === 'cancelled' ? 'Annulée' : 'En attente';

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="p-6 space-y-5">
      {/* Greeting */}
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-black text-stone-900">Bonjour, Admin 👋</h2>
            <p className="text-xs text-gray-400 mt-0.5">Voici un résumé de votre activité</p>
          </div>
          <div className="ml-auto flex items-center">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Tableau de bord</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total clients" value={customerCount} sub="distinct customers" color="gold" />
        <StatCard label="Produits actifs" value={products.filter(p => p.is_available).length} sub={`sur ${products.length} au total`} color="blue" />
        <StatCard label="Commandes" value={orders.length} sub={`${orders.filter(o => o.status === 'pending').length} en attente`} color="green" />
        <StatCard label="Revenus (FCFA)" value={formatRevenue(totalRevenue)} sub="commandes terminées" color="purple" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-bold uppercase tracking-widest text-stone-700">Tendance des ventes</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block" />Cette année
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />Année passée
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}M`} />
              <Tooltip
                contentStyle={{ border: '0.5px solid #e5e7eb', borderRadius: 8, fontSize: 11 }}
                formatter={(v: any) => [`${v}M FCFA`]}
              />
              <Line type="monotone" dataKey="current" stroke="#D4AF37" strokeWidth={2} dot={false} name="Cette année" />
              <Line type="monotone" dataKey="previous" stroke="#D1D5DB" strokeWidth={1.5} dot={false} strokeDasharray="4 3" name="Année passée" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="text-xs font-bold uppercase tracking-widest text-stone-700">Commandes récentes</div>
            <span className="text-[10px] text-gray-400">{orders.length} total</span>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50/70">
              <tr>
                {['Produit', 'Client', 'Date', 'Prix', 'Statut'].map(h => (
                  <th key={h} className="px-5 py-3 text-[9px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-xs text-gray-300">Aucune commande</td></tr>
              ) : recentOrders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-5 py-3 text-xs text-stone-700">
                    {parseItems(o.items)[0]?.name || '—'}
                    {parseItems(o.items).length > 1 && <span className="text-[10px] text-gray-400 ml-1">+{parseItems(o.items).length - 1}</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="text-xs font-medium text-stone-800">{o.customer_name}</div>
                    <div className="text-[10px] text-gray-400">{o.customer_email}</div>
                  </td>
                  <td className="px-5 py-3 text-[10px] text-gray-400">
                    {new Date(o.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-5 py-3 text-xs font-bold text-stone-800">
                    {o.total_amount?.toLocaleString()} <span className="text-[9px] font-normal text-gray-400">FCFA</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusColor(o.status)}`}>
                      {statusLabel(o.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="text-xs font-bold uppercase tracking-widest text-stone-700 mb-4">Top produits vendus</div>
          {topProducts.length > 0 ? topProducts.map(p => (
            <TopProductBar key={p.name} name={p.name} pct={p.pct} color={p.color} />
          )) : (
            <p className="text-xs text-gray-400">Pas encore de données de vente.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE ADMINS
// ============================================================
function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchAdmins = async () => {
    const { data } = await supabase.from('admins').select('*').order('created_at', { ascending: false });
    setAdmins(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleCreate = async () => {
    if (!form.email || !form.password) {
      setMessage({ text: 'Email et mot de passe obligatoires.', type: 'error' });
      return;
    }
    setCreating(true);
    setMessage(null);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (signUpError) throw signUpError;

      const { error: insertError } = await supabase
        .from('admins')
        .insert([{ email: form.email }]);
      if (insertError) throw insertError;

      await supabase.from('customers').upsert([{
        email: form.email,
        customer_name: form.name || form.email,
      }], { onConflict: 'email' });

      setMessage({ text: `✓ Compte admin créé pour ${form.email}`, type: 'success' });
      setForm({ name: '', email: '', password: '' });
      fetchAdmins();
    } catch (err: any) {
      setMessage({ text: err.message || 'Erreur inconnue.', type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (email: string) => {
    if (!window.confirm(`Retirer les droits admin de ${email} ?`)) return;
    await supabase.from('admins').delete().eq('email', email);
    fetchAdmins();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-black text-stone-900">Gestion des admins</h2>
        <p className="text-xs text-gray-400 mt-0.5">{admins.length} administrateur(s) actif(s)</p>
      </div>

      {/* Formulaire création */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-stone-700 mb-1">
          Créer un compte admin
        </h3>
        <p className="text-[10px] text-gray-400 mb-5">
          Le nouvel admin pourra se connecter immédiatement avec ces identifiants.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Nom complet</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Marie Dupont"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="admin@email.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Mot de passe *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none"
            />
          </div>
        </div>

        {message && (
          <p className={`text-xs mb-4 font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}

        <button
          onClick={handleCreate}
          disabled={creating}
          className="bg-[#12121f] text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-2 rounded-lg disabled:opacity-50"
        >
          {creating
            ? <><Loader2 size={12} className="animate-spin" /> Création...</>
            : <><Plus size={12} /> Créer l'admin</>
          }
        </button>
      </div>

      {/* Liste des admins */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="text-xs font-bold uppercase tracking-widest text-stone-700">Administrateurs actifs</div>
          <span className="text-[10px] text-gray-400">{admins.length} au total</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400">
            <tr>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Ajouté le</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-10 text-center">
                  <Loader2 className="animate-spin text-[#D4AF37] mx-auto" size={20} />
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-10 text-center text-gray-300 text-sm">Aucun admin</td>
              </tr>
            ) : admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[10px] font-black text-[#12121f]">
                      {admin.email[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-stone-800">{admin.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-400">
                  {new Date(admin.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(admin.email)}
                    className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors flex items-center gap-1 ml-auto"
                  >
                    <Trash2 size={13} /> Retirer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// MODAL PRODUIT
// ============================================================
function ProductModal({
  isOpen, onClose, onSaved, editProduct,
}: {
  isOpen: boolean; onClose: () => void; onSaved: () => void; editProduct?: Product | null;
}) {
  const [form, setForm] = useState({
    name: "", price: "", stock: "0", category: CATEGORIES[0], badge: "",
    description: "", image_url: "", images: ["", "", ""] as string[], is_available: true,
    page: null as string | null, section: null as string | null, old_price: "" as string,
    expires_in: "" as string, hover_image_url: "" as string, featured: false,
    sizes: "" as string, label_icon: null as string | null,
  });
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editProduct) {
      const existingImages = Array.isArray(editProduct.images) && editProduct.images.length > 0
        ? [...editProduct.images, "", ""].slice(0, 3)
        : [editProduct.image_url || "", "", ""];
      setForm({
        name: editProduct.name || "", price: String(editProduct.price || ""),
        stock: String(editProduct.stock || 0), category: editProduct.category || CATEGORIES[0],
        badge: editProduct.badge || "", description: editProduct.description || "",
        image_url: editProduct.image_url || "", images: existingImages,
        is_available: editProduct.is_available ?? true, page: editProduct.page || null,
        section: editProduct.section || null,
        old_price: editProduct.old_price ? String(editProduct.old_price) : "",
        expires_in: editProduct.expires_in || "", hover_image_url: editProduct.hover_image_url || "",
        featured: editProduct.featured ?? false,
        sizes: Array.isArray(editProduct.sizes) ? editProduct.sizes.join(", ") : "",
        label_icon: editProduct.label_icon || null,
      });
    } else {
      setForm({
        name: "", price: "", stock: "0", category: CATEGORIES[0], badge: "",
        description: "", image_url: "", images: ["", "", ""], is_available: true,
        page: null, section: null, old_price: "", expires_in: "",
        hover_image_url: "", featured: false, sizes: "", label_icon: null,
      });
    }
  }, [editProduct, isOpen]);

  const handleExtraImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `products/${Date.now()}-vue${idx}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(fileName, file, { contentType: file.type });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      setForm(f => {
        const newImages = [...f.images];
        newImages[idx] = publicUrl;
        return { ...f, images: newImages, image_url: idx === 0 ? publicUrl : f.image_url };
      });
    } catch (err: any) {
      alert("Erreur upload vue " + (idx + 1) + " : " + err.message);
    } finally {
      setUploadingIdx(null);
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price) { alert("Le nom et le prix sont obligatoires."); return; }
    setSaving(true);
    try {
      const cleanImages = form.images.filter(url => url.trim() !== "");
      const sizesArray = form.sizes ? form.sizes.split(",").map(s => s.trim()).filter(Boolean) : [];
      const isTrending = form.category.startsWith("Trending");
      const payload = {
        name: form.name.trim(), price: parseFloat(form.price), stock: parseInt(form.stock) || 0,
        category: form.category, badge: form.badge, description: form.description.trim(),
        image_url: cleanImages[0] || form.image_url, images: cleanImages,
        is_available: form.is_available, page: isTrending ? "trending" : form.page,
        section: form.section || null, old_price: form.old_price ? parseFloat(form.old_price) : null,
        expires_in: form.expires_in.trim() || null, hover_image_url: form.hover_image_url.trim() || null,
        featured: form.featured, sizes: sizesArray, label_icon: form.label_icon || null,
      };
      if (editProduct) {
        const { error } = await supabase.from("products").update(payload).eq("id", editProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
      }
      onSaved();
      onClose();
    } catch (err: any) {
      alert("Erreur : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editProduct ? "Modifier le produit" : "Nouveau produit"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">Tous les champs marqués * sont obligatoires</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 text-xl">×</button>
        </div>

        <div className="p-8 space-y-6">
          {/* Images */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Images du produit</label>
            <p className="text-[10px] text-gray-400 mb-4">Vue 1 = image principale · Vues 2 & 3 = vues supplémentaires</p>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="relative w-full h-36 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-200">
                    {form.images[idx]
                      ? <img src={form.images[idx]} alt="" className="w-full h-full object-cover" />
                      : <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                          <Upload size={18} /><span className="text-[10px] mt-1">Vue {idx + 1}</span>
                        </div>
                    }
                    {uploadingIdx === idx && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="animate-spin text-white" size={18} />
                      </div>
                    )}
                    {idx === 0 && form.images[0] && (
                      <div className="absolute top-2 left-2 bg-[#D4AF37] text-black text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Principale</div>
                    )}
                  </div>
                  <label className="bg-gray-900 text-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer rounded-lg text-center">
                    {uploadingIdx === idx ? "Upload..." : form.images[idx] ? "Changer" : "Ajouter"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleExtraImageUpload(e, idx)} disabled={uploadingIdx !== null} />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Nom + Prix */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nom *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Veste Smoking Velours"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Prix (FCFA) *</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="Ex: 720000"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" />
            </div>
          </div>

          {/* Catégorie + Badge */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Catégorie *</label>
              <div className="relative">
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none appearance-none bg-white">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Badge</label>
              <div className="relative">
                <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none appearance-none bg-white">
                  {BADGES.map(b => <option key={b} value={b}>{b || "— Aucun —"}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Stock + Visibilité */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} min={0}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Visibilité</label>
              <button onClick={() => setForm(f => ({ ...f, is_available: !f.is_available }))}
                className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-widest border-2 transition-all ${
                  form.is_available ? "border-green-500 text-green-600 bg-green-50" : "border-gray-200 text-gray-400 bg-gray-50"
                }`}>
                {form.is_available ? "✓ Visible" : "Masqué"}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="Description du produit..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none resize-none" />
          </div>

          {/* Section Trending */}
          {form.category.startsWith("Trending") && (
            <div className="border border-[#D4AF37]/30 rounded-xl p-6 bg-[#D4AF37]/5 space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#D4AF37] mb-1">Options Trending</p>
                <p className="text-[10px] text-gray-400">Ces champs s'appliquent uniquement aux produits de la page Trending.</p>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Section *</label>
                  <div className="relative">
                    <select value={form.section || ""} onChange={e => setForm(f => ({ ...f, section: e.target.value || null }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none appearance-none bg-white">
                      <option value="">— Choisir —</option>
                      <option value="new-arrivals">New Arrivals</option>
                      <option value="best-sellers">Best Sellers</option>
                      <option value="special-offers">Special Offers</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Couleur badge</label>
                  <div className="relative">
                    <select value={form.label_icon || ""} onChange={e => setForm(f => ({ ...f, label_icon: e.target.value || null }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none appearance-none bg-white">
                      <option value="">— Choisir —</option>
                      <option value="new">Noir (New Arrivals)</option>
                      <option value="fire">Or (Best Sellers)</option>
                      <option value="star">Contour or (Special Offers)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Ancien prix (FCFA)</label>
                  <input type="number" value={form.old_price} onChange={e => setForm(f => ({ ...f, old_price: e.target.value }))}
                    placeholder="Ex: 980000" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Expiration offre</label>
                  <input type="text" value={form.expires_in} onChange={e => setForm(f => ({ ...f, expires_in: e.target.value }))}
                    placeholder="Ex: 48H ou 5J" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Tailles disponibles</label>
                <input type="text" value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))}
                  placeholder="Ex: S, M, L, XL ou 2A, 4A, 6A"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Image au survol (URL)</label>
                  <input type="text" value={form.hover_image_url} onChange={e => setForm(f => ({ ...f, hover_image_url: e.target.value }))}
                    placeholder="https://..." className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Mise en avant</label>
                  <button onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                    className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-widest border-2 transition-all ${
                      form.featured ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10" : "border-gray-200 text-gray-400 bg-gray-50"
                    }`}>
                    {form.featured ? "★ En vedette" : "Standard"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-8 border-t border-gray-100">
          <button onClick={onClose} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors">Annuler</button>
          <button onClick={handleSubmit} disabled={saving}
            className="bg-[#D4AF37] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all rounded-lg flex items-center gap-2 disabled:opacity-50">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Sauvegarde...</> : editProduct ? "Mettre à jour" : "Ajouter le produit"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD PRINCIPAL
// ============================================================
export const dynamic = "force-dynamic";
export default function AdminDashboard() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [salesData, setSalesData] = useState<typeof SALES_DATA>(SALES_DATA);
  const [topProducts, setTopProducts] = useState<{ name: string; pct: number; color: string }[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [simulateCount, setSimulateCount] = useState(5);
  const [simulateLoading, setSimulateLoading] = useState(false);
  const [simulateMessage, setSimulateMessage] = useState<string | null>(null);
  const [seenOrderIds, setSeenOrderIds] = useState<string[]>([]);

  const newOrderCount = useMemo(
    () => orders.filter((order) => order.status === 'pending' && !seenOrderIds.includes(order.id)).length,
    [orders, seenOrderIds]
  );

  const markPendingOrdersAsSeen = () => {
    setSeenOrderIds((prev) => Array.from(
      new Set([...prev, ...orders.filter((order) => order.status === 'pending').map((order) => order.id)])
    ));
  };

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    if (page === 'orders') {
      markPendingOrdersAsSeen();
    }
  };

  const parseItems = (items: any) => {
    if (Array.isArray(items)) return items;
    if (typeof items === "string") { try { return JSON.parse(items); } catch { return []; } }
    return [];
  };

  const fetchData = useCallback(async () => {
    try {
      const [
        { data: prodData },
        { data: orderData },
        { data: histData },
        { data: customerData, count: customerCountRes },
        { data: revenueData },
      ] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("orders_history").select("*").order("archived_at", { ascending: false }),
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("revenue").select("*").order("year", { ascending: false }).order("month", { ascending: false }).limit(24),
      ]);

      const ordersList = orderData || [];
      setProducts(prodData || []);
      setOrders(ordersList);
      setHistory(histData || []);
      setCustomerCount(customerCountRes || 0);

      const revenueRows = revenueData || [];
      const currentYear = new Date().getFullYear();
      const previousYear = currentYear - 1;
      const currentMonthly = revenueRows
        .filter((row) => row.year === currentYear)
        .reduce((acc, row) => ({ ...acc, [row.month]: Number(row.amount) }), {} as Record<number, number>);
      const previousMonthly = revenueRows
        .filter((row) => row.year === previousYear)
        .reduce((acc, row) => ({ ...acc, [row.month]: Number(row.amount) }), {} as Record<number, number>);
      const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setSalesData(monthLabels.map((month, index) => ({
        month,
        current: (currentMonthly[index + 1] || 0) / 1_000_000,
        previous: (previousMonthly[index + 1] || 0) / 1_000_000,
      })));

      const productCount: Record<string, number> = {};
      const itemsParser = (items: any) => {
        if (Array.isArray(items)) return items;
        if (typeof items === 'string') {
          try { return JSON.parse(items); } catch { return []; }
        }
        return [];
      };
      ordersList.forEach((order) => {
        itemsParser(order.items).forEach((item: any) => {
          const name = item.name || 'Unknown';
          const quantity = Number(item.quantity || 1);
          productCount[name] = (productCount[name] || 0) + quantity;
        });
      });
      const sortedProducts = Object.entries(productCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      const totalSold = sortedProducts.reduce((sum, [, qty]) => sum + qty, 0) || 1;
      const colorPalette = ['#D4AF37', '#E9C46A', '#534AB7', '#1D9E75', '#B4B2A9'];
      setTopProducts(sortedProducts.map(([name, qty], index) => ({
        name,
        pct: Math.round((qty / totalSold) * 100),
        color: colorPalette[index % colorPalette.length],
      })));
    } catch (err: any) {
      console.error("Erreur de chargement:", err.message);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (mounted) { await fetchData(); setAuthLoading(false); }
    };
    init();
    return () => { mounted = false; };
  }, [fetchData]);

  // ============================================================
  // HELPER : mise à jour revenue (mutualisée)
  // ============================================================
  const updateRevenue = async (date: Date, delta: number, orderCountDelta: number) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const { data: existing } = await supabase
      .from("revenue")
      .select("*")
      .eq("year", year)
      .eq("month", month)
      .limit(1)
      .maybeSingle();

    if (existing) {
      await supabase.from("revenue").update({
        amount: Math.max(Number(existing.amount || 0) + delta, 0),
        orders_count: Math.max(Number(existing.orders_count || 0) + orderCountDelta, 0),
      }).eq("id", existing.id);
    } else if (delta > 0) {
      // On ne crée une ligne que si on ajoute du revenu
      await supabase.from("revenue").insert([{ year, month, amount: delta, orders_count: orderCountDelta }]);
    }
  };

  // ============================================================
  // SIMULATE ORDERS
  // ============================================================
  const simulateOrders = async (count = 5) => {
    if (count < 1) { setSimulateMessage('Le nombre de commandes doit être au moins 1.'); return; }
    if (!window.confirm(`Confirmer la simulation de ${count} commandes ?`)) return;
    setSimulateLoading(true);
    setSimulateMessage(null);
    try {
      let created = 0;
      for (let i = 0; i < count; i++) {
        const available = products.filter(p => p.is_available && (p.stock || 0) > 0);
        if (available.length === 0) break;
        const pickCount = Math.min(available.length, 1 + Math.floor(Math.random() * 3));
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        const picked = shuffled.slice(0, pickCount);
        const items = [] as any[];
        let total = 0;
        for (const p of picked) {
          const qty = Math.min(1 + Math.floor(Math.random() * 3), p.stock || 0);
          if (qty <= 0) continue;
          items.push({ id: p.id, name: p.name, price: p.price, quantity: qty });
          total += p.price * qty;
          const newStock = Math.max((p.stock || 0) - qty, 0);
          await supabase.from('products').update({ stock: newStock, is_available: newStock > 0 }).eq('id', p.id);
        }
        if (items.length === 0) continue;
        const stamp = Date.now().toString().slice(-6);
        const fakeName = `Test User ${stamp}${i}`;
        const fakeEmail = `test+${stamp}${i}@example.com`;
        const orderPayload: Record<string, any> = {
          customer_name: fakeName, customer_email: fakeEmail, items,
          total_amount: total, status: 'completed', is_test: true, metadata: { test_order: true },
        };
        const { error: orderError } = await supabase.from('orders').insert([orderPayload]);
        if (orderError) {
          const fallbackPayload = { ...orderPayload };
          delete fallbackPayload.is_test;
          delete fallbackPayload.metadata;
          const { error: fallbackError } = await supabase.from('orders').insert([fallbackPayload]);
          if (fallbackError) throw fallbackError;
        }
        try { await supabase.from('customers').upsert([{ email: fakeEmail, customer_name: fakeName }], { onConflict: 'email' }); } catch {}

        // ✅ Mise à jour revenue via le helper mutualisé (cast Number() garanti)
        try {
          await updateRevenue(new Date(), Number(total), 1);
        } catch (err) {
          console.error("Erreur revenue simulate:", err);
        }

        created += 1;
      }
      setSimulateMessage(`Simulation terminée : ${created} commande(s) créées.`);
    } catch (err: any) {
      setSimulateMessage(`Erreur de simulation : ${err.message || err}`);
    } finally {
      setSimulateLoading(false);
      await fetchData();
    }
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingId(productId);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `products/${productId}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(fileName, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      await supabase.from("products").update({ image_url: publicUrl }).eq("id", productId);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, image_url: publicUrl } : p));
    } catch (err: any) {
      alert("Erreur upload : " + err.message);
    } finally {
      setUploadingId(null);
      e.target.value = "";
    }
  };

  const updateProductField = async (id: string, field: string, value: any) => {
    await supabase.from("products").update({ [field]: value }).eq("id", id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Supprimer ce produit définitivement ?")) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // ============================================================
  // UPDATE ORDER STATUS
  // ============================================================
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    const previousStatus = order?.status;

    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    if (!order || previousStatus === newStatus) return;

    const becameCompleted = newStatus === "completed" && previousStatus !== "completed";
    const leftCompleted = previousStatus === "completed" && newStatus !== "completed";
    if (!becameCompleted && !leftCompleted) return;

    try {
      const orderDate = order.created_at ? new Date(order.created_at) : new Date();
      const amount = Number(order.total_amount || 0);
      const delta = becameCompleted ? amount : -amount;
      const countDelta = becameCompleted ? 1 : -1;

      // ✅ Utilise le helper mutualisé
      await updateRevenue(orderDate, delta, countDelta);
      await fetchData();
    } catch (err) {
      console.error("Erreur mise à jour du revenu :", err);
    }
  };

  // ============================================================
  // DELETE / ARCHIVE ORDER  ← FIX PRINCIPAL
  // ============================================================
  const deleteOrder = async (order: Order) => {
    if (!window.confirm("Archiver cette commande ?")) return;
    try {
      // 1. Insérer dans l'historique
      const { error: historyError } = await supabase.from("orders_history").insert([{
        original_order_id: order.id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        phone: order.phone,
        country: order.country,
        city: order.city,
        quartier: order.quartier,
        street: order.street,
        items: order.items,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
      }]);

      if (historyError) throw historyError;

      // 2. Supprimer de orders
      const { error: deleteError } = await supabase.from("orders").delete().eq("id", order.id);
      if (deleteError) throw deleteError;

      // 3. ✅ Si la commande était "completed", soustraire son montant du revenue
      if (order.status === "completed") {
        try {
          const orderDate = order.created_at ? new Date(order.created_at) : new Date();
          const amount = Number(order.total_amount || 0);
          await updateRevenue(orderDate, -amount, -1);
        } catch (err) {
          console.error("Erreur mise à jour revenue lors de l'archivage :", err);
        }
      }

      fetchData();
    } catch (err: any) {
      console.error("Erreur archivage :", err);
      alert("Erreur archivage : " + err.message);
    }
  };

  const statusColor = (s: string) =>
    s === "completed" ? "bg-green-50 text-green-700" :
    s === "cancelled" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700";

  const statusLabel = (s: string) =>
    s === "completed" ? "Terminée" : s === "cancelled" ? "Annulée" : "En attente";

  const pageTitles: Record<ActivePage, string> = {
    dashboard: 'Dashboard',
    products: 'Inventaire produits',
    orders: 'Gestion des commandes',
    history: 'Historique des commandes',
    admins: 'Gestion des admins',
  };

  if (authLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
      <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
      <p className="mt-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900">Accès sécurisé...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f7f8fc] font-sans">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        ordersCount={orders.length}
        onSignOut={() => { window.location.href = '/account'; }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          title={pageTitles[activePage]}
          newOrderCount={newOrderCount}
          onBellClick={() => {
            setActivePage('orders');
            setSeenOrderIds((prev) => Array.from(
              new Set([...prev, ...orders.filter((order) => order.status === 'pending').map((order) => order.id)])
            ));
          }}
        />

        <main className="flex-1 overflow-auto">
          {/* ── DASHBOARD ── */}
          {activePage === 'dashboard' && (
            <DashboardPage
              products={products} orders={orders} history={history}
              customerCount={customerCount} salesData={salesData} topProducts={topProducts}
              simulateOrders={simulateOrders} simulateCount={simulateCount}
              simulateLoading={simulateLoading} simulateMessage={simulateMessage}
              onCountChange={setSimulateCount}
            />
          )}

          {/* ── PRODUITS ── */}
          {activePage === 'products' && (
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-stone-900">Inventaire</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{products.length} produits · {products.filter(p => p.is_available).length} visibles</p>
                </div>
                <button
                  onClick={() => { setEditProduct(null); setIsModalOpen(true); }}
                  className="bg-[#12121f] text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-2 rounded-lg"
                >
                  <Plus size={14} /> Ajouter un produit
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400">
                    <tr>
                      <th className="px-6 py-4">Produit</th>
                      <th className="px-6 py-4">Catégorie</th>
                      <th className="px-6 py-4">Prix</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-center">Statut</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.length === 0 ? (
                      <tr><td colSpan={6} className="p-16 text-center text-gray-300 text-sm">Aucun produit — cliquez sur "Ajouter" pour commencer</td></tr>
                    ) : products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4 flex items-center gap-4">
                          <div className="relative w-10 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 cursor-pointer shrink-0">
                            {uploadingId === p.id ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Loader2 className="animate-spin text-white" size={14} />
                              </div>
                            ) : (
                              <>
                                {p.image_url
                                  ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                                  : <div className="w-full h-full flex items-center justify-center text-gray-300"><Upload size={14} /></div>
                                }
                                <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                  <Upload size={11} className="text-black" />
                                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleInlineImageUpload(e, p.id)} />
                                </label>
                              </>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-stone-900">{p.name}</div>
                            {p.badge && (
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded">
                                {p.badge}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="text-xs text-gray-500">{p.category}</span></td>
                        <td className="px-6 py-4">
                          <input type="number" defaultValue={p.price}
                            onBlur={(e) => updateProductField(p.id, "price", parseFloat(e.target.value))}
                            className="w-24 text-sm font-bold text-stone-900 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-[#D4AF37] outline-none py-1 transition-colors" />
                          <span className="text-[10px] text-gray-400 ml-1">FCFA</span>
                        </td>
                        <td className="px-6 py-4">
                          <input type="number" defaultValue={p.stock || 0}
                            onBlur={(e) => updateProductField(p.id, "stock", parseInt(e.target.value))}
                            className={`w-14 text-sm font-bold bg-transparent border-b border-transparent hover:border-gray-200 focus:border-[#D4AF37] outline-none py-1 transition-colors ${(p.stock || 0) < 5 ? "text-red-500" : "text-stone-900"}`} />
                          {(p.stock || 0) < 5 && <span className="text-[9px] text-red-400 block">Stock bas</span>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => updateProductField(p.id, "is_available", !p.is_available)}
                            className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                              p.is_available ? "border-green-400 text-green-600 bg-green-50" : "border-gray-200 text-gray-400 hover:border-gray-300"
                            }`}>
                            {p.is_available ? "✓ Visible" : "Masqué"}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => { setEditProduct(p); setIsModalOpen(true); }}
                              className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-stone-900 transition-colors px-2.5 py-1.5 border border-gray-200 hover:border-stone-400 rounded-lg">
                              Modifier
                            </button>
                            <Trash2 size={14} className="text-gray-200 hover:text-red-500 cursor-pointer transition-colors"
                              onClick={() => handleDeleteProduct(p.id)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── COMMANDES ── */}
          {activePage === 'orders' && (
            <div className="p-6">
              <div className="mb-5">
                <h2 className="text-lg font-black text-stone-900">Commandes</h2>
                <p className="text-xs text-gray-400 mt-0.5">{orders.filter(o => o.status === 'pending').length} en attente · {orders.filter(o => o.status === 'completed').length} terminées</p>
                <p className="text-[10px] text-stone-500 mt-2 max-w-2xl">Une commande "en attente" est une commande client validée côté boutique et à traiter manuellement par l'équipe admin.</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400">
                    <tr>{['Client', 'Articles', 'Total', 'Statut', 'Date / Heure', ''].map(h => <th key={h} className="px-6 py-4">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.length === 0 ? (
                      <tr><td colSpan={6} className="p-16 text-center text-gray-300 text-sm">Aucune commande active</td></tr>
                    ) : orders.map((o) => (
                      <tr key={o.id} className={`hover:bg-gray-50/30 transition-colors ${!seenOrderIds.includes(o.id) && o.status === 'pending' ? 'bg-[#D4AF37]/10' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-sm text-stone-900">{o.customer_name}</div>
                            {!seenOrderIds.includes(o.id) && o.status === 'pending' && (
                              <span className="inline-flex items-center rounded-full bg-[#D4AF37]/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                                Nouveau
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{o.customer_email}</div>
                          {o.phone ? (
                            <div className="text-xs text-gray-400">{o.phone}</div>
                          ) : null}
                          {o.country || o.city || o.quartier || o.street ? (
                            <div className="mt-2 text-[11px] text-stone-600">
                              <span className="font-semibold text-stone-900">Adresse :</span>
                              <span className="block">{o.street || '—'}{o.street && o.quartier ? ', ' : ''}{o.quartier || ''}</span>
                              <span className="block">{o.city || '—'}{o.city && o.country ? ', ' : ''}{o.country || ''}</span>
                            </div>
                          ) : null}
                        </td>
                        <td className="px-6 py-4">
                          {parseItems(o.items).map((item: any, i: number) => (
                            <div key={i} className="text-xs text-gray-700">
                              <span className="text-[#D4AF37] font-bold">{item.quantity}×</span> {item.name}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-sm text-stone-900">{o.total_amount?.toLocaleString()}</span>
                          <span className="text-[10px] text-gray-400 ml-1">FCFA</span>
                        </td>
                        <td className="px-6 py-4">
                          <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            className={`text-[9px] font-black uppercase tracking-[0.2em] border-none focus:ring-0 rounded-lg px-3 py-2 cursor-pointer ${statusColor(o.status)}`}>
                            <option value="pending">En attente</option>
                            <option value="completed">Terminée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          <div>{new Date(o.created_at).toLocaleDateString('fr-FR')}</div>
                          <div className="text-[11px] text-gray-500">
                            {new Date(o.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Trash2 size={14} className="text-gray-200 hover:text-red-500 cursor-pointer transition-colors" onClick={() => deleteOrder(o)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── HISTORIQUE ── */}
          {activePage === 'history' && (
            <div className="p-6">
              <div className="mb-5">
                <h2 className="text-lg font-black text-stone-900">Historique</h2>
                <p className="text-xs text-gray-400 mt-0.5">{history.length} commandes archivées</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400">
                    <tr>{['Client', 'Articles', 'Total', 'Statut final', 'Archivé le'].map(h => <th key={h} className="px-6 py-4">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {history.length === 0 ? (
                      <tr><td colSpan={5} className="p-16 text-center text-gray-300 text-sm">Aucun historique</td></tr>
                    ) : history.map((h) => (
                      <tr key={h.id} className="hover:bg-gray-50/20">
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm text-stone-900">{h.customer_name}</div>
                          <div className="text-xs text-gray-400">{h.customer_email}</div>
                          {h.phone ? (
                            <div className="text-xs text-gray-400">{h.phone}</div>
                          ) : null}
                          {h.country || h.city || h.quartier || h.street ? (
                            <div className="mt-2 text-[11px] text-stone-600">
                              <span className="font-semibold text-stone-900">Adresse :</span>
                              <span className="block">{h.street || '—'}{h.street && h.quartier ? ', ' : ''}{h.quartier || ''}</span>
                              <span className="block">{h.city || '—'}{h.city && h.country ? ', ' : ''}{h.country || ''}</span>
                            </div>
                          ) : null}
                        </td>
                        <td className="px-6 py-4">
                          {parseItems(h.items).map((item: any, i: number) => (
                            <div key={i} className="text-xs text-gray-700">
                              <span className="text-[#D4AF37] font-bold">{item.quantity}×</span> {item.name}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-sm text-stone-900">{h.total_amount?.toLocaleString()}</span>
                          <span className="text-[10px] text-gray-400 ml-1">FCFA</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${statusColor(h.status)}`}>
                            {statusLabel(h.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">{new Date(h.archived_at).toLocaleDateString("fr-FR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ADMINS ── */}
          {activePage === 'admins' && <AdminsPage />}

        </main>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditProduct(null); }}
        onSaved={fetchData}
        editProduct={editProduct}
      />
    </div>
  );
}