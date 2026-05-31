import Link from 'next/link';
import Image from 'next/image';
import { getUserFromCookie, removeSessionCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { User } from 'lucide-react';

export default async function Navbar() {
  const user = await getUserFromCookie();

  async function handleLogout() {
    'use server';
    await removeSessionCookie();
    redirect('/');
  }

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full h-[72px] flex items-center border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center justify-between w-full h-full container mx-auto px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-foreground">
          <Image src="/logo.png" alt="World News Center Logo" width={44} height={44} className="rounded-full object-contain" priority />
          <span className="gradient-text">World News Center</span>
        </Link>

        {/* Mobile Navigation Checkbox Hamburger Hack */}
        <input type="checkbox" id="menuToggle" className="peer hidden" />
        <label
          htmlFor="menuToggle"
          className="md:hidden flex flex-col justify-between w-6 h-[18px] cursor-pointer z-50 peer-checked:[&>span:nth-child(1)]:translate-y-[8px] peer-checked:[&>span:nth-child(1)]:rotate-45 peer-checked:[&>span:nth-child(2)]:opacity-0 peer-checked:[&>span:nth-child(3)]:-translate-y-[8px] peer-checked:[&>span:nth-child(3)]:-rotate-45"
        >
          <span className="block w-full h-[2px] bg-foreground rounded-full transition-all duration-300"></span>
          <span className="block w-full h-[2px] bg-foreground rounded-full transition-all duration-300"></span>
          <span className="block w-full h-[2px] bg-foreground rounded-full transition-all duration-300"></span>
        </label>

        {/* Links */}
        <nav className="flex items-center gap-8 list-none md:flex-row flex-col md:static fixed top-0 -right-full peer-checked:right-0 w-[280px] md:w-auto h-screen md:h-auto bg-card md:bg-transparent border-l md:border-l-0 border-border p-8 md:p-0 md:shadow-none shadow-lg transition-all duration-300 pt-28 md:pt-0 z-40">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground relative py-2 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-primary after:to-secondary after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left after:transition-transform after:duration-300">Home</Link>
          <Link href="/?type=video" className="text-sm font-medium text-muted-foreground hover:text-foreground relative py-2 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-primary after:to-secondary after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left after:transition-transform after:duration-300">Videos</Link>
          
          {/* Role specific panels */}
          {user && user.role === 'READER' && (
            <Link href="/reader/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground relative py-2 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-primary after:to-secondary after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left after:transition-transform after:duration-300">Saved News</Link>
          )}

          {user && user.role === 'UPLOADER' && (
            <>
              <Link href="/uploader/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground relative py-2 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-primary after:to-secondary after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left after:transition-transform after:duration-300">Uploader Panel</Link>
              <Link href="/reader/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground relative py-2 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-primary after:to-secondary after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left after:transition-transform after:duration-300">Saved News</Link>
            </>
          )}

          {user && user.role === 'ADMIN' && (
            <>
              <Link href="/admin/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground relative py-2 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-primary after:to-secondary after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left after:transition-transform after:duration-300">Admin Metrics</Link>
              <Link href="/uploader/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground relative py-2 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-primary after:to-secondary after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left after:transition-transform after:duration-300">Uploader Panel</Link>
              <Link href="/reader/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground relative py-2 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-primary after:to-secondary after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left after:transition-transform after:duration-300">Saved News</Link>
            </>
          )}

          {/* Authentication State Display */}
          {user ? (
            <div className="flex items-center gap-4 md:flex-row flex-col w-full md:w-auto border-t md:border-t-0 border-border pt-4 md:pt-0 mt-4 md:mt-0">
              <div className="flex items-center gap-2 bg-muted border border-border px-4 py-1.5 rounded-full font-medium text-sm text-foreground">
                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" /> {user.name}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider ${
                  user.role === 'ADMIN' ? 'bg-accent-glow text-accent' : 
                  user.role === 'UPLOADER' ? 'bg-secondary-glow text-secondary' : 
                  'bg-primary-glow text-primary'
                }`}>
                  {user.role}
                </span>
              </div>
              <form action={handleLogout} className="w-full md:w-auto">
                <button type="submit" className="w-full md:w-auto text-left bg-transparent hover:bg-destructive-glow text-destructive font-medium text-sm px-4 py-2 rounded-md transition-colors cursor-pointer">
                  Log Out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4 md:flex-row flex-col w-full md:w-auto border-t md:border-t-0 border-border pt-4 md:pt-0 mt-4 md:mt-0">
              <Link href="/login" className="btn btn-secondary w-full md:w-auto text-center" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                Sign In
              </Link>
              <Link href="/signup" className="btn btn-primary w-full md:w-auto text-center" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                Sign Up
              </Link>
            </div>
          )}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
