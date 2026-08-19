import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Seo from '@/components/Seo';

type StatusResponse = {
  reference: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  bookingStatus: string | null;
  amount: number;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  car: string | null;
};

export default function PaymentStatus() {
  const [params] = useSearchParams();
  const reference = params.get('reference') ?? params.get('transaction_ref') ?? '';
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const attempts = useRef(0);

  useEffect(() => {
    if (!reference) {
      setError('No payment reference was provided.');
      setChecking(false);
      return;
    }

    let active = true;
    let timer: number | undefined;

    const poll = async () => {
      attempts.current += 1;
      const { data, error: fnError } = await supabase.functions.invoke('payment-status', {
        body: { reference },
      });
      if (!active) return;

      if (fnError || data?.error) {
        setError(data?.error ?? 'We could not check your payment right now.');
        setChecking(false);
        return;
      }

      setStatus(data as StatusResponse);

      // Keep polling while the webhook confirmation is still in flight (~60s).
      if (data.paymentStatus === 'pending' && attempts.current < 12) {
        timer = window.setTimeout(poll, 5000);
      } else {
        setChecking(false);
      }
    };

    poll();
    return () => {
      active = false;
      if (timer) window.clearTimeout(timer);
    };
  }, [reference]);

  const paid = status?.paymentStatus === 'paid';
  const pending = status?.paymentStatus === 'pending';

  return (
    <>
      <Seo
        title="Payment Status | MRS Car Rental"
        description="Check the status of your MRS Car Rental booking payment."
        canonical="https://mrscarrental.lovable.app/payment-status"
        noindex
      />
      <main className="min-h-[70vh] bg-luxury-cream py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-elegant p-8 text-center">
          {error ? (
            <>
              <XCircle className="h-14 w-14 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-luxury-navy mb-2">Payment status unavailable</h1>
              <p className="text-gray-600 mb-6">{error}</p>
            </>
          ) : paid ? (
            <>
              <CheckCircle2 className="h-14 w-14 text-success-green mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-luxury-navy mb-2">Payment successful</h1>
              <p className="text-gray-600 mb-6">
                Your booking is confirmed. Our team will contact you shortly with your pickup details.
              </p>
            </>
          ) : pending ? (
            <>
              {checking ? (
                <Loader2 className="h-14 w-14 text-luxury-navy mx-auto mb-4 animate-spin" />
              ) : (
                <Clock className="h-14 w-14 text-luxury-navy mx-auto mb-4" />
              )}
              <h1 className="text-2xl font-bold text-luxury-navy mb-2">
                {checking ? 'Verifying your payment…' : 'Payment pending verification'}
              </h1>
              <p className="text-gray-600 mb-6">
                We are confirming your payment with our payment provider. This usually takes a few moments. Your booking
                is only confirmed once payment is verified - you do not need to pay again.
              </p>
            </>
          ) : (
            <>
              <Loader2 className="h-14 w-14 text-luxury-navy mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-luxury-navy mb-2">Checking your payment…</h1>
            </>
          )}

          {status && (
            <div className="bg-luxury-cream rounded-lg p-6 text-left text-sm space-y-2 mb-6">
              <p><strong>Reference:</strong> {status.reference}</p>
              {status.car && <p><strong>Car:</strong> {status.car}</p>}
              {status.startDate && <p><strong>Dates:</strong> {status.startDate} to {status.endDate}</p>}
              <p><strong>Amount:</strong> {status.currency} {Number(status.amount).toLocaleString()}</p>
              <p><strong>Booking status:</strong> {status.bookingStatus ?? 'pending'}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/2348026149390"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn justify-center"
            >
              <MessageSquare className="h-5 w-5" />
              WhatsApp Us
            </a>
            <Link to="/" className="btn-outline flex items-center justify-center gap-2">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}