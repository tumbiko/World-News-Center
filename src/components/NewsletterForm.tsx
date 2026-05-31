'use client';

import { useState } from 'react';
import { subscribeEmail } from '@/lib/actions';

export default function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const result = await subscribeEmail(formData);

    if (result.success) {
      setStatus('success');
      setMessage(result.message);
      event.currentTarget.reset();
    } else {
      setStatus('error');
      setMessage(result.message);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          disabled={status === 'loading'}
          aria-label="Email address for newsletter"
        />
        <button
          type="submit"
          className="whitespace-nowrap px-5 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-primary to-secondary hover:-translate-y-0.5 shadow-md hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {status === 'success' && (
        <div className="mt-3 px-4 py-3 bg-accent/10 text-accent rounded-xl text-sm font-medium animate-[fadeIn_0.3s_ease-out]">
          ✓ {message}
        </div>
      )}

      {status === 'error' && (
        <div className="mt-3 px-4 py-3 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
          ⚠ {message}
        </div>
      )}
    </div>
  );
}
