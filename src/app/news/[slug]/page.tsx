import { notFound } from 'next/navigation';
import Link from 'next/link';
import db from '@/lib/db';
import { MOCK_ARTICLES } from '@/lib/mockData';
import { getUserFromCookie } from '@/lib/auth';
import LikeButton from '@/components/LikeButton';
import { User, Eye, Calendar, Search, Video } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const user = await getUserFromCookie();

  let article: (import('@prisma/client').Article & { uploader: import('@prisma/client').User | null, likes: import('@prisma/client').Like[] }) | any = null;
  let initialLiked = false;
  let likesCount = 0;
  let uploaderName = 'Staff Writer';
  let isMock = false;

  try {
    // 1. Fetch from Database
    const dbArticle = await db.article.findUnique({
      where: { slug },
      include: {
        uploader: true,
        likes: true,
      },
    });

    if (dbArticle) {
      article = dbArticle;
      likesCount = dbArticle.likes.length;
      initialLiked = user ? dbArticle.likes.some(l => l.userId === user.userId) : false;
      uploaderName = dbArticle.uploader?.name || 'Staff Writer';

      // 2. Increment view count in database in background
      await db.article.update({
        where: { id: dbArticle.id },
        data: { views: { increment: 1 } },
      }).catch(() => console.error('Failed to increment views'));
    }
  } catch {
    console.warn('Database error or missing schema. Using mock fallback.');
  }

  // 3. Fallback to Mock Data if database lookup returned nothing
  if (!article) {
    const mock = MOCK_ARTICLES.find(a => a.slug === slug);
    if (!mock) {
      notFound();
    }
    article = {
      ...mock,
      views: mock.views + 1, // Mock dynamic view increment
    };
    likesCount = mock.likesCount;
    uploaderName = mock.uploaderName;
    isMock = true;
  }

  // Format body content by splitting double newlines into paragraphs
  // This allows clean mock markdown formatting
  const paragraphs = article.content.split('\n\n');

  return (
    <div className="py-12 min-h-screen relative container mx-auto px-6 animate-fade-in">
      {/* Decorative blurs */}
      <div className="glow-bg pointer-events-none" style={{ width: '450px', height: '450px', top: '-10%', left: '10%', background: 'var(--primary-glow)' }}></div>

      {/* Grid Layout: Main Article Content vs Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-12">
        {/* Main Content */}
        <article className="relative z-10">
          {/* Header metadata */}
          <div className="flex flex-col gap-4 mb-8">
            <Link href="/" className="text-primary font-semibold text-sm hover:underline flex items-center gap-1.5">
              ← Back to Main Feed
            </Link>

            {/* Category + Video Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                {article.category}
              </span>
              {article.videoUrl && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-destructive/10 text-destructive border border-destructive/20">
                  <Video className="h-3.5 w-3.5 shrink-0" /> Video Report
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-[2.75rem] font-extrabold leading-tight text-foreground">{article.title}</h1>

            {/* Article Summary / Subtitle */}
            {article.summary && (
              <p className="text-lg sm:text-xl font-medium text-muted-foreground leading-relaxed border-l-4 border-primary pl-5 italic">{article.summary}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm border-t border-border pt-4">
              <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {uploaderName}</span>
              <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {article.views} views</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Media Player: If it is a video news, render custom HTML5 player. Otherwise render featured image. */}
          {article.videoUrl ? (
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl mb-8 bg-black border border-border">
              <video 
                className="w-full block max-h-[520px]" 
                controls 
                poster={article.imageUrl || undefined}
                preload="metadata"
                playsInline
              >
                <source src={article.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            article.imageUrl && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.imageUrl} alt={article.title} className="w-full max-h-[480px] object-cover rounded-2xl shadow-2xl border border-border mb-10" />
              </>
            )
          )}

          {/* Article Text Content */}
          <div className="text-foreground text-[1.1rem] leading-relaxed flex flex-col gap-6">
            {paragraphs.map((p: string, idx: number) => {
              // Parse headers if paragraph starts with ### or ##
              if (p.startsWith('### ')) {
                return <h3 key={idx} className="font-display text-2xl font-bold mt-8 mb-4 text-foreground">{p.replace('### ', '')}</h3>;
              }
              if (p.startsWith('## ')) {
                return <h3 key={idx} className="font-display text-2xl font-bold mt-8 mb-4 text-foreground">{p.replace('## ', '')}</h3>;
              }
              if (p.startsWith('- ')) {
                const listItems = p.split('\n');
                return (
                  <ul key={idx} className="list-disc pl-6 flex flex-col gap-2">
                    {listItems.map((li, lIdx) => (
                      <li key={lIdx}>{li.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx} className="leading-relaxed">{p}</p>;
            })}
          </div>
        </article>

        {/* Sidebar Panel */}
        <aside className="flex flex-col gap-8 lg:sticky lg:top-24 h-fit">
          {/* Uploader Card */}
          <div className="bg-card border border-border rounded-2xl p-7 shadow-xs">
            <h4 className="font-display text-base font-bold pb-2 mb-5 text-foreground border-b border-border">Verified Author</h4>
            <div className="flex flex-col gap-3">
              <User className="h-8 w-8 text-primary" />
              <span className="font-extrabold text-lg">{uploaderName}</span>
              <span className="text-xs uppercase font-bold text-primary">Contributor / Uploader</span>
            </div>
          </div>

          {/* Interactive Likes Widget */}
          <div className="bg-card border border-border rounded-2xl p-7 shadow-xs">
            <h4 className="font-display text-base font-bold pb-2 mb-5 text-foreground border-b border-border">Save & Track Story</h4>
            <LikeButton 
              articleId={isMock ? `mock-${article.id}` : article.id}
              initialLiked={initialLiked}
              initialCount={likesCount}
              isLoggedIn={!!user}
            />
          </div>

          {/* Source Link Widget */}
          {article.sourceUrl && article.sourceUrl !== '#' && (
            <div className="bg-card border border-border rounded-2xl p-7 shadow-xs">
              <h4 className="font-display text-base font-bold pb-2 mb-5 text-foreground border-b border-border">Fact-Checked Source</h4>
              <a 
                href={article.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-between font-semibold text-sm text-accent bg-accent/10 p-3.5 rounded-xl border border-accent/20 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
              >
                <span className="flex items-center gap-1.5"><Search className="h-4 w-4" /> Verify Original Source</span>
                <span>↗</span>
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

