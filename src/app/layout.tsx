import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'World News Center | Global News Hub & Video Feed',
  description: 'Read the latest and trending news stories across sports, music, entertainment, and tech. Watch direct video updates. No registration required.',
  keywords: 'world news, sports news, music news, video news, breaking news, politics, entertainment',
  openGraph: {
    title: 'World News Center',
    description: 'Your premium global hub for breaking news, expert analyses, trending topics, and video feeds.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
  
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'system';
                  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
                  
                  function setTheme(t) {
                    var isDark = t === 'dark' || (t === 'system' && darkQuery.matches);
                    if (isDark) {
                      document.documentElement.classList.add('dark-theme');
                      document.documentElement.classList.remove('light-theme');
                    } else {
                      document.documentElement.classList.add('light-theme');
                      document.documentElement.classList.remove('dark-theme');
                    }
                  }
                  
                  setTheme(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
