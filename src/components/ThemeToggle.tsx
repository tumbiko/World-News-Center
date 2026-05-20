'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
    setTheme(savedTheme);
    setMounted(true);
    
    // Set listener for system preference change if in system mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const current = localStorage.getItem('theme') || 'system';
      if (current === 'system') {
        const isDark = mediaQuery.matches;
        if (isDark) {
          document.documentElement.classList.add('dark-theme');
          document.documentElement.classList.remove('light-theme');
        } else {
          document.documentElement.classList.add('light-theme');
          document.documentElement.classList.remove('dark-theme');
        }
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDark = newTheme === 'dark' || (newTheme === 'system' && darkQuery.matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  };

  // Avoid hydration mismatch by rendering a placeholder state until mounted
  if (!mounted) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--background-alt)',
        border: '1px solid var(--card-border)',
        padding: '2px',
        borderRadius: 'var(--radius-full)',
        marginLeft: '1rem',
        height: '32px',
        width: '200px',
        opacity: 0.5,
      }} />
    );
  }

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      background: 'var(--background-alt)',
      border: '1px solid var(--card-border)',
      padding: '2px',
      borderRadius: 'var(--radius-full)',
      marginLeft: '1rem',
    }}>
      {(['light', 'dark', 'system'] as const).map((t) => (
        <button
          key={t}
          onClick={() => changeTheme(t)}
          style={{
            background: theme === t ? 'var(--card)' : 'transparent',
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            color: theme === t ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'var(--transition-fast)',
            boxShadow: theme === t ? 'var(--shadow-sm)' : 'none',
          }}
          title={`Switch to ${t} theme`}
        >
          <span style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
            {t === 'light' && '☀️'}
            {t === 'dark' && '🌙'}
            {t === 'system' && '💻'}
          </span>
          <span style={{ textTransform: 'capitalize', fontSize: '0.7rem' }}>{t}</span>
        </button>
      ))}
    </div>
  );
}
