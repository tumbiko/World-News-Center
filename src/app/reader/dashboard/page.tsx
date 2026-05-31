import { redirect } from 'next/navigation';
import Link from 'next/link';
import db from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import { Bookmark, Video, Folder } from 'lucide-react';

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
    <div className="py-12 min-h-screen relative container mx-auto px-6 animate-fade-in">
      {/* Lights */}
      <div className="glow-bg pointer-events-none" style={{ width: '400px', height: '400px', top: '-10%', left: '-10%', background: 'var(--primary-glow)' }}></div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl sm:text-[2.25rem] font-extrabold text-foreground mb-2">Personal Feed Tracker</h1>
        <p className="text-muted-foreground text-sm">Manage your saved stories and watchlists</p>
      </div>

      {/* Welcome Card & Stats */}
      <div className="bg-card border border-border rounded-3xl p-8 shadow-md flex justify-between items-center flex-wrap gap-8 mb-12 relative overflow-hidden">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground mb-1">Welcome back, {user.name}!</h3>
          <p className="text-muted-foreground text-sm">Email: {user.email} | Role: {user.role.toLowerCase()}</p>
        </div>
        <div className="flex gap-6">
          <div className="bg-muted/40 px-6 py-3 rounded-xl border border-border text-center">
            <span className="block text-2xl font-extrabold text-primary font-display">{savedStories.length}</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Saved Stories</span>
          </div>
        </div>
      </div>

      {/* Saved News List */}
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-extrabold mb-6 text-foreground border-b border-border pb-2.5 flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary shrink-0" /> Bookmarked Stories & Videos
        </h2>

        {savedStories.length === 0 ? (
          <div className="text-center py-16 px-8 bg-card border-2 border-dashed border-border rounded-3xl text-muted-foreground animate-fade-in flex flex-col items-center justify-center">
            <Bookmark className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-display font-bold text-lg mb-2 text-foreground">
              No bookmarks saved yet
            </h3>
            <p className="text-sm max-w-md mx-auto mb-6">
              Explore our global news feed, read articles or watch video summaries, and tap &quot;Bookmark Story&quot; to track them here!
            </p>
            <Link href="/" className="btn btn-primary">
              Browse News Feed
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedStories.map(item => {
              const article = item.article;
              return (
                <div key={item.id} className="bg-card border border-border rounded-2xl p-5 flex gap-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-muted-foreground/30 hover:-translate-y-0.5 group">
                  {/* Small Thumbnail */}
                  <div className="relative w-[90px] h-[90px] rounded-xl overflow-hidden shrink-0 bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={article.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&q=80&w=1200'} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    {article.videoUrl && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold tracking-wider gap-1">
                        <Video className="h-3 w-3 shrink-0" /> VIDEO
                      </div>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex flex-col justify-between flex-grow">
                    <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-snug hover:text-primary transition-colors mb-2">
                      <Link href={`/news/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
                      <span className="flex items-center gap-1"><Folder className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {article.category}</span>
                      <Link href={`/news/${article.slug}`} className="text-primary font-semibold hover:underline">
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

