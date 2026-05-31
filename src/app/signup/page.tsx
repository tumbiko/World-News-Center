'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signupAction } from '@/lib/actions';
import { Globe, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await signupAction(formData);

    if (result.success && result.redirectTo) {
      window.location.href = result.redirectTo;
    } else {
      setError(result.error || 'Something went wrong.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px-280px)] flex items-center justify-center relative py-12 px-6 overflow-hidden">
      {/* Dynamic Glowing Accent Background */}
      <div className="glow-bg pointer-events-none" style={{ width: '400px', height: '400px', top: '10%', left: '20%', background: 'var(--primary-glow)' }}></div>
      <div className="glow-bg pointer-events-none" style={{ width: '350px', height: '350px', bottom: '10%', right: '20%', background: 'var(--secondary-glow)' }}></div>

      <div className="w-full max-w-[460px] p-10 rounded-2xl shadow-2xl relative z-10 bg-card/60 backdrop-blur-md border border-border animate-fade-in">
        <div className="text-center mb-8">
          <Globe className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="gradient-text font-display font-extrabold text-3xl">
            Create Account
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Join World News Center today</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3.5 rounded-xl text-sm mb-6 flex items-center gap-2 animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="name">Full Name</label>
            <input
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>

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

          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="password">Password (6+ characters)</label>
            <input
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full py-3.5 mt-2 cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

