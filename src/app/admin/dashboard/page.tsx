import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import AdminControlPanel from '@/components/AdminControlPanel';
import styles from './page.module.css';
import { User, Subscriber, Article } from '@prisma/client';

export default async function AdminDashboardPage() {
  const user = await getUserFromCookie();

  // Route protection - ADMIN role only
  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  // 1. Initialize metrics and directories
  let totalUsers = 0;

  let totalUploaders = 0;
  let totalSubscribers = 0;
  let totalArticles = 0;
  let totalViews = 0;
  let totalLikes = 0;

  let users: User[] = [];
  let subscribers: Subscriber[] = [];
  let pendingArticles: (Article & { uploader: User | null })[] = [];
  let allArticles: Article[] = [];

  try {
    // 2. Perform database aggregations
    totalUsers = await db.user.count();
    totalUsers = await db.user.count();
    totalUploaders = await db.user.count({ where: { role: 'UPLOADER' } });
    totalSubscribers = await db.subscriber.count({ where: { active: true } });
    totalArticles = await db.article.count();
    totalLikes = await db.like.count();

    const viewAggregation = await db.article.aggregate({
      _sum: {
        views: true,
      },
    });
    totalViews = viewAggregation._sum.views || 0;

    // 3. Query directories for panel administration
    users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    subscribers = await db.subscriber.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });

    pendingArticles = await db.article.findMany({
      where: { status: 'PENDING' },
      include: { uploader: true },
      orderBy: { createdAt: 'desc' },
    });

    allArticles = await db.article.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    console.warn('Database schemas not migrated or query failed. Displaying fallback admin metric structures.');
  }

  return (
    <div className={`${styles.wrapper} container animate-fade-in`}>
      {/* Lights */}
      <div className="glow-bg" style={{ width: '450px', height: '450px', top: '-10%', left: '-10%', background: 'var(--primary-glow)' }}></div>
      <div className="glow-bg" style={{ width: '400px', height: '400px', top: '40%', right: '-10%', background: 'var(--accent-glow)' }}></div>

      {/* Header */}
      <div>
        <h1 className={styles.title}>Administrator Command Center</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome, {user.name}. Manage user permissions, moderates uploads, and inspect platform performance metrics.</p>
      </div>

      {/* Metric Cards Grid */}
      <section className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricVal}>{totalUsers}</span>
          <span className={styles.metricLbl}>Total User Profiles</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricVal}>{totalUploaders}</span>
          <span className={styles.metricLbl}>Active News Uploaders</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricVal}>{totalSubscribers}</span>
          <span className={styles.metricLbl}>Active Subscriptions</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricVal}>{totalArticles}</span>
          <span className={styles.metricLbl}>Published News</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricVal}>{totalViews}</span>
          <span className={styles.metricLbl}>Interactive Views</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricVal}>{totalLikes}</span>
          <span className={styles.metricLbl}>Bookmarks / Saves</span>
        </div>
      </section>

      {/* Dynamic Interactive Administrative Control Panel */}
      <AdminControlPanel
        users={users}
        subscribers={subscribers}
        pendingArticles={pendingArticles}
        allArticles={allArticles}
      />
    </div>
  );
}
