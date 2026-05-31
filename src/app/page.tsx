import Link from 'next/link';
import db from '@/lib/db';
import { MOCK_ARTICLES, MockArticle } from '@/lib/mockData';
import { Category, ArticleStatus } from '@prisma/client';
import { Sparkles, User, Eye, Calendar, Video, Search } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{
    category?: string;
    type?: string;
    search?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeCategory = params.category as Category | undefined;
  const activeType = params.type; // 'video' or undefined

  let dbArticles: (import('@prisma/client').Article & { 
    uploader: import('@prisma/client').User | null;
    likes: import('@prisma/client').Like[];
  })[] = [];
  try {
    // Attempt database query
    dbArticles = await db.article.findMany({
      where: {
        status: ArticleStatus.APPROVED,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        uploader: true,
        likes: true,
      },
    });
  } catch {
    console.warn('Database not synced or connection failed. Using mock data fallback.');
  }

  // Parse DB articles to match common schema or use Mock Data fallback
  let allArticles: MockArticle[] = [];
  if (dbArticles.length > 0) {
    allArticles = dbArticles.map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      content: a.content,
      category: a.category,
      imageUrl: a.imageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&q=80&w=1200',
      videoUrl: a.videoUrl,
      sourceUrl: a.sourceUrl || '#',
      status: a.status,
      isTrending: a.isTrending,
      isFeatured: a.isFeatured,
      views: a.views,
      likesCount: a.likes ? a.likes.length : 0,
      uploaderName: a.uploader ? a.uploader.name : 'Staff Uploader',
      createdAt: a.createdAt.toISOString(),
    }));
  } else {
    allArticles = MOCK_ARTICLES;
  }

  // Apply filters
  let filteredArticles = [...allArticles];

  if (activeCategory) {
    filteredArticles = filteredArticles.filter(
      a => a.category === activeCategory
    );
  }

  if (activeType === 'video') {
    filteredArticles = filteredArticles.filter(
      a => a.videoUrl && a.videoUrl.trim() !== ''
    );
  }

  // Extract Feature Highlight (Spotlight Hero)
  // We prioritize featured articles, otherwise grab the latest one
  const heroArticle = filteredArticles.find(a => a.isFeatured) || filteredArticles[0];
  const feedArticles = heroArticle 
    ? filteredArticles.filter(a => a.id !== heroArticle.id)
    : filteredArticles;

  const categories = Object.values(Category);

  function getBadgeStyle(cat: Category) {
    switch (cat) {
      case Category.SPORTS: return 'bg-primary/10 text-primary';
      case Category.MUSIC: return 'bg-secondary/10 text-secondary';
      case Category.ENTERTAINMENT: return 'bg-destructive/10 text-destructive';
      case Category.TECH: return 'bg-accent/10 text-accent';
      case Category.POLITICS: return 'bg-amber-500/10 text-amber-500';
      case Category.WORLD: return 'bg-primary-glow text-primary';
      case Category.BUSINESS: return 'bg-secondary-glow text-secondary';
      default: return '';
    }
  }

  return (
    <div className="min-h-screen pb-20 relative container mx-auto px-6 animate-fade-in">
      {/* Decorative Lights */}
      <div className="absolute pointer-events-none rounded-full blur-3xl opacity-60 animate-[pulseSlow_8s_ease-in-out_infinite]" style={{ width: '500px', height: '500px', top: '-10%', left: '-10%', background: 'var(--color-primary-glow)' }}></div>
      <div className="absolute pointer-events-none rounded-full blur-3xl opacity-60 animate-[pulseSlow_8s_ease-in-out_infinite]" style={{ width: '400px', height: '400px', top: '40%', right: '-10%', background: 'var(--color-secondary-glow)' }}></div>

      {/* Featured Spotlight Section */}
      {heroArticle && !activeCategory && !activeType && (
        <section className="mt-8 mb-14">
          <h3 className="font-display font-extrabold text-xl mb-4 text-muted-foreground tracking-wide flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary shrink-0" /> Spotlight Story
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 rounded-3xl overflow-hidden bg-card border border-border shadow-lg hover:shadow-2xl hover:border-muted-foreground/30 hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="relative w-full h-[260px] sm:h-[360px] lg:h-[440px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={heroArticle.imageUrl || ''} 
                alt={heroArticle.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
              />
              {heroArticle.videoUrl && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-xs border border-white/20 w-[54px] h-[54px] rounded-full flex items-center justify-center text-white text-2xl z-10 shadow-lg transition-all duration-200 group-hover:bg-primary group-hover:scale-110">
                  ▶
                </div>
              )}
            </div>
            <div className="p-6 sm:p-8 lg:py-12 lg:pr-10 lg:pl-0 flex flex-col justify-center gap-5">
              <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase w-fit ${getBadgeStyle(heroArticle.category)}`}>
                {heroArticle.category}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold leading-tight text-foreground hover:text-primary transition-colors">
                <Link href={`/news/${heroArticle.slug}`}>{heroArticle.title}</Link>
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">{heroArticle.summary}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {heroArticle.uploaderName}</span>
                <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {heroArticle.views} views</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {new Date(heroArticle.createdAt).toLocaleDateString()}</span>
              </div>

              <Link href={`/news/${heroArticle.slug}`} className="btn btn-primary w-fit mt-2">
                Read Full Story
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Tab Section */}
      <section className="relative z-10" style={{ marginTop: activeCategory || activeType ? '2.5rem' : '0' }}>
        <div className="flex items-center justify-between flex-wrap gap-6 mb-10 border-b border-border pb-5">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full scrollbar-thin">
            <Link 
              href={activeType ? `/?type=${activeType}` : '/'} 
              className={`px-[1.15rem] py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                !activeCategory 
                  ? 'bg-gradient-to-r from-primary to-secondary text-white hover:text-white' 
                  : 'bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              All News
            </Link>
            {categories.map(cat => {
              const query = activeType 
                ? `/?category=${cat}&type=${activeType}` 
                : `/?category=${cat}`;
              const isActive = activeCategory === cat;
              return (
                <Link
                  key={cat}
                  href={query}
                  className={`px-[1.15rem] py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary to-secondary text-white hover:text-white' 
                      : 'bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </Link>
              );
            })}
          </div>

          {/* Type Toggle: All vs Videos */}
          <div className="flex bg-muted/40 border border-border p-1 rounded-full">
            <Link
              href={activeCategory ? `/?category=${activeCategory}` : '/'}
              className={`px-[1.15rem] py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeType !== 'video' 
                  ? 'bg-card text-foreground shadow-xs' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Feed
            </Link>
            <Link
              href={activeCategory ? `/?category=${activeCategory}&type=video` : '/?type=video'}
              className={`px-[1.15rem] py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeType === 'video' 
                  ? 'bg-card text-foreground shadow-xs' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Video className="h-3.5 w-3.5" /> Videos
            </Link>
          </div>
        </div>

        {/* Feed Cards Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 px-6 bg-card border border-border rounded-3xl shadow-lg max-w-[600px] mx-auto my-12 animate-fade-in flex flex-col items-center justify-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-display font-bold text-2xl mt-4 text-foreground">
              No stories found
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              We couldn&apos;t find any articles matching your selected category. Check back later or clear your filters.
            </p>
            <Link href="/" className="btn btn-primary mt-6">
              Clear Filters
            </Link>
          </div>
        ) : (
          <div>
            {/* Grid display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(activeCategory || activeType ? filteredArticles : feedArticles).map(article => (
                <article key={article.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-md flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:border-muted-foreground/30 hover:-translate-y-1 group">
                  <div className="relative w-full h-[220px] overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={article.imageUrl || ''} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <span className={`absolute top-4 left-4 z-10 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase w-fit ${getBadgeStyle(article.category)}`}>
                      {article.category}
                    </span>
                    {article.videoUrl && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-xs border border-white/20 w-[54px] h-[54px] rounded-full flex items-center justify-center text-white text-2xl z-10 shadow-lg transition-all duration-200 group-hover:bg-primary group-hover:scale-110">
                        ▶
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col gap-3.5 flex-grow">
                    <h3 className="font-display text-lg font-bold leading-snug text-foreground line-clamp-2 hover:text-primary transition-colors">
                      <Link href={`/news/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{article.summary}</p>
                    <div className="border-t border-border pt-4 mt-auto flex justify-between items-center text-muted-foreground text-xs">
                      <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {article.uploaderName}</span>
                      <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {article.views} views</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

