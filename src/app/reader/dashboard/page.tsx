import { redirect } from 'next/navigation';
import Link from 'next/link';
import db from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import styles from './page.module.css';

export default async function ReaderDashboardPage() {
  const user = await getUserFromCookie();

  if (!user) {
    redirect('/login');
  }

  let savedStories: (import('@prisma/client').Like & { article: import('@prisma/client').Article })[] = [];
  try {
    savedStories = await db.like.findMany({
      where: { userId: user.userId },
      include: {
        article: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch {
    console.warn('Prisma database not migrated yet. Showing empty saved dashboard.');
  }

  return (
    <div className={`${styles.wrapper} container animate-fade-in`}>
      {/* Lights */}
      <div className="glow-bg" style={{ width: '400px', height: '400px', top: '-10%', left: '-10%', background: 'var(--primary-glow)' }}></div>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Personal Feed Tracker</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your saved stories and watchlists</p>
      </div>

      {/* Welcome Card & Stats */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeText}>
          <h3>Welcome back, {user.name}!</h3>
          <p>Email: {user.email} | Role: {user.role.toLowerCase()}</p>
        </div>
        <div className={styles.profileStats}>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{savedStories.length}</span>
            <span className={styles.statLbl}>Saved Stories</span>
          </div>
        </div>
      </div>

      {/* Saved News List */}
      <div>
        <h2 className={styles.sectionTitle}>📚 Bookmarked Stories & Videos</h2>

        {savedStories.length === 0 ? (
          <div className={styles.emptyState}>
            <span>🔖</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              No bookmarks saved yet
            </h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Explore our global news feed, read articles or watch video summaries, and tap &quot;Bookmark Story&quot; to track them here!
            </p>
            <Link href="/" className="btn btn-primary">
              Browse News Feed
            </Link>
          </div>
        ) : (
          <div className={styles.savedGrid}>
            {savedStories.map(item => {
              const article = item.article;
              return (
                <div key={item.id} className={styles.savedCard}>
                  {/* Small Thumbnail */}
                  <div className={styles.thumbContainer}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={article.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&q=80&w=1200'} 
                      alt="" 
                      className={styles.thumb} 
                    />
                    {article.videoUrl && (
                      <div className={styles.playOverlay}>📽 VIDEO</div>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className={styles.cardDetails}>
                    <h3 className={styles.cardTitle}>
                      <Link href={`/news/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <div className={styles.cardMeta}>
                      <span>📁 {article.category}</span>
                      <Link href={`/news/${article.slug}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        Read →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
