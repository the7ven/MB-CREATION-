'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Loader2, LogOut, Package, ShoppingBag, Upload, History, ChevronDown } from 'lucide-react';


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
  // Champs trending
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
  items: any;
  total_amount: number;
  status: string;
  created_at: string;
};

type HistoryItem = Order & { archived_at: string; original_order_id: string };

// ============================================================
// CONSTANTES
// ============================================================
const BUCKET = "mb-creation-article"

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

// ============================================================
// COMPOSANT — ADD / EDIT PRODUCT MODAL
// ============================================================
function ProductModal({
  isOpen,
  onClose,
  onSaved,
  editProduct,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editProduct?: Product | null;
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "0",
    category: CATEGORIES[0],
    badge: "",
    description: "",
    image_url: "",
    images: ["", "", ""] as string[],
    is_available: true,
    // Champs trending
    page: null as string | null,
    section: null as string | null,
    old_price: "" as string,
    expires_in: "" as string,
    hover_image_url: "" as string,
    featured: false,
    sizes: "" as string,
    label_icon: null as string | null,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (editProduct) {
      const existingImages = Array.isArray(editProduct.images) && editProduct.images.length > 0
        ? [...editProduct.images, "", ""].slice(0, 3)
        : [editProduct.image_url || "", "", ""];
      setForm({
        name: editProduct.name || "",
        price: String(editProduct.price || ""),
        stock: String(editProduct.stock || 0),
        category: editProduct.category || CATEGORIES[0],
        badge: editProduct.badge || "",
        description: editProduct.description || "",
        image_url: editProduct.image_url || "",
        images: existingImages,
        is_available: editProduct.is_available ?? true,
        // Champs trending
        page: editProduct.page || null,
        section: editProduct.section || null,
        old_price: editProduct.old_price ? String(editProduct.old_price) : "",
        expires_in: editProduct.expires_in || "",
        hover_image_url: editProduct.hover_image_url || "",
        featured: editProduct.featured ?? false,
        sizes: Array.isArray(editProduct.sizes) ? editProduct.sizes.join(", ") : "",
        label_icon: editProduct.label_icon || null,
      });
      setPreview(editProduct.image_url || "");
    } else {
      setForm({
        name: "", price: "", stock: "0", category: CATEGORIES[0], badge: "",
        description: "", image_url: "", images: ["", "", ""], is_available: true,
        page: null, section: null, old_price: "", expires_in: "",
        hover_image_url: "", featured: false, sizes: "", label_icon: null,
      });
      setPreview("");
    }
  }, [editProduct, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview immédiate
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      setForm(f => ({ ...f, image_url: publicUrl }));
    } catch (err: any) {
      alert("Erreur upload : " + err.message);
      setPreview("");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Upload pour les vues supplémentaires (images[0], images[1], images[2])
  const handleExtraImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `products/${Date.now()}-vue${idx}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, { contentType: file.type });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      setForm(f => {
        const newImages = [...f.images];
        newImages[idx] = publicUrl;
        // Vue 1 (idx=0) devient aussi image_url principale si pas encore définie
        return { ...f, images: newImages, image_url: idx === 0 ? publicUrl : f.image_url };
      });
      if (idx === 0) setPreview(publicUrl);
    } catch (err: any) {
      alert("Erreur upload vue " + (idx + 1) + " : " + err.message);
    } finally {
      setUploadingIdx(null);
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price) {
      alert("Le nom et le prix sont obligatoires.");
      return;
    }

    setSaving(true);
    try {
      const cleanImages = form.images.filter(url => url.trim() !== "");
      // Sizes : convertir "S, M, L" en tableau ["S","M","L"]
      const sizesArray = form.sizes
        ? form.sizes.split(",").map(s => s.trim()).filter(Boolean)
        : [];

      // Page trending : détecter si catégorie commence par "Trending"
      const isTrending = form.category.startsWith("Trending");

      const payload = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        category: form.category,
        badge: form.badge,
        description: form.description.trim(),
        image_url: cleanImages[0] || form.image_url,
        images: cleanImages,
        is_available: form.is_available,
        // Champs trending
        page: isTrending ? "trending" : form.page,
        section: form.section || null,
        old_price: form.old_price ? parseFloat(form.old_price) : null,
        expires_in: form.expires_in.trim() || null,
        hover_image_url: form.hover_image_url.trim() || null,
        featured: form.featured,
        sizes: sizesArray,
        label_icon: form.label_icon || null,
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
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editProduct ? "Modifier le produit" : "Nouveau produit"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">Tous les champs marqués * sont obligatoires</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 text-xl">
            ×
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Images — 3 vues */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Images du produit</label>
            <p className="text-[10px] text-gray-400 mb-4">Vue 1 = image principale affichée dans la grille · Vues 2 & 3 = vues supplémentaires dans la modale</p>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="relative w-full h-36 bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-200">
                    {form.images[idx] ? (
                      <img src={form.images[idx]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                        <Upload size={18} />
                        <span className="text-[10px] mt-1">Vue {idx + 1}</span>
                      </div>
                    )}
                    {uploadingIdx === idx && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="animate-spin text-white" size={18} />
                      </div>
                    )}
                    {idx === 0 && form.images[0] && (
                      <div className="absolute top-2 left-2 bg-[#D4AF37] text-black text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                        Principale
                      </div>
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
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ex: Veste Smoking Velours"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Prix (FCFA) *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="Ex: 720000"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none"
              />
            </div>
          </div>

          {/* Catégorie + Badge */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Catégorie *</label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none appearance-none bg-white"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Badge</label>
              <div className="relative">
                <select
                  value={form.badge}
                  onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none appearance-none bg-white"
                >
                  {BADGES.map(b => <option key={b} value={b}>{b || "— Aucun —"}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Stock + Disponibilité */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                min={0}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Visibilité</label>
              <button
                onClick={() => setForm(f => ({ ...f, is_available: !f.is_available }))}
                className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-widest border-2 transition-all ${
                  form.is_available
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-gray-200 text-gray-400 bg-gray-50"
                }`}
              >
                {form.is_available ? "✓ Visible" : "Masqué"}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Description du produit..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none resize-none"
            />
          </div>

          {/* ── SECTION TRENDING ── */}
          {form.category.startsWith("Trending") && (
            <div className="border border-[#D4AF37]/30 rounded-xl p-6 bg-[#D4AF37]/5 space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#D4AF37] mb-1">Options Trending</p>
                <p className="text-[10px] text-gray-400">Ces champs s'appliquent uniquement aux produits de la page Trending.</p>
              </div>

              {/* Section + Label icon */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Section *</label>
                  <div className="relative">
                    <select
                      value={form.section || ""}
                      onChange={e => setForm(f => ({ ...f, section: e.target.value || null }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none appearance-none bg-white"
                    >
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
                    <select
                      value={form.label_icon || ""}
                      onChange={e => setForm(f => ({ ...f, label_icon: e.target.value || null }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none appearance-none bg-white"
                    >
                      <option value="">— Choisir —</option>
                      <option value="new">Noir (New Arrivals)</option>
                      <option value="fire">Or (Best Sellers)</option>
                      <option value="star">Contour or (Special Offers)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Ancien prix + Expiration */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Ancien prix (FCFA)</label>
                  <input
                    type="number"
                    value={form.old_price}
                    onChange={e => setForm(f => ({ ...f, old_price: e.target.value }))}
                    placeholder="Ex: 980000"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none"
                  />
                  <p className="text-[10px] text-gray-300 mt-1">Affiché barré si renseigné</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Expiration offre</label>
                  <input
                    type="text"
                    value={form.expires_in}
                    onChange={e => setForm(f => ({ ...f, expires_in: e.target.value }))}
                    placeholder="Ex: 48H ou 5J"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none"
                  />
                  <p className="text-[10px] text-gray-300 mt-1">Laissez vide si pas d'expiration</p>
                </div>
              </div>

              {/* Tailles */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Tailles disponibles</label>
                <input
                  type="text"
                  value={form.sizes}
                  onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))}
                  placeholder="Ex: S, M, L, XL ou 2A, 4A, 6A"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none"
                />
                <p className="text-[10px] text-gray-300 mt-1">Séparez les tailles par des virgules</p>
              </div>

              {/* Image hover + Featured */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Image au survol (URL)</label>
                  <input
                    type="text"
                    value={form.hover_image_url}
                    onChange={e => setForm(f => ({ ...f, hover_image_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-[#D4AF37] outline-none"
                  />
                  <p className="text-[10px] text-gray-300 mt-1">Optionnel — image qui s'affiche au hover</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Mise en avant</label>
                  <button
                    onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                    className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-widest border-2 transition-all ${
                      form.featured
                        ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10"
                        : "border-gray-200 text-gray-400 bg-gray-50"
                    }`}
                  >
                    {form.featured ? "★ En vedette (grand format)" : "Standard"}
                  </button>
                  <p className="text-[10px] text-gray-300 mt-1">1 seul featured par section recommandé</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-8 border-t border-gray-100">
          <button onClick={onClose} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="bg-[#D4AF37] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
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
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "history">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const parseItems = (items: any) => {
    if (Array.isArray(items)) return items;
    if (typeof items === "string") {
      try { return JSON.parse(items); } catch { return []; }
    }
    return [];
  };

  const fetchData = useCallback(async () => {
    try {
      const [{ data: prodData }, { data: orderData }, { data: histData }] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("orders_history").select("*").order("archived_at", { ascending: false }),
      ]);
      setProducts(prodData || []);
      setOrders(orderData || []);
      setHistory(histData || []);
    } catch (err: any) {
      console.error("Erreur de chargement:", err.message);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (mounted) {
        await fetchData();
        setAuthLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, [fetchData]);

  // Upload image directement depuis la table (hover sur l'image)
  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingId(productId);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `products/${productId}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, { upsert: true, contentType: file.type });

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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const deleteOrder = async (order: Order) => {
    if (!window.confirm("Archiver cette commande ?")) return;
    try {
      await supabase.from("orders_history").insert([{
        original_order_id: order.id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        items: order.items,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
      }]);
      await supabase.from("orders").delete().eq("id", order.id);
      fetchData();
    } catch (err: any) {
      alert("Erreur archivage : " + err.message);
    }
  };

  const statusColor = (status: string) =>
    status === "completed" ? "bg-green-50 text-green-700" :
    status === "cancelled" ? "bg-red-50 text-red-600" :
    "bg-orange-50 text-orange-700";

  const statusLabel = (status: string) =>
    status === "completed" ? "Terminée" :
    status === "cancelled" ? "Annulée" : "En attente";

  if (authLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
      <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
      <p className="mt-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900">Accès sécurisé...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFA] pt-24 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-stone-900">
                MB-Creation
              </h1>
              <p className="text-[9px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold mt-1">Admin Panel</p>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); window.location.href = "/admin/login"; }}
              className="flex items-center gap-2 px-4 py-2 text-xs text-gray-400 hover:text-red-500 transition-colors border border-gray-200 rounded-lg hover:border-red-200"
            >
              <LogOut size={14} /> Déconnexion
            </button>
          </div>

          {/* STATS RAPIDES */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Produits", value: products.length, sub: `${products.filter(p => p.is_available).length} visibles` },
              { label: "Commandes actives", value: orders.length, sub: `${orders.filter(o => o.status === "pending").length} en attente` },
              { label: "Historique", value: history.length, sub: "commandes archivées" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="text-3xl font-black text-stone-900">{s.value}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">{s.label}</div>
                <div className="text-[10px] text-gray-300 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div className="flex gap-8 border-b border-gray-100">
            {[
              { id: "products", label: "Inventaire", icon: Package },
              { id: "orders", label: `Commandes (${orders.length})`, icon: ShoppingBag },
              { id: "history", label: `Historique (${history.length})`, icon: History },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                    activeTab === tab.id
                      ? "border-b-2 border-[#D4AF37] text-stone-900"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Icon size={14} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── PRODUITS ── */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => { setEditProduct(null); setIsModalOpen(true); }}
                className="bg-stone-900 text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-2 rounded-xl"
              >
                <Plus size={16} /> Ajouter un produit
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-8 py-5">Produit</th>
                    <th className="px-8 py-5">Catégorie</th>
                    <th className="px-8 py-5">Prix</th>
                    <th className="px-8 py-5">Stock</th>
                    <th className="px-8 py-5 text-center">Statut</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.length === 0 ? (
                    <tr><td colSpan={6} className="p-16 text-center text-gray-300 text-sm">Aucun produit — cliquez sur "Ajouter" pour commencer</td></tr>
                  ) : products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                      {/* Image + Nom */}
                      <td className="px-8 py-5 flex items-center gap-5">
                        <div className="relative w-12 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 cursor-pointer shrink-0">
                          {uploadingId === p.id ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Loader2 className="animate-spin text-white" size={16} />
                            </div>
                          ) : (
                            <>
                              {p.image_url
                                ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                                : <div className="w-full h-full flex items-center justify-center text-gray-300"><Upload size={16} /></div>
                              }
                              <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                <Upload size={13} className="text-black" />
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleInlineImageUpload(e, p.id)} />
                              </label>
                            </>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-stone-900">{p.name}</div>
                          {p.badge && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Catégorie */}
                      <td className="px-8 py-5">
                        <span className="text-xs text-gray-500 font-medium">{p.category}</span>
                      </td>

                      {/* Prix */}
                      <td className="px-8 py-5">
                        <input
                          type="number"
                          defaultValue={p.price}
                          onBlur={(e) => updateProductField(p.id, "price", parseFloat(e.target.value))}
                          className="w-28 text-sm font-bold text-stone-900 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-[#D4AF37] outline-none py-1 transition-colors"
                        />
                        <span className="text-[10px] text-gray-400 ml-1">FCFA</span>
                      </td>

                      {/* Stock */}
                      <td className="px-8 py-5">
                        <input
                          type="number"
                          defaultValue={p.stock || 0}
                          onBlur={(e) => updateProductField(p.id, "stock", parseInt(e.target.value))}
                          className={`w-16 text-sm font-bold bg-transparent border-b border-transparent hover:border-gray-200 focus:border-[#D4AF37] outline-none py-1 transition-colors ${(p.stock || 0) < 5 ? "text-red-500" : "text-stone-900"}`}
                        />
                        {(p.stock || 0) < 5 && (
                          <span className="text-[9px] text-red-400 block">Stock bas</span>
                        )}
                      </td>

                      {/* Statut */}
                      <td className="px-8 py-5 text-center">
                        <button
                          onClick={() => updateProductField(p.id, "is_available", !p.is_available)}
                          className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border-2 transition-all ${
                            p.is_available
                              ? "border-green-400 text-green-600 bg-green-50"
                              : "border-gray-200 text-gray-400 hover:border-gray-300"
                          }`}
                        >
                          {p.is_available ? "✓ Visible" : "Masqué"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3 justify-end">
                          <button
                            onClick={() => { setEditProduct(p); setIsModalOpen(true); }}
                            className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-stone-900 transition-colors px-3 py-1.5 border border-gray-200 hover:border-stone-400 rounded-lg"
                          >
                            Modifier
                          </button>
                          <Trash2
                            size={15}
                            className="text-gray-200 hover:text-red-500 cursor-pointer transition-colors"
                            onClick={() => handleDeleteProduct(p.id)}
                          />
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
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="px-8 py-5">Client</th>
                  <th className="px-8 py-5">Articles</th>
                  <th className="px-8 py-5 text-center">Total</th>
                  <th className="px-8 py-5 text-center">Statut</th>
                  <th className="px-8 py-5 text-right">Date</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length === 0 ? (
                  <tr><td colSpan={6} className="p-16 text-center text-gray-300 text-sm">Aucune commande active</td></tr>
                ) : orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-bold text-sm text-stone-900">{o.customer_name}</div>
                      <div className="text-xs text-gray-400">{o.customer_email}</div>
                    </td>
                    <td className="px-8 py-5">
                      {parseItems(o.items).map((item: any, i: number) => (
                        <div key={i} className="text-xs text-gray-700">
                          <span className="text-[#D4AF37] font-bold">{item.quantity}×</span> {item.name}
                        </div>
                      ))}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="font-bold text-sm text-stone-900">{o.total_amount?.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400 ml-1">FCFA</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className={`text-[9px] font-black uppercase tracking-[0.2em] border-none focus:ring-0 rounded-lg px-3 py-2 cursor-pointer ${statusColor(o.status)}`}
                      >
                        <option value="pending">En attente</option>
                        <option value="completed">Terminée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </td>
                    <td className="px-8 py-5 text-right text-xs text-gray-400">
                      {new Date(o.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Trash2 size={15} className="text-gray-200 hover:text-red-500 cursor-pointer transition-colors" onClick={() => deleteOrder(o)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── HISTORIQUE ── */}
        {activeTab === "history" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="px-8 py-5">Client</th>
                  <th className="px-8 py-5">Articles</th>
                  <th className="px-8 py-5 text-center">Total</th>
                  <th className="px-8 py-5 text-center">Statut final</th>
                  <th className="px-8 py-5 text-right">Archivé le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.length === 0 ? (
                  <tr><td colSpan={5} className="p-16 text-center text-gray-300 text-sm">Aucun historique</td></tr>
                ) : history.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50/20">
                    <td className="px-8 py-5">
                      <div className="font-bold text-sm text-stone-900">{h.customer_name}</div>
                      <div className="text-xs text-gray-400">{h.customer_email}</div>
                    </td>
                    <td className="px-8 py-5">
                      {parseItems(h.items).map((item: any, i: number) => (
                        <div key={i} className="text-xs text-gray-700">
                          <span className="text-[#D4AF37] font-bold">{item.quantity}×</span> {item.name}
                        </div>
                      ))}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="font-bold text-sm text-stone-900">{h.total_amount?.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400 ml-1">FCFA</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${statusColor(h.status)}`}>
                        {statusLabel(h.status)}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right text-xs text-gray-400">
                      {new Date(h.archived_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL PRODUIT */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditProduct(null); }}
        onSaved={fetchData}
        editProduct={editProduct}
      />
    </div>
  );
}