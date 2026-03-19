export type ShellTheme = 'light' | 'dark';

const ADMIN_THEME_STORAGE_KEY = 'cloudon_admin_theme';

function applyThemeClasses(theme: ShellTheme) {
  const body = document.body;
  if (theme === 'dark') {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
    return;
  }

  body.classList.add('light-mode');
  body.classList.remove('dark-mode');
}

export function getStoredAdminTheme(): ShellTheme {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.localStorage.getItem(ADMIN_THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
}

export function initializeAdminShellState() {
  if (typeof document === 'undefined') {
    return;
  }
  applyThemeClasses(getStoredAdminTheme());
}

export function setAdminTheme(theme: ShellTheme) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, theme);
  }
  if (typeof document !== 'undefined') {
    applyThemeClasses(theme);
  }
}

export function syncStickySidebar() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }
  const shouldPin = window.scrollY > 30 && document.querySelector('.app-sidebar');
  document.querySelectorAll('.sticky').forEach((element) => {
    element.classList.toggle('sticky-pin', Boolean(shouldPin));
  });
}

export function bindStickySidebar() {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const onScroll = () => syncStickySidebar();
  window.addEventListener('scroll', onScroll, { passive: true });
  syncStickySidebar();
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
}
