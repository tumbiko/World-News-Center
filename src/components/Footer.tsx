import Link from 'next/link';
import styles from './Footer.module.css';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.grid} container`}>
        {/* Brand Info */}
        <div className={styles.brandCol}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>
            <span>🌍</span>
            <span className="gradient-text">World News Center</span>
          </Link>
          <p className={styles.description}>
            Your premium global hub for breaking news, expert analyses, trending topics, and direct video feeds. Stay informed without restrictions.
          </p>
        </div>

        {/* Categories Links */}
        <div>
          <h4 className={styles.title}>Categories</h4>
          <ul className={styles.links}>
            <li><Link href="/?category=WORLD" className={styles.link}>World News</Link></li>
            <li><Link href="/?category=SPORTS" className={styles.link}>Sports News</Link></li>
            <li><Link href="/?category=MUSIC" className={styles.link}>Music & Culture</Link></li>
            <li><Link href="/?category=ENTERTAINMENT" className={styles.link}>Entertainment</Link></li>
            <li><Link href="/?category=TECH" className={styles.link}>Technology</Link></li>
            <li><Link href="/?category=BUSINESS" className={styles.link}>Business</Link></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className={styles.newsletterCol}>
          <h4 className={styles.title}>Newsletter</h4>
          <p className={styles.newsletterText}>
            Subscribe to our weekly alerts and get top trending stories delivered directly to your inbox. No registration required.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`${styles.bottom} container`}>
        <span className={styles.copyright}>
          © {currentYear} World News Center. All rights reserved. Built for scalability.
        </span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/privacy" className={styles.link} style={{ fontSize: '0.8rem' }}>Privacy Policy</Link>
          <Link href="/terms" className={styles.link} style={{ fontSize: '0.8rem' }}>Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}
