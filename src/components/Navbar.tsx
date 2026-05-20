import Link from 'next/link';
import { getUserFromCookie, removeSessionCookie } from '@/lib/auth';
import styles from './Navbar.module.css';
import { redirect } from 'next/navigation';

export default async function Navbar() {
  const user = await getUserFromCookie();

  async function handleLogout() {
    'use server';
    await removeSessionCookie();
    redirect('/');
  }

  return (
    <header className={`${styles.header} glass`}>
      <div className={`${styles.navContainer} container`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🌍</span>
          <span className="gradient-text">World News Center</span>
        </Link>

        {/* Mobile Navigation Checkbox Hamburger Hack */}
        <input type="checkbox" id="menuToggle" className={styles.menuCheckbox} />
        <label htmlFor="menuToggle" className={styles.menuButton}>
          <span></span>
          <span></span>
          <span></span>
        </label>

        {/* Links */}
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/?type=video" className={styles.navLink}>Videos</Link>
          
          {/* Role specific panels */}
          {user && user.role === 'READER' && (
            <Link href="/reader/dashboard" className={styles.navLink}>Saved News</Link>
          )}

          {user && user.role === 'UPLOADER' && (
            <>
              <Link href="/uploader/dashboard" className={styles.navLink}>Uploader Panel</Link>
              <Link href="/reader/dashboard" className={styles.navLink}>Saved News</Link>
            </>
          )}

          {user && user.role === 'ADMIN' && (
            <>
              <Link href="/admin/dashboard" className={styles.navLink}>Admin Metrics</Link>
              <Link href="/uploader/dashboard" className={styles.navLink}>Uploader Panel</Link>
              <Link href="/reader/dashboard" className={styles.navLink}>Saved News</Link>
            </>
          )}

          {/* Authentication State Display */}
          {user ? (
            <div className={styles.userMenu}>
              <div className={styles.profileTrigger}>
                <span>👤 {user.name}</span>
                <span className={`${styles.roleBadge} ${
                  user.role === 'ADMIN' ? styles.roleBadgeAdmin : 
                  user.role === 'UPLOADER' ? styles.roleBadgeUploader : 
                  styles.roleBadgeReader
                }`}>
                  {user.role}
                </span>
              </div>
              <form action={handleLogout}>
                <button type="submit" className={styles.logoutBtn}>
                  Log Out
                </button>
              </form>
            </div>
          ) : (
            <div className={styles.authGroup}>
              <Link href="/login" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                Sign In
              </Link>
              <Link href="/signup" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
