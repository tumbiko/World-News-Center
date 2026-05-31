import Link from 'next/link';
import NewsletterForm from './NewsletterForm';
import { Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.5fr] gap-12 mb-12">
        {/* Brand Info */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 font-display font-extrabold text-xl text-foreground">
            <Globe className="h-5 w-5 text-primary" />
            <span className="gradient-text">World News Center</span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Your premium global hub for breaking news, expert analyses, trending topics, and direct video feeds. Stay informed without restrictions.
          </p>
        </div>

        {/* Categories Links */}
        <div>
          <h4 className="font-display text-base font-bold text-foreground mb-5">Categories</h4>
          <ul className="flex flex-col gap-3 list-none">
            {[
              ['/?category=WORLD', 'World News'],
              ['/?category=SPORTS', 'Sports News'],
              ['/?category=MUSIC', 'Music & Culture'],
              ['/?category=ENTERTAINMENT', 'Entertainment'],
              ['/?category=TECH', 'Technology'],
              ['/?category=BUSINESS', 'Business'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-150 inline-block"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-base font-bold text-foreground mb-2">Newsletter</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Subscribe to our weekly alerts and get top trending stories delivered directly to your inbox. No registration required.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto px-6 border-t border-border pt-6 flex flex-wrap justify-between items-center gap-4">
        <span className="text-muted-foreground text-sm">
          © {currentYear} World News Center. All rights reserved. Built for scalability.
        </span>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}
