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
import { Users, PenSquare, Sparkles, Folder, User as UserIcon, Megaphone, TrendingUp, Star, Mail, Inbox } from 'lucide-react';

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
    <div className="relative w-full z-10">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md font-semibold text-sm border flex items-center gap-2 animate-fade-in ${
          toast.success 
            ? 'bg-card/90 border-accent text-foreground' 
            : 'bg-destructive border-destructive text-white'
        }`}>
          {toast.success ? '✓' : '⚠'} {toast.msg}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-12">
        {/* Left Column: User Management */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md mb-10">
          <h2 className="font-display text-xl font-bold mb-6 text-foreground border-b border-border pb-2.5 flex justify-between items-center flex-wrap gap-2">
            <span className="flex items-center gap-2"><Users className="h-5 w-5 text-primary shrink-0" /> User Management Directory</span>
            <span className="text-sm font-medium text-muted-foreground">
              ({users.length} registered accounts)
            </span>
          </h2>

          <div className="w-full overflow-x-auto scrollbar-thin">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="px-4 py-3 border-b-2 border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 border-b-2 border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</th>
                  <th className="px-4 py-3 border-b-2 border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Role</th>
                  <th className="px-4 py-3 border-b-2 border-border text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Modify Access</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3.5 border-b border-border text-sm text-foreground font-semibold max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{u.name}</td>
                    <td className="px-4 py-3.5 border-b border-border text-sm text-muted-foreground max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{u.email}</td>
                    <td className="px-4 py-3.5 border-b border-border text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        u.role === 'ADMIN' ? 'bg-accent-glow text-accent' : 
                        u.role === 'UPLOADER' ? 'bg-secondary-glow text-secondary' : 
                        'bg-primary-glow text-primary'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-border text-sm text-right">
                      <select
                        className="px-2 py-1.5 rounded-lg bg-muted border border-border text-xs font-semibold cursor-pointer focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
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
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md mb-10">
            <h2 className="font-display text-xl font-bold mb-6 text-foreground border-b border-border pb-2.5 flex justify-between items-center flex-wrap gap-2">
              <span className="flex items-center gap-2"><PenSquare className="h-5 w-5 text-primary shrink-0" /> Content Moderation Queue</span>
              <span className="text-sm font-medium text-warning">
                ({pendingArticles.length} pending)
              </span>
            </h2>

            {pendingArticles.length === 0 ? (
              <div className="text-center py-10 px-4 text-muted-foreground flex flex-col items-center justify-center">
                <Sparkles className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm">No pending articles requiring approval.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {pendingArticles.map(a => (
                  <div key={a.id} className="bg-muted/40 border border-border rounded-2xl p-6">
                    <div className="mb-3">
                      <h3 className="text-base font-bold text-foreground leading-snug mb-1">{a.title}</h3>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Folder className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {a.category}</span>
                        <span className="flex items-center gap-1"><UserIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {a.uploader?.name || 'Contributor'}</span>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground mb-4 line-clamp-3">{a.summary}</p>
                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => handleApprove(a.id)}
                        disabled={loading !== null}
                        className="btn btn-primary px-4 py-2 text-xs font-semibold cursor-pointer"
                      >
                        {loading === `approve-${a.id}` ? 'Approving...' : '✓ Approve & Publish'}
                      </button>
                      <button
                        onClick={() => handleReject(a.id)}
                        disabled={loading !== null}
                        className="btn btn-secondary px-4 py-2 text-xs font-semibold cursor-pointer text-destructive border-destructive/30 hover:border-destructive hover:bg-destructive/5"
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
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md mb-10">
              <h2 className="font-display text-xl font-bold mb-6 text-foreground border-b border-border pb-2.5 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary shrink-0" /> Feed Spotlight Controls
              </h2>
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {allArticles.map(article => (
                  <div key={article.id} className="bg-muted/40 border border-border rounded-xl p-4 flex flex-col gap-3 items-start">
                    <div className="flex justify-between w-full gap-4">
                      <span className="font-bold text-sm text-foreground truncate max-w-[240px]">
                        {article.title}
                      </span>
                      <span className="text-[10px] uppercase font-extrabold text-accent self-center shrink-0">
                        {article.category}
                      </span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleToggleTrending(article.id)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          article.isTrending 
                            ? 'bg-primary-glow border-primary text-primary' 
                            : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                        disabled={loading !== null}
                      >
                        <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                        <span>{article.isTrending ? 'Trending Active' : 'Mark Trending'}</span>
                      </button>

                      <button
                        onClick={() => handleToggleFeatured(article.id)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                          article.isFeatured 
                            ? 'bg-secondary-glow border-secondary text-secondary' 
                            : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                        disabled={loading !== null}
                      >
                        <Star className="h-3.5 w-3.5 shrink-0" />
                        <span>{article.isFeatured ? 'Spotlight Active' : 'Spotlight Hero'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Newsletter Subscriber List */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md">
            <h2 className="font-display text-xl font-bold mb-6 text-foreground border-b border-border pb-2.5 flex justify-between items-center flex-wrap gap-2">
              <span className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary shrink-0" /> Active Newsletter Grid</span>
              <span className="text-sm font-medium text-muted-foreground">
                ({subscribers.length} emails)
              </span>
            </h2>

            {subscribers.length === 0 ? (
              <div className="text-center py-10 px-4 text-muted-foreground flex flex-col items-center justify-center">
                <Inbox className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm">No active newsletter subscribers.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {subscribers.map(sub => (
                  <div key={sub.id} className="bg-muted/40 border border-border rounded-xl p-4 flex justify-between items-center text-sm">
                    <span className="font-semibold text-foreground truncate max-w-[200px]">{sub.email}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full shrink-0">
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

