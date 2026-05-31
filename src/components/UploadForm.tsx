'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createArticleAction } from '@/lib/actions';
import { Category } from '@prisma/client';

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {successMsg && (
        <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-3 rounded-xl text-sm mb-2 flex items-center gap-2 animate-fade-in">
          ✓ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-3 rounded-xl text-sm mb-2 flex items-center gap-2 animate-fade-in">
          ⚠ {errorMsg}
        </div>
      )}

      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="title">Article Title</label>
        <input
          className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          type="text"
          id="title"
          name="title"
          placeholder="e.g. Breaking Breakthroughs in Bio-Tech Science"
          required
          disabled={loading}
        />
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="category">Category / Genre</label>
        <select
          className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 cursor-pointer"
          id="category"
          name="category"
          required
          disabled={loading}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="summary">Short Summary (For homepage preview cards)</label>
        <input
          className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          type="text"
          id="summary"
          name="summary"
          placeholder="e.g. A brief 1-2 sentence overview of the news story..."
          required
          disabled={loading}
        />
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="content">Article Body (Supports markdown headings & lists)</label>
        <textarea
          className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 resize-y"
          id="content"
          name="content"
          rows={8}
          placeholder="Write your news article body here. Write multiple paragraphs. Use ### for subheadings."
          required
          disabled={loading}
        ></textarea>
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="imageUrl">Cover Image URL</label>
        <input
          className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          type="url"
          id="imageUrl"
          name="imageUrl"
          placeholder="e.g. https://images.unsplash.com/..."
          disabled={loading}
        />
      </div>

      <div className="flex flex-col">
        <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="videoUrl">Video URL (Optional - transforms into Video News)</label>
        <input
          className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          type="url"
          id="videoUrl"
          name="videoUrl"
          placeholder="e.g. Direct MP4 link, or video embed link..."
          disabled={loading}
        />
      </div>

      <div className="flex flex-col mb-2">
        <label className="block text-sm font-semibold text-foreground mb-1.5" htmlFor="sourceUrl">Verified Reference Link (Required where applicable)</label>
        <input
          className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-foreground text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          type="url"
          id="sourceUrl"
          name="sourceUrl"
          placeholder="e.g. https://www.nature.com/... (link to original source)"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full py-3.5 cursor-pointer"
        disabled={loading}
      >
        {loading ? 'Submitting News...' : 'Publish / Submit News'}
      </button>
    </form>
  );
}

