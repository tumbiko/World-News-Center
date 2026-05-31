'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { loginAction } from '@/lib/actions';
import { Globe, AlertCircle } from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await loginAction(formData);

    if (result.success && result.redirectTo) {
      // If callbackUrl is set, redirect there instead, unless it's basic landing redirection
      const cb = searchParams.get('callbackUrl');
      const finalDest = cb ? cb : result.redirectTo;
      window.location.href = finalDest;
    } else {
      setError(result.error || 'Authentication failed.');
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[460px] p-10 rounded-2xl shadow-2xl relative z-10 bg-card/60 backdrop-blur-md border border-border animate-fade-in">
      <div className="text-center mb-8">
        <Globe className="h-10 w-10 text-primary mx-auto mb-3" />
        <h2 className="gradient-text font-display font-extrabold text-3xl">
          Welcome Back
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Sign in to your World News Center account</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3.5 rounded-xl text-sm mb-6 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="email">Email Address</label>
          <input
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            type="email"
            id="email"
            name="email"
            placeholder="john@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col mb-2">
          <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="password">Password</label>
          <input
            className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full py-3.5 cursor-pointer"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center mt-6 text-muted-foreground text-sm">
        Don&apos;t have an account yet?{' '}
        <Link href="/signup" className="text-primary font-semibold hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-72px-280px)] flex items-center justify-center relative py-12 px-6 overflow-hidden">
      {/* Dynamic Glowing Accent Background */}
      <div className="glow-bg pointer-events-none" style={{ width: '400px', height: '400px', top: '10%', right: '20%', background: 'var(--primary-glow)' }}></div>
      <div className="glow-bg pointer-events-none" style={{ width: '350px', height: '350px', bottom: '10%', left: '20%', background: 'var(--secondary-glow)' }}></div>

      <Suspense fallback={
        <div className="w-full max-w-[460px] p-10 rounded-2xl shadow-2xl relative z-10 bg-card/60 backdrop-blur-md border border-border flex items-center justify-center h-[300px]">
          <span className="text-sm text-muted-foreground">Loading secure session...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}

