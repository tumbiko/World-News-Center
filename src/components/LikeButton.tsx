'use client';

import { useState } from 'react';
import { toggleLikeAction } from '@/lib/actions';
import { Bookmark } from 'lucide-react';

interface LikeButtonProps {
  articleId: string;
  initialLiked: boolean;
  initialCount: number;
  isLoggedIn: boolean;
}

export default function LikeButton({
  articleId,
  initialLiked,
  initialCount,
  isLoggedIn,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLike() {
    if (!isLoggedIn) {
      setErrorMsg('Please sign in to bookmark and save news!');
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    if (loading) return;

    setLiked(!liked);
    setCount(prev => (liked ? prev - 1 : prev + 1));
    setLoading(true);

    try {
      const result = await toggleLikeAction(articleId);
      if (result.success) {
        setLiked(!!result.liked);
        setCount(result.count ?? 0);
      } else {
        setLiked(liked);
        setCount(count);
        setErrorMsg(result.error || 'Failed to complete action.');
        setTimeout(() => setErrorMsg(null), 4000);
      }
    } catch {
      setLiked(liked);
      setCount(count);
      setErrorMsg('A network error occurred.');
      setTimeout(() => setErrorMsg(null), 4000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 items-center text-center">
      <button
        onClick={handleLike}
        className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-bold border transition-all duration-150 cursor-pointer ${
          liked
            ? 'bg-destructive/10 border-destructive text-destructive'
            : 'bg-muted border-border text-muted-foreground hover:bg-destructive/10 hover:border-destructive hover:text-destructive hover:scale-[1.02]'
        }`}
        aria-label={liked ? 'Unlike this article' : 'Like this article'}
        disabled={loading && articleId.startsWith('m')}
      >
        <Bookmark className={`h-4 w-4 shrink-0 ${liked ? 'fill-current' : ''}`} />
        <span>{liked ? 'Saved Story' : 'Bookmark Story'}</span>
      </button>
      <span className="text-sm text-muted-foreground">{count} readers saved this</span>

      {errorMsg && (
        <div className="w-full px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold animate-[fadeIn_0.2s_ease-out]">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
