'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createArticleAction } from '@/lib/actions';
import { Category } from '@prisma/client';
import styles from '@/app/uploader/dashboard/page.module.css';

export default function UploadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const formData = new FormData(event.currentTarget);
    const result = await createArticleAction(formData);

    if (result.success) {
      setSuccessMsg(result.message || 'Article successfully submitted!');
      event.currentTarget.reset();
      router.refresh(); // Refresh dashboard history list dynamically
      setTimeout(() => setSuccessMsg(null), 5000);
    } else {
      setErrorMsg(result.error || 'Failed to submit article.');
    }
    setLoading(false);
  }

  const categories = Object.values(Category);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {successMsg && (
        <div className={styles.alertSuccess}>
          ✓ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className={styles.alertError}>
          ⚠ {errorMsg}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="title">Article Title</label>
        <input
          className="form-input"
          type="text"
          id="title"
          name="title"
          placeholder="e.g. Breaking Breakthroughs in Bio-Tech Science"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="category">Category / Genre</label>
        <select
          className="form-input"
          id="category"
          name="category"
          required
          disabled={loading}
          style={{ appearance: 'auto' }}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="summary">Short Summary (For homepage preview cards)</label>
        <input
          className="form-input"
          type="text"
          id="summary"
          name="summary"
          placeholder="e.g. A brief 1-2 sentence overview of the news story..."
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="content">Article Body (Supports markdown headings & lists)</label>
        <textarea
          className={styles.textarea}
          id="content"
          name="content"
          rows={8}
          placeholder="Write your news article body here. Write multiple paragraphs. Use ### for subheadings."
          required
          disabled={loading}
        ></textarea>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="imageUrl">Cover Image URL</label>
        <input
          className="form-input"
          type="url"
          id="imageUrl"
          name="imageUrl"
          placeholder="e.g. https://images.unsplash.com/..."
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="videoUrl">Video URL (Optional - transforms into Video News)</label>
        <input
          className="form-input"
          type="url"
          id="videoUrl"
          name="videoUrl"
          placeholder="e.g. Direct MP4 link, or video embed link..."
          disabled={loading}
        />
      </div>

      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" htmlFor="sourceUrl">Verified Reference Link (Required where applicable)</label>
        <input
          className="form-input"
          type="url"
          id="sourceUrl"
          name="sourceUrl"
          placeholder="e.g. https://www.nature.com/... (link to original source)"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', padding: '0.875rem' }}
        disabled={loading}
      >
        {loading ? 'Submitting News...' : 'Publish / Submit News'}
      </button>
    </form>
  );
}
