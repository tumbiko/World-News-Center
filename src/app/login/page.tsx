'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { loginAction } from '@/lib/actions';
import styles from './Auth.module.css';

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
    <div className={`${styles.authCard} glass animate-fade-in`}>
      <div className={styles.header}>
        <span className={styles.logoIcon}>🌍</span>
        <h2 className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem' }}>
          Welcome Back
        </h2>
        <p className={styles.subtext}>Sign in to your World News Center account</p>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span>⚠</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <input
            className="form-input"
            type="email"
            id="email"
            name="email"
            placeholder="john@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" htmlFor="password">Password</label>
          <input
            className="form-input"
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
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.875rem' }}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className={styles.footerLink}>
        Don&apos;t have an account yet?{' '}
        <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.wrapper}>
      {/* Dynamic Glowing Accent Background */}
      <div className="glow-bg" style={{ width: '400px', height: '400px', top: '10%', right: '20%', background: 'var(--primary)' }}></div>
      <div className="glow-bg" style={{ width: '350px', height: '350px', bottom: '10%', left: '20%', background: 'var(--secondary)' }}></div>

      <Suspense fallback={
        <div className={`${styles.authCard} glass`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
          <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Loading secure session...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
