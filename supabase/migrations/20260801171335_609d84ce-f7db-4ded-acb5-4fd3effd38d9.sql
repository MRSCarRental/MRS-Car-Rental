CREATE TABLE public.booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text NOT NULL,
  pickup_location text,
  destination text,
  car_type text,
  service_type text,
  pickup_date text,
  pickup_time text,
  passengers text,
  special_requests text,
  email_sent boolean NOT NULL DEFAULT false,
  email_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_requests TO authenticated;
GRANT ALL ON public.booking_requests TO service_role;

ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage booking requests"
ON public.booking_requests
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));