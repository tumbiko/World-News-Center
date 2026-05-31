import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import AdminControlPanel from '@/components/AdminControlPanel';
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
    <div className="py-12 min-h-screen relative container mx-auto px-6 animate-fade-in">
      {/* Lights */}
      <div className="glow-bg pointer-events-none" style={{ width: '450px', height: '450px', top: '-10%', left: '-10%', background: 'var(--primary-glow)' }}></div>
      <div className="glow-bg pointer-events-none" style={{ width: '400px', height: '400px', top: '40%', right: '-10%', background: 'var(--accent-glow)' }}></div>

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-[2.25rem] font-extrabold text-foreground mb-2">Administrator Command Center</h1>
        <p className="text-muted-foreground text-sm">Welcome, {user.name}. Manage user permissions, moderates uploads, and inspect platform performance metrics.</p>
      </div>

      {/* Metric Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mt-8 mb-14">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-primary before:to-secondary">
          <span className="font-display text-[2.25rem] font-extrabold text-foreground leading-none">{totalUsers}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total User Profiles</span>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-primary before:to-secondary">
          <span className="font-display text-[2.25rem] font-extrabold text-foreground leading-none">{totalUploaders}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active News Uploaders</span>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-primary before:to-secondary">
          <span className="font-display text-[2.25rem] font-extrabold text-foreground leading-none">{totalSubscribers}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Subscriptions</span>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-primary before:to-secondary">
          <span className="font-display text-[2.25rem] font-extrabold text-foreground leading-none">{totalArticles}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Published News</span>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-primary before:to-secondary">
          <span className="font-display text-[2.25rem] font-extrabold text-foreground leading-none">{totalViews}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Interactive Views</span>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-2 relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-primary before:to-secondary">
          <span className="font-display text-[2.25rem] font-extrabold text-foreground leading-none">{totalLikes}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bookmarks / Saves</span>
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

