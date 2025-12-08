'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const CheckoutReturnPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang');
  const lang: 'ro' | 'en' = langParam === 'en' ? 'en' : 'ro';
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(`/dashboard?lang=${lang}&checkout=success${sessionId ? `&session_id=${sessionId}` : ''}`);
    }, 1600);
    return () => clearTimeout(timer);
  }, [router, lang, sessionId]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-red-900/60 rounded-2xl p-6 shadow-2xl text-center space-y-3">
        <div className="mx-auto w-14 h-14 rounded-full bg-red-900/40 border border-red-700 flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-red-500 border-t-transparent rounded-full"></div>
        </div>
        <h1 className="text-2xl font-bold">
          {lang === 'ro' ? 'Procesam plata...' : 'Processing payment...'}
        </h1>
        <p className="text-sm text-zinc-300">
          {lang === 'ro'
            ? 'Verificam statusul abonamentului tau. Vei fi redirectionat automat in dashboard.'
            : 'Checking your subscription status. You will be redirected to the dashboard.'}
        </p>
        {sessionId && (
          <p className="text-[11px] text-zinc-500">
            Checkout session: {sessionId}
          </p>
        )}
        <button
          className="mt-2 text-sm text-red-300 underline underline-offset-4"
          onClick={() => router.replace(`/dashboard?lang=${lang}`)}
        >
          {lang === 'ro' ? 'Intoarce-te in dashboard' : 'Back to dashboard'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutReturnPage;
