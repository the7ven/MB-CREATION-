// supabase/functions/notify-new-order/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const payload = await req.json();
    const order = payload.record;

    const itemsList = Array.isArray(order.items)
      ? order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")
      : "—";

    const message = `Nouvelle commande de ${order.customer_name}\nMontant: ${order.total_amount} FCFA\nArticles: ${itemsList}\nTel: ${order.phone || "—"}`;

    const phone = Deno.env.get("CALLMEBOT_PHONE");
    const apikey = Deno.env.get("CALLMEBOT_APIKEY");

    await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apikey}`
    );

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
});