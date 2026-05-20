'use client';

import { useState } from 'react';
import { subscribeEmail } from '@/lib/actions';
import styles from './Footer.module.css';

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
    <div style={{ width: '100%' }}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className={styles.input}
          disabled={status === 'loading'}
          aria-label="Email address for newsletter"
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap' }}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {status === 'success' && (
        <div className={styles.successMsg}>
          ✓ {message}
        </div>
      )}

      {status === 'error' && (
        <div className={styles.errorMsg}>
          ⚠ {message}
        </div>
      )}
    </div>
  );
}
