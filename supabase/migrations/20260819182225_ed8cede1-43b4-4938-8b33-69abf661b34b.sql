REVOKE ALL ON FUNCTION public.is_car_available(uuid, date, date, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_car_available(uuid, date, date, uuid) TO service_role;