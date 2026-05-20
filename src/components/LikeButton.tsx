'use client';

import { useState } from 'react';
import { toggleLikeAction } from '@/lib/actions';
import styles from '@/app/news/[slug]/page.module.css';

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

    // Optimistic UI updates
    setLiked(!liked);
    setCount(prev => (liked ? prev - 1 : prev + 1));
    setLoading(true);

    try {
      const result = await toggleLikeAction(articleId);
      if (result.success) {
        setLiked(!!result.liked);
        setCount(result.count ?? 0);
      } else {
        // Revert on failure
        setLiked(liked);
        setCount(count);
        setErrorMsg(result.error || 'Failed to complete action.');
        setTimeout(() => setErrorMsg(null), 4000);
      }
    } catch {
      // Revert on error
      setLiked(liked);
      setCount(count);
      setErrorMsg('A network error occurred.');
      setTimeout(() => setErrorMsg(null), 4000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.likeSection}>
      <button
        onClick={handleLike}
        className={`${styles.likeBtn} ${liked ? styles.likeBtnLiked : styles.likeBtnUnliked}`}
        aria-label={liked ? 'Unlike this article' : 'Like this article'}
        disabled={loading && articleId.startsWith('m')} // Disable loading indicators on mock items since mock action will return auth needed
      >
        <span>{liked ? '❤️ Saved Story' : '🤍 Bookmark Story'}</span>
      </button>
      <span className={styles.likeCount}>{count} readers saved this</span>

      {errorMsg && (
        <div style={{
          background: 'var(--danger-glow)',
          border: '1px solid rgba(244, 63, 94, 0.2)',
          color: 'var(--danger)',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginTop: '0.5rem',
          width: '100%',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}
