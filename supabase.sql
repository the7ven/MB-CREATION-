-- ============================================================
-- TABLE : customers
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  email          TEXT UNIQUE NOT NULL,
  phone          TEXT,
  city           TEXT,
  country        TEXT DEFAULT 'CI',
  total_orders   INTEGER NOT NULL DEFAULT 0,
  total_spent    NUMERIC(12, 2) NOT NULL DEFAULT 0,
  first_order_at TIMESTAMPTZ,
  last_order_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customers_email_idx      ON customers (email);
CREATE INDEX IF NOT EXISTS customers_created_at_idx ON customers (created_at DESC);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only" ON customers
  FOR ALL USING (auth.role() = 'authenticated');


-- ============================================================
-- TABLE : revenue  (1 ligne par mois)
-- ============================================================
CREATE TABLE IF NOT EXISTS revenue (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year         INTEGER NOT NULL,
  month        INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  amount       NUMERIC(14, 2) NOT NULL DEFAULT 0,
  orders_count INTEGER NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (year, month)
);

CREATE INDEX IF NOT EXISTS revenue_year_month_idx ON revenue (year, month);

ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin only" ON revenue
  FOR ALL USING (auth.role() = 'authenticated');


-- ============================================================
-- FONCTION + TRIGGER : se déclenche sur orders
-- ============================================================
CREATE OR REPLACE FUNCTION upsert_revenue_on_order()
RETURNS TRIGGER AS $$
DECLARE
  v_year  INTEGER;
  v_month INTEGER;
  v_amount NUMERIC;
  v_old_amount NUMERIC;
BEGIN
  -- Cas UPDATE : si la commande passe de non-completed à completed
  IF TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status != 'completed' THEN
    v_year   := EXTRACT(YEAR  FROM NEW.created_at)::INTEGER;
    v_month  := EXTRACT(MONTH FROM NEW.created_at)::INTEGER;
    v_amount := NEW.total_amount;

    INSERT INTO revenue (year, month, amount, orders_count, updated_at)
    VALUES (v_year, v_month, v_amount, 1, now())
    ON CONFLICT (year, month) DO UPDATE SET
      amount       = revenue.amount + EXCLUDED.amount,
      orders_count = revenue.orders_count + 1,
      updated_at   = now();

    INSERT INTO customers (name, email, total_orders, total_spent, first_order_at, last_order_at)
    VALUES (NEW.customer_name, NEW.customer_email, 1, v_amount, NEW.created_at, NEW.created_at)
    ON CONFLICT (email) DO UPDATE SET
      total_orders  = customers.total_orders + 1,
      total_spent   = customers.total_spent + EXCLUDED.total_spent,
      last_order_at = NEW.created_at,
      name          = EXCLUDED.name;

  -- Cas INSERT direct avec status completed
  ELSIF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
    v_year   := EXTRACT(YEAR  FROM NEW.created_at)::INTEGER;
    v_month  := EXTRACT(MONTH FROM NEW.created_at)::INTEGER;
    v_amount := NEW.total_amount;

    INSERT INTO revenue (year, month, amount, orders_count, updated_at)
    VALUES (v_year, v_month, v_amount, 1, now())
    ON CONFLICT (year, month) DO UPDATE SET
      amount       = revenue.amount + EXCLUDED.amount,
      orders_count = revenue.orders_count + 1,
      updated_at   = now();

    INSERT INTO customers (name, email, total_orders, total_spent, first_order_at, last_order_at)
    VALUES (NEW.customer_name, NEW.customer_email, 1, v_amount, NEW.created_at, NEW.created_at)
    ON CONFLICT (email) DO UPDATE SET
      total_orders  = customers.total_orders + 1,
      total_spent   = customers.total_spent + EXCLUDED.total_spent,
      last_order_at = NEW.created_at,
      name          = EXCLUDED.name;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_completed ON orders;

CREATE TRIGGER on_order_completed
  AFTER INSERT OR UPDATE OF status
  ON orders
  FOR EACH ROW
  EXECUTE FUNCTION upsert_revenue_on_order();


-- ============================================================
-- BACKFILL : importer l'historique existant de orders
-- À exécuter UNE SEULE FOIS
-- ============================================================

-- Remplir revenue depuis les orders completed existantes
INSERT INTO revenue (year, month, amount, orders_count)
SELECT
  EXTRACT(YEAR  FROM created_at)::INTEGER,
  EXTRACT(MONTH FROM created_at)::INTEGER,
  SUM(total_amount),
  COUNT(*)
FROM orders
WHERE status = 'completed'
GROUP BY 1, 2
ON CONFLICT (year, month) DO UPDATE SET
  amount       = EXCLUDED.amount,
  orders_count = EXCLUDED.orders_count,
  updated_at   = now();

-- Remplir customers depuis les orders completed existantes
INSERT INTO customers (name, email, total_orders, total_spent, first_order_at, last_order_at)
SELECT
  customer_name,
  customer_email,
  COUNT(*),
  SUM(total_amount),
  MIN(created_at),
  MAX(created_at)
FROM orders
WHERE status = 'completed'
GROUP BY customer_name, customer_email
ON CONFLICT (email) DO UPDATE SET
  total_orders   = EXCLUDED.total_orders,
  total_spent    = EXCLUDED.total_spent,
  first_order_at = EXCLUDED.first_order_at,
  last_order_at  = EXCLUDED.last_order_at;