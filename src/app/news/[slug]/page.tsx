import { notFound } from 'next/navigation';
import Link from 'next/link';
import db from '@/lib/db';
import { MOCK_ARTICLES } from '@/lib/mockData';
import { getUserFromCookie } from '@/lib/auth';
import LikeButton from '@/components/LikeButton';
import styles from './page.module.css';

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
    <div className={`${styles.wrapper} container animate-fade-in`}>
      {/* Decorative blurs */}
      <div className="glow-bg" style={{ width: '450px', height: '450px', top: '-10%', left: '10%', background: 'var(--primary-glow)' }}></div>

      {/* Grid Layout: Main Article Content vs Sidebar */}
      <div className={styles.container}>
        {/* Main Content */}
        <article style={{ position: 'relative', zIndex: 10 }}>
          {/* Header metadata */}
          <div className={styles.articleHeader}>
            <Link href="/" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>
              ← Back to Main Feed
            </Link>

            {/* Category + Video Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span className={styles.categoryBadge}>
                {article.category}
              </span>
              {article.videoUrl && (
                <span className={styles.videoBadge}>
                  📹 Video Report
                </span>
              )}
            </div>

            <h1 className={styles.title}>{article.title}</h1>

            {/* Article Summary / Subtitle */}
            {article.summary && (
              <p className={styles.summary}>{article.summary}</p>
            )}
            
            <div className={styles.meta}>
              <span>✍ {uploaderName}</span>
              <span>👁 {article.views} views</span>
              <span>📅 {new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Media Player: If it is a video news, render custom HTML5 player. Otherwise render featured image. */}
          {article.videoUrl ? (
            <div className={styles.videoWrapper}>
              <video 
                className={styles.videoPlayer} 
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
                <img src={article.imageUrl} alt={article.title} className={styles.coverImage} />
              </>
            )
          )}

          {/* Article Text Content */}
          <div className={styles.content}>
            {paragraphs.map((p: string, idx: number) => {
              // Parse headers if paragraph starts with ### or ##
              if (p.startsWith('### ')) {
                return <h3 key={idx}>{p.replace('### ', '')}</h3>;
              }
              if (p.startsWith('## ')) {
                return <h3 key={idx}>{p.replace('## ', '')}</h3>;
              }
              if (p.startsWith('- ')) {
                const listItems = p.split('\n');
                return (
                  <ul key={idx}>
                    {listItems.map((li, lIdx) => (
                      <li key={lIdx}>{li.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx}>{p}</p>;
            })}
          </div>
        </article>

        {/* Sidebar Panel */}
        <aside className={styles.sidebar}>
          {/* Uploader Card */}
          <div className={styles.widget}>
            <h4 className={styles.widgetTitle}>Verified Author</h4>
            <div className={styles.authorCard}>
              <span style={{ fontSize: '2rem' }}>✍</span>
              <span className={styles.authorName}>{uploaderName}</span>
              <span className={styles.authorRole}>Contributor / Uploader</span>
            </div>
          </div>

          {/* Interactive Likes Widget */}
          <div className={styles.widget}>
            <h4 className={styles.widgetTitle}>Save & Track Story</h4>
            <LikeButton 
              articleId={isMock ? `mock-${article.id}` : article.id}
              initialLiked={initialLiked}
              initialCount={likesCount}
              isLoggedIn={!!user}
            />
          </div>

          {/* Source Link Widget */}
          {article.sourceUrl && article.sourceUrl !== '#' && (
            <div className={styles.widget}>
              <h4 className={styles.widgetTitle}>Fact-Checked Source</h4>
              <a 
                href={article.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.sourceBadge}
              >
                <span>🔍 Verify Original Source</span>
                <span>↗</span>
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
