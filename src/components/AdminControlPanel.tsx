'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role, User, Subscriber, Article } from '@prisma/client';
import {
  adminApproveArticleAction,
  adminRejectArticleAction,
  adminToggleTrendingAction,
  adminToggleFeaturedAction,
  adminUpdateUserRoleAction,
} from '@/lib/actions';
import styles from '@/app/admin/dashboard/page.module.css';

interface AdminControlPanelProps {
  users: User[];
  subscribers: Subscriber[];
  pendingArticles: (Article & { uploader: User | null })[];
  allArticles: Article[];
}

export default function AdminControlPanel({
  users,
  subscribers,
  pendingArticles,
  allArticles,
}: AdminControlPanelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ success: boolean; msg: string } | null>(null);

  function triggerToast(success: boolean, msg: string) {
    setToast({ success, msg });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleRoleChange(userId: string, newRole: Role) {
    setLoading(`role-${userId}`);
    const result = await adminUpdateUserRoleAction(userId, newRole);
    if (result.success) {
      triggerToast(true, result.message || 'User role updated!');
      router.refresh();
    } else {
      triggerToast(false, result.error || 'Failed to update role.');
    }
    setLoading(null);
  }

  async function handleApprove(articleId: string) {
    setLoading(`approve-${articleId}`);
    const result = await adminApproveArticleAction(articleId);
    if (result.success) {
      triggerToast(true, result.message || 'Article published live!');
      router.refresh();
    } else {
      triggerToast(false, result.error || 'Failed to approve.');
    }
    setLoading(null);
  }

  async function handleReject(articleId: string) {
    setLoading(`reject-${articleId}`);
    const result = await adminRejectArticleAction(articleId);
    if (result.success) {
      triggerToast(true, result.message || 'Article rejected.');
      router.refresh();
    } else {
      triggerToast(false, result.error || 'Failed to reject.');
    }
    setLoading(null);
  }

  async function handleToggleTrending(articleId: string) {
    setLoading(`trending-${articleId}`);
    const result = await adminToggleTrendingAction(articleId);
    if (result.success) {
      triggerToast(true, result.message || 'Trending updated!');
      router.refresh();
    } else {
      triggerToast(false, result.error || 'Failed to update trending.');
    }
    setLoading(null);
  }

  async function handleToggleFeatured(articleId: string) {
    setLoading(`featured-${articleId}`);
    const result = await adminToggleFeaturedAction(articleId);
    if (result.success) {
      triggerToast(true, result.message || 'Featured updated!');
      router.refresh();
    } else {
      triggerToast(false, result.error || 'Failed to update featured.');
    }
    setLoading(null);
  }

  return (
    <div style={{ position: 'relative', width: '100%', zIndex: 10 }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 9999,
          background: toast.success ? 'var(--glass-bg)' : 'rgba(244, 63, 94, 0.95)',
          border: toast.success ? '1px solid var(--accent)' : '1px solid var(--danger)',
          color: toast.success ? 'var(--text-primary)' : 'white',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          backdropFilter: 'blur(8px)',
          fontWeight: 600,
          animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          {toast.success ? '✓' : '⚠'} {toast.msg}
        </div>
      )}

      <div className={styles.layoutGrid}>
        {/* Left Column: User Management */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>
            👥 User Management Directory
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              ({users.length} registered accounts)
            </span>
          </h2>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Email Address</th>
                  <th className={styles.th}>Active Role</th>
                  <th className={styles.th} style={{ textAlign: 'right' }}>Modify Access</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className={styles.td} style={{ fontWeight: 600 }}>{u.name}</td>
                    <td className={styles.td} style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td className={styles.td}>
                      <span className="role-tag" style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        background: u.role === 'ADMIN' ? 'var(--accent-glow)' : u.role === 'UPLOADER' ? 'var(--secondary-glow)' : 'var(--primary-glow)',
                        color: u.role === 'ADMIN' ? 'var(--accent)' : u.role === 'UPLOADER' ? 'var(--secondary)' : 'var(--primary)'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <select
                        className={styles.roleSelect}
                        value={u.role}
                        disabled={loading === `role-${u.id}`}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                      >
                        <option value="READER">Reader</option>
                        <option value="UPLOADER">Uploader</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Moderation & Subscribers */}
        <div>
          {/* Content Moderation Drawer */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              ✍ Content Moderation Queue
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--warning)' }}>
                ({pendingArticles.length} pending)
              </span>
            </h2>

            {pendingArticles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>✨</span>
                <p style={{ fontSize: '0.95rem' }}>No pending articles requiring approval.</p>
              </div>
            ) : (
              <div className={styles.moderationList}>
                {pendingArticles.map(a => (
                  <div key={a.id} className={styles.modCard}>
                    <div className={styles.modHeader}>
                      <h3 className={styles.modTitle}>{a.title}</h3>
                      <div className={styles.modMeta}>
                        <span>📁 {a.category}</span>
                        <span>✍ {a.uploader?.name || 'Contributor'}</span>
                      </div>
                    </div>
                    <p className={styles.modSummary}>{a.summary}</p>
                    <div className={styles.modActions}>
                      <button
                        onClick={() => handleApprove(a.id)}
                        disabled={loading !== null}
                        className="btn btn-primary"
                        style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                      >
                        {loading === `approve-${a.id}` ? 'Approving...' : '✓ Approve & Publish'}
                      </button>
                      <button
                        onClick={() => handleReject(a.id)}
                        disabled={loading !== null}
                        className="btn btn-secondary"
                        style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                      >
                        {loading === `reject-${a.id}` ? 'Rejecting...' : '✕ Reject'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Featured & Trending Controls */}
          {allArticles.length > 0 && (
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>📣 Feed Spotlight Controls</h2>
              <div className={styles.subscribersList} style={{ maxHeight: '280px' }}>
                {allArticles.map(article => (
                  <div key={article.id} className={styles.subCard} style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                        {article.title}
                      </span>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--accent)' }}>
                        {article.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleToggleTrending(article.id)}
                        className="btn btn-secondary"
                        disabled={loading !== null}
                        style={{
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.75rem',
                          background: article.isTrending ? 'var(--primary-glow)' : 'transparent',
                          color: article.isTrending ? 'var(--primary)' : 'var(--text-secondary)',
                          borderColor: article.isTrending ? 'var(--primary)' : 'var(--card-border)'
                        }}
                      >
                        {article.isTrending ? '🔥 Trending Active' : '⚡ Mark Trending'}
                      </button>

                      <button
                        onClick={() => handleToggleFeatured(article.id)}
                        className="btn btn-secondary"
                        disabled={loading !== null}
                        style={{
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.75rem',
                          background: article.isFeatured ? 'var(--secondary-glow)' : 'transparent',
                          color: article.isFeatured ? 'var(--secondary)' : 'var(--text-secondary)',
                          borderColor: article.isFeatured ? 'var(--secondary)' : 'var(--card-border)'
                        }}
                      >
                        {article.isFeatured ? '⭐ Spotlight Active' : '✨ Spotlight Hero'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Subscriber List */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>
              📨 Active Newsletter Grid
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                ({subscribers.length} emails)
              </span>
            </h2>

            {subscribers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>📭</span>
                <p>No active newsletter subscribers.</p>
              </div>
            ) : (
              <div className={styles.subscribersList}>
                {subscribers.map(sub => (
                  <div key={sub.id} className={styles.subCard}>
                    <span style={{ fontWeight: 600 }}>{sub.email}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.4rem',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--accent)',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
