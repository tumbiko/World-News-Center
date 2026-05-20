'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signupAction } from '@/lib/actions';
import styles from '@/app/login/Auth.module.css';

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
    <div className={styles.wrapper}>
      {/* Dynamic Glowing Accent Background */}
      <div className="glow-bg" style={{ width: '400px', height: '400px', top: '10%', left: '20%', background: 'var(--primary)' }}></div>
      <div className="glow-bg" style={{ width: '350px', height: '350px', bottom: '10%', right: '20%', background: 'var(--secondary)' }}></div>

      <div className={`${styles.authCard} glass animate-fade-in`}>
        <div className={styles.header}>
          <span className={styles.logoIcon}>🌍</span>
          <h2 className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem' }}>
            Create Account
          </h2>
          <p className={styles.subtext}>Join World News Center today</p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              className="form-input"
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>

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

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password (6+ characters)</label>
            <input
              className="form-input"
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
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.875rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className={styles.footerLink}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
