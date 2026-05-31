import { redirect } from 'next/navigation';
import Link from 'next/link';
import db from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import UploadForm from '@/components/UploadForm';
import { PenSquare, Calendar, Inbox, Folder, Eye } from 'lucide-react';

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
      case 'APPROVED': 
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'REJECTED': 
        return 'bg-destructive/10 text-destructive border border-destructive/20';
      default: 
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
    }
  }

  return (
    <div className="py-12 min-h-screen relative container mx-auto px-6 animate-fade-in">
      {/* Glow Lights */}
      <div className="glow-bg pointer-events-none" style={{ width: '400px', height: '400px', top: '-10%', right: '-10%', background: 'var(--secondary-glow)' }}></div>

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-[2.25rem] font-extrabold text-foreground mb-2">Uploader Control Panel</h1>
        <p className="text-muted-foreground text-sm">Welcome back, {user.name}. Contribute breaking stories and video news feeds.</p>
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 mt-8">
        {/* Left: Upload Form */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md h-fit">
          <h2 className="font-display text-xl font-bold mb-6 text-foreground border-b border-border pb-2.5 flex items-center gap-2">
            <PenSquare className="h-5 w-5 text-primary shrink-0" /> Publish / Submit New Story
          </h2>
          <UploadForm />
        </div>

        {/* Right: History */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md h-fit">
          <h2 className="font-display text-xl font-bold mb-6 text-foreground border-b border-border pb-2.5 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary shrink-0" /> Your Contribution History
          </h2>

          {uploads.length === 0 ? (
            <div className="text-center py-12 px-6 text-muted-foreground flex flex-col items-center justify-center">
              <Inbox className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm">You haven&apos;t submitted any stories yet.</p>
              <p className="text-xs text-muted-foreground mt-2">
                Fill in the form on the left to publish your first story.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {uploads.map(article => (
                <div key={article.id} className="bg-muted/40 border border-border rounded-xl p-5 flex flex-col gap-3 transition-colors hover:border-muted-foreground/30">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-bold text-foreground leading-snug">{article.title}</h3>
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full tracking-wider whitespace-nowrap shrink-0 border ${getStatusStyle(article.status)}`}>
                      {article.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
                    <span className="flex items-center gap-1"><Folder className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {article.category}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {article.views} views</span>
                    {article.status === 'APPROVED' ? (
                      <Link href={`/news/${article.slug}`} className="text-primary font-semibold hover:underline">
                        View Live →
                      </Link>
                    ) : (
                      <span className="text-muted-foreground font-medium">Draft</span>
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

