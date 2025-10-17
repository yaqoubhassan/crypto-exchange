import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export function ThemeProvider({ children }) {
  const { auth } = usePage().props;
  const userTheme = auth?.user?.theme || 'light';

  useEffect(() => {
    const root = window.document.documentElement;

    // Determine the actual theme to apply
    let appliedTheme = userTheme;

    if (userTheme === 'system') {
      appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Apply theme
    if (appliedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Listen for system theme changes if using system preference
    if (userTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e) => {
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [userTheme]);

  return <>{children}</>;
}