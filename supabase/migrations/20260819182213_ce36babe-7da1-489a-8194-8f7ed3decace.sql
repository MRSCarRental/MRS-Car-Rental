-- Payment provider fields for online (Squad) payments
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS provider_reference text,
  ADD COLUMN IF NOT EXISTS provider_transaction_id text,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'NGN',
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Unique reference so replayed webhooks can never create duplicate payments
CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_reference_key
  ON public.payments (provider_reference)
  WHERE provider_reference IS NOT NULL;

CREATE INDEX IF NOT EXISTS payments_booking_id_idx ON public.payments (booking_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS payments_set_updated_at ON public.payments;
CREATE TRIGGER payments_set_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Server-side overlapping-date availability check
CREATE OR REPLACE FUNCTION public.is_car_available(
  _car_id uuid,
  _start_date date,
  _end_date date,
  _exclude_booking_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.bookings b
    WHERE b.car_id = _car_id
      AND b.status IN ('pending', 'confirmed')
      AND (_exclude_booking_id IS NULL OR b.id <> _exclude_booking_id)
      AND b.start_date <= _end_date
      AND b.end_date >= _start_date
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_car_available(uuid, date, date, uuid) TO authenticated, service_role;

CREATE INDEX IF NOT EXISTS bookings_car_dates_idx ON public.bookings (car_id, start_date, end_date);