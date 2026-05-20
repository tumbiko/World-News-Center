import { redirect } from 'next/navigation';
import Link from 'next/link';
import db from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import UploadForm from '@/components/UploadForm';
import styles from './page.module.css';

export default async function UploaderDashboardPage() {
  const user = await getUserFromCookie();

  // Route protection - UPLOADER or ADMIN roles only
  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'UPLOADER' && user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  let uploads: import('@prisma/client').Article[] = [];
  try {
    uploads = await db.article.findMany({
      where: { uploaderId: user.userId },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    console.warn('Prisma database not migrated yet. Showing empty uploader history.');
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case 'APPROVED': return styles.statusApproved;
      case 'REJECTED': return styles.statusRejected;
      default: return styles.statusPending;
    }
  }

  return (
    <div className={`${styles.wrapper} container animate-fade-in`}>
      {/* Glow Lights */}
      <div className="glow-bg" style={{ width: '400px', height: '400px', top: '-10%', right: '-10%', background: 'var(--secondary-glow)' }}></div>

      {/* Header */}
      <div>
        <h1 className={styles.title}>Uploader Control Panel</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user.name}. Contribute breaking stories and video news feeds.</p>
      </div>

      {/* Split Grid */}
      <div className={styles.grid}>
        {/* Left: Upload Form */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>✍ Publish / Submit New Story</h2>
          <UploadForm />
        </div>

        {/* Right: History */}
        <div className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>📅 Your Contribution History</h2>

          {uploads.length === 0 ? (
            <div className={styles.emptyState}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📭</span>
              <p>You haven&apos;t submitted any stories yet.</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Fill in the form on the left to publish your first story.
              </p>
            </div>
          ) : (
            <div className={styles.historyList}>
              {uploads.map(article => (
                <div key={article.id} className={styles.historyCard}>
                  <div className={styles.historyHeader}>
                    <h3 className={styles.articleTitle}>{article.title}</h3>
                    <span className={`${styles.statusBadge} ${getStatusStyle(article.status)}`}>
                      {article.status}
                    </span>
                  </div>

                  <div className={styles.historyMeta}>
                    <span>📁 {article.category}</span>
                    <span>👁 {article.views} views</span>
                    {article.status === 'APPROVED' ? (
                      <Link href={`/news/${article.slug}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        View Live →
                      </Link>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Draft</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
