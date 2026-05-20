import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 72px - 280px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '3rem 1.5rem',
      position: 'relative'
    }}>
      <div className="glow-bg" style={{ width: '300px', height: '300px', background: 'var(--danger)', opacity: 0.1 }}></div>
      
      <div className="glass animate-fade-in" style={{
        maxWidth: '480px',
        padding: '3rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-premium)'
      }}>
        <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🚫</span>
        <h2 className="gradient-text" style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '2rem',
          marginBottom: '1rem'
        }}>
          Access Denied
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '2rem'
        }}>
          You do not have the necessary permissions to access this directory. Please sign in with an authorized account or return to the main feed.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/login" className="btn btn-primary">
            Sign In
          </Link>
          <Link href="/" className="btn btn-secondary">
            Go to Feed
          </Link>
        </div>
      </div>
    </div>
  );
}
