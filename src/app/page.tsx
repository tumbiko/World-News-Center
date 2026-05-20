import Link from 'next/link';
import db from '@/lib/db';
import { MOCK_ARTICLES, MockArticle } from '@/lib/mockData';
import { Category, ArticleStatus } from '@prisma/client';
import styles from './page.module.css';

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
      case Category.SPORTS: return styles.badgeSports;
      case Category.MUSIC: return styles.badgeMusic;
      case Category.ENTERTAINMENT: return styles.badgeEntertainment;
      case Category.TECH: return styles.badgeTech;
      case Category.POLITICS: return styles.badgePolitics;
      case Category.WORLD: return styles.badgeWorld;
      case Category.BUSINESS: return styles.badgeBusiness;
      default: return '';
    }
  }

  return (
    <div className={`${styles.main} container animate-fade-in`}>
      {/* Decorative Lights */}
      <div className="glow-bg" style={{ width: '500px', height: '500px', top: '-10%', left: '-10%', background: 'var(--primary-glow)' }}></div>
      <div className="glow-bg" style={{ width: '400px', height: '400px', top: '40%', right: '-10%', background: 'var(--secondary-glow)' }}></div>

      {/* Featured Spotlight Section */}
      {heroArticle && !activeCategory && !activeType && (
        <section className={styles.heroSection}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            ⚡ Spotlight Story
          </h3>
          <div className={styles.heroCard}>
            <div className={styles.heroImageContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroArticle.imageUrl || ''} alt={heroArticle.title} className={styles.heroImage} />
              {heroArticle.videoUrl && (
                <div className={styles.cardPlayIcon}>▶</div>
              )}
            </div>
            <div className={styles.heroContent}>
              <span className={`${styles.categoryBadge} ${getBadgeStyle(heroArticle.category)}`}>
                {heroArticle.category}
              </span>
              <h2 className={styles.heroTitle}>
                <Link href={`/news/${heroArticle.slug}`}>{heroArticle.title}</Link>
              </h2>
              <p className={styles.heroSummary}>{heroArticle.summary}</p>
              
              <div className={styles.meta}>
                <span className={styles.metaItem}>✍ {heroArticle.uploaderName}</span>
                <span className={styles.metaItem}>👁 {heroArticle.views} views</span>
                <span className={styles.metaItem}>📅 {new Date(heroArticle.createdAt).toLocaleDateString()}</span>
              </div>

              <Link href={`/news/${heroArticle.slug}`} className="btn btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem' }}>
                Read Full Story
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Tab Section */}
      <section style={{ position: 'relative', zIndex: 10, marginTop: activeCategory || activeType ? '2.5rem' : '0' }}>
        <div className={styles.filterBar}>
          {/* Category Pills */}
          <div className={styles.tabs}>
            <Link 
              href={activeType ? `/?type=${activeType}` : '/'} 
              className={`${styles.tab} ${!activeCategory ? styles.tabActive : ''}`}
            >
              All News
            </Link>
            {categories.map(cat => {
              const query = activeType 
                ? `/?category=${cat}&type=${activeType}` 
                : `/?category=${cat}`;
              return (
                <Link
                  key={cat}
                  href={query}
                  className={`${styles.tab} ${activeCategory === cat ? styles.tabActive : ''}`}
                >
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </Link>
              );
            })}
          </div>

          {/* Type Toggle: All vs Videos */}
          <div className={styles.typeToggle}>
            <Link
              href={activeCategory ? `/?category=${activeCategory}` : '/'}
              className={`${styles.toggleBtn} ${activeType !== 'video' ? styles.toggleBtnActive : ''}`}
            >
              All Feed
            </Link>
            <Link
              href={activeCategory ? `/?category=${activeCategory}&type=video` : '/?type=video'}
              className={`${styles.toggleBtn} ${activeType === 'video' ? styles.toggleBtnActive : ''}`}
            >
              📽 Videos
            </Link>
          </div>
        </div>

        {/* Feed Cards Grid */}
        {filteredArticles.length === 0 ? (
          <div className={styles.emptyState}>
            <span style={{ fontSize: '3rem' }}>🔍</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', marginTop: '1rem', color: 'var(--text-primary)' }}>
              No stories found
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              We couldn&apos;t find any articles matching your selected category. Check back later or clear your filters.
            </p>
            <Link href="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Clear Filters
            </Link>
          </div>
        ) : (
          <div>
            {/* If we filtered, or if we have a hero, list all matching items in grid */}
            <div className={styles.feedGrid}>
              {/* If there was a hero spotlight, we display it first in the grid for categories, or list remaining */}
              {(activeCategory || activeType ? filteredArticles : feedArticles).map(article => (
                <article key={article.id} className={styles.card}>
                  <div className={styles.cardImageContainer}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={article.imageUrl || ''} alt={article.title} className={styles.cardImage} />
                    <span className={`${styles.categoryBadge} ${styles.cardFloatingBadge} ${getBadgeStyle(article.category)}`}>
                      {article.category}
                    </span>
                    {article.videoUrl && (
                      <div className={styles.cardPlayIcon}>▶</div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                      <Link href={`/news/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <p className={styles.cardSummary}>{article.summary}</p>
                    <div className={styles.cardFooter}>
                      <span>✍ {article.uploaderName}</span>
                      <span>👁 {article.views} views</span>
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
