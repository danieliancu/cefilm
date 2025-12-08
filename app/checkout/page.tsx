'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/Button';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const langParam = searchParams.get('lang');
  const lang: 'ro' | 'en' = langParam === 'en' ? 'en' : 'ro';

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [mountReady, setMountReady] = useState(false);

  const stripePromiseRef = useRef<ReturnType<typeof loadStripe> | null>(null);
  const checkoutInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/?lang=${lang}`);
    }
  }, [loading, user, router, lang]);

  useEffect(() => {
    if (user?.isVip) {
      router.replace(`/dashboard?lang=${lang}`);
    }
  }, [user?.isVip, router, lang]);

  const features = useMemo(
    () => [
      {
        title: lang === 'ro' ? 'Istoric filme gasite' : 'Found movies history',
        desc: lang === 'ro' ? 'Cronologia recomandarilor cu motivatiile primite.' : 'Timeline of your recommendations.',
      },
      {
        title: lang === 'ro' ? 'Ratingul filmelor' : 'Movie ratings',
        desc: lang === 'ro' ? 'Noteaza ce ai vazut si imbunatateste recomandarile.' : 'Rate what you saw to refine picks.',
      },
      {
        title: lang === 'ro' ? 'Discutii' : 'Discussions',
        desc:
          lang === 'ro'
            ? 'Comentarii si conversatii bazate pe recomandarile primite.'
            : 'Comments and conversations around your picks.',
      },
      {
        title: lang === 'ro' ? 'Prioritate la functii noi' : 'Priority for new features',
        desc: lang === 'ro' ? 'Acces preferential la update-uri si experiente sociale.' : 'Priority access to new drops.',
      },
    ],
    [lang],
  );

  const startCheckout = async () => {
    setError(null);
    setLoadingCheckout(true);
    setClientSecret(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang }),
      });
      if (res.status === 401) {
        router.replace(`/?lang=${lang}`);
        return;
      }
      if (!res.ok) {
        setError(lang === 'ro' ? 'Nu am putut porni plata.' : 'Could not start checkout.');
        return;
      }
      const data = await res.json();
      if (!data.clientSecret) {
        setError(lang === 'ro' ? 'Lipseste client_secret pentru checkout.' : 'Missing client_secret for checkout.');
        return;
      }

      if (!stripePromiseRef.current) {
        const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!pk) {
          setError(
            lang === 'ro'
              ? 'Cheia publica Stripe lipseste. Adauga NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local.'
              : 'Stripe publishable key missing. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local.',
          );
          return;
        }
        stripePromiseRef.current = loadStripe(pk);
      }

      setClientSecret(data.clientSecret as string);
      setMountReady(true);
    } catch (e) {
      setError(lang === 'ro' ? 'Nu am putut porni plata.' : 'Could not start checkout.');
    } finally {
      setLoadingCheckout(false);
    }
  };

  useEffect(() => {
    if (!user || user.isVip) return;
    startCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, lang]);

  useEffect(() => {
    if (!clientSecret || !stripePromiseRef.current) return;

    let active = true;
    (async () => {
      const stripe = await stripePromiseRef.current!;
      if (!stripe) {
        setError(lang === 'ro' ? 'Stripe nu este configurat corect.' : 'Stripe is not configured properly.');
        return;
      }
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret });
      checkoutInstanceRef.current = checkout;
      if (active) {
        checkout.mount('#embedded-checkout');
      }
    })();

    return () => {
      active = false;
      if (checkoutInstanceRef.current) {
        checkoutInstanceRef.current.unmount();
      }
    };
  }, [clientSecret, lang]);

  const handleCancel = () => {
    router.push(`/dashboard?lang=${lang}`);
  };

  const emailLabel = user?.email || '--';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0b0c] to-[#120404] text-white flex flex-col">
      <div className="max-w-6xl w-full mx-auto px-4 md:px-6 py-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.3em] text-red-400">
            {lang === 'ro' ? 'Checkout integrat' : 'Embedded checkout'}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold">
            {lang === 'ro' ? 'Finalizeaza plata fara sa parasesti site-ul' : 'Complete payment without leaving the site'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-300">{emailLabel}</span>
          <Button variant="outline" onClick={handleCancel} className="border-red-800 text-red-300 hover:text-white">
            {lang === 'ro' ? 'Anuleaza' : 'Cancel'}
          </Button>
        </div>
      </div>

      <div className="max-w-6xl w-full mx-auto px-4 md:px-6 pb-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-[#0f0b0b] border border-red-900/50 rounded-2xl shadow-[0_0_40px_rgba(248,113,113,0.1)] p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-red-400">
                {lang === 'ro' ? 'Abonament VIP' : 'VIP subscription'}
              </p>
              <p className="text-sm text-zinc-400">
                {lang === 'ro' ? '25 lei / luna' : '25 lei / month'}
              </p>
            </div>
            <span className="text-sm text-zinc-400">{emailLabel}</span>
          </div>

          {error && (
            <div className="mb-3 text-sm text-red-200 bg-red-950/40 border border-red-800 rounded px-3 py-2">
              {error}
            </div>
          )}

          <div className="rounded-xl border border-red-900/60 bg-black/70 p-3">
            <div
              id="embedded-checkout"
              className="min-h-[640px] bg-zinc-950/60 border border-zinc-800 rounded-lg overflow-hidden relative"
            >
              {(loadingCheckout || !mountReady) && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-400">
                  <div className="animate-spin w-10 h-10 border-2 border-red-700 border-t-transparent rounded-full"></div>
                  <p className="text-sm">
                    {lang === 'ro' ? 'Pregatim checkout-ul securizat...' : 'Loading secure checkout...'}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-3 text-[11px] text-zinc-500">
              <span>{lang === 'ro' ? 'Plata securizata prin Stripe.' : 'Secure payment powered by Stripe.'}</span>
              <button
                onClick={startCheckout}
                className="text-red-300 hover:text-red-100 underline underline-offset-4"
                type="button"
              >
                {lang === 'ro' ? 'Reincarca checkout' : 'Reload checkout'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#0f0b0b] border border-red-900/50 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-red-400 mb-1">
              {lang === 'ro' ? 'Beneficii VIP' : 'VIP perks'}
            </p>
            <h3 className="text-xl font-bold mb-2">
              {lang === 'ro' ? '25 lei/luna pentru acces nelimitat' : '25 lei/month for unlimited access'}
            </h3>
            <ul className="space-y-1 text-sm text-zinc-200 list-disc list-inside">
              <li>{lang === 'ro' ? 'Filme nelimitate recomandate instant' : 'Unlimited instant recommendations'}</li>
              <li>{lang === 'ro' ? 'Istoric si discutii cu comunitatea' : 'History and community discussions'}</li>
              <li>
                {lang === 'ro'
                  ? 'Prioritate la functii noi si experiente sociale'
                  : 'Priority for new features and social drops'}
              </li>
            </ul>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {features.map((item) => (
              <div
                key={item.title}
                className="p-3 bg-black/60 border border-red-900/40 rounded-xl hover:border-red-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <span className="text-[10px] uppercase text-red-300">{lang === 'ro' ? 'Blocat' : 'Locked'}</span>
                </div>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-black/40 border border-red-900/40 rounded-xl p-3 text-sm text-zinc-300">
            <div>
              {lang === 'ro'
                ? 'Nu vrei sa continui? Poti anula si te intorci in dashboard.'
                : "Don't want to continue? Cancel and return to dashboard."}
            </div>
            <Button variant="secondary" onClick={handleCancel} className="border-red-800 text-red-300 hover:text-white">
              {lang === 'ro' ? 'Inapoi la dashboard' : 'Back to dashboard'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
