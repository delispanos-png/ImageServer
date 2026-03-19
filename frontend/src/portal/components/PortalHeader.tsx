import { type FormEvent, type MouseEvent, useEffect, useMemo, useState } from 'react';
import { Button, Dropdown, Form, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { usePortalLanguage } from '../i18n/PortalLanguageProvider';
import { usePortalAuth } from '../providers/PortalAuthProvider';
import { portalRoutes } from '../routes/portalRouteMap';
import LanguageFlag from './LanguageFlag';

const THEME_STORAGE_KEY = 'cloudon_portal_theme';

const LANGUAGE_OPTIONS = [
  { value: 'en' as const, labelKey: 'portal.language.english' },
  { value: 'el' as const, labelKey: 'portal.language.greek' },
];

function getStoredTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark') {
  const body = document.body;
  if (theme === 'dark') {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
    return;
  }
  body.classList.remove('dark-mode');
  body.classList.add('light-mode');
}

export default function PortalHeader() {
  const navigate = useNavigate();
  const { client, logout } = usePortalAuth();
  const { language, setLanguage, t } = usePortalLanguage();
  const [searchValue, setSearchValue] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredTheme());
  const [responsiveSearchOpen, setResponsiveSearchOpen] = useState(false);

  useEffect(() => {
    applyTheme(theme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const handleLogout = async () => {
    await logout();
    navigate(`/${portalRoutes.login}`, { replace: true });
  };

  const openSidebar = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    document.body.classList.toggle('sidenav-toggled');
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const toggleFullscreen = async () => {
    const doc = document as Document & {
      webkitExitFullscreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
    };
    const root = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };

    if (document.fullscreenElement) {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
      return;
    }

    if (root.requestFullscreen) {
      await root.requestFullscreen();
    } else if (root.webkitRequestFullscreen) {
      await root.webkitRequestFullscreen();
    } else if (root.msRequestFullscreen) {
      await root.msRequestFullscreen();
    }
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = new URLSearchParams();
    if (searchValue.trim()) {
      query.set('search', searchValue.trim());
    }
    navigate(`/${portalRoutes.items}${query.toString() ? `?${query.toString()}` : ''}`);
    setResponsiveSearchOpen(false);
  };

  const currentLanguage = useMemo(
    () => LANGUAGE_OPTIONS.find((option) => option.value === language) || LANGUAGE_OPTIONS[0],
    [language],
  );

  return (
    <div className="app-header header cloudon-shell-header">
      <div className="container-fluid main-container">
        <div className="d-flex align-items-stretch">
          <div className="app-sidebar__toggle d-flex align-items-center" data-bs-toggle="sidebar">
            <Link className="open-toggle" to="#" onClick={openSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" className="cloudon-ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            </Link>
          </div>

          <div className="main-header-center ms-3 d-none d-lg-flex flex-grow-1 align-items-center cloudon-shell-search">
            <div className="form-inline w-100">
              <Form onSubmit={submitSearch} className="w-100">
                <div className="search-element w-100">
                  <Form.Control
                    className="cloudon-search-field"
                    type="text"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder={t('portal.actions.search')}
                    autoComplete="off"
                  />
                  <Button variant="" type="submit" className="cloudon-search-trigger" aria-label={t('portal.actions.search')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="cloudon-ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M20 20l-3.5-3.5" />
                    </svg>
                  </Button>
                </div>
              </Form>
            </div>
          </div>

          <Navbar className="d-flex order-lg-2 ms-auto main-header-end p-0 cloudon-shell-toolbar" expand="lg">
            <Navbar.Toggle
              className="navresponsive-toggler d-lg-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#portal-navbar-collapse"
              aria-controls="portal-navbar-collapse"
              aria-expanded={responsiveSearchOpen}
              aria-label="Toggle navigation"
              onClick={() => setResponsiveSearchOpen((current) => !current)}
            >
              <span className="navbar-toggler-icon header-iocns fe fe-more-vertical mt-1" />
            </Navbar.Toggle>

            <div className="mb-0 navbar navbar-expand-lg navbar-nav-right responsive-navbar navbar-dark p-0">
              <Navbar.Collapse className="collapse navbar-collapse" id="portal-navbar-collapse">
                <div className="d-flex order-lg-2 align-items-center">
                  <div className="dropdown d-block d-lg-none">
                    <a
                      href="#!"
                      className="nav-link icon"
                      onClick={(event) => {
                        event.preventDefault();
                        setResponsiveSearchOpen((current) => !current);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="cloudon-ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M20 20l-3.5-3.5" />
                      </svg>
                    </a>
                    <div className={`dropdown-menu header-search dropdown-menu-start ${responsiveSearchOpen ? 'show' : ''}`}>
                      <Form onSubmit={submitSearch} className="input-group w-100 p-2 border">
                        <Form.Control
                          className="cloudon-search-field"
                          type="text"
                          value={searchValue}
                          onChange={(event) => setSearchValue(event.target.value)}
                          placeholder={t('portal.actions.search')}
                        />
                        <button type="submit" className="input-group-text btn btn-primary cloudon-search-trigger">
                          <i className="fa fa-search" aria-hidden="true" />
                        </button>
                      </Form>
                    </div>
                  </div>

                  <div className="dropdown theme-setting">
                    <a className="nav-link icon theme-layout nav-link-bg layout-setting" onClick={toggleTheme} role="button" aria-label="Toggle dark mode">
                      <span className="light-layout">
                        <svg xmlns="http://www.w3.org/2000/svg" className="cloudon-ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                        </svg>
                      </span>
                      <span className="dark-layout">
                        <svg xmlns="http://www.w3.org/2000/svg" className="cloudon-ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="4" />
                          <path d="M12 2v2" />
                          <path d="M12 20v2" />
                          <path d="m4.93 4.93 1.41 1.41" />
                          <path d="m17.66 17.66 1.41 1.41" />
                          <path d="M2 12h2" />
                          <path d="M20 12h2" />
                          <path d="m6.34 17.66-1.41 1.41" />
                          <path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                      </span>
                    </a>
                  </div>

                  <div className="dropdown header-fullscreen d-flex">
                    <a className="nav-link icon full-screen-link p-0" id="fullscreen-button" onClick={() => void toggleFullscreen()} role="button" aria-label="Toggle fullscreen">
                      <svg xmlns="http://www.w3.org/2000/svg" className="cloudon-ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                        <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                        <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
                        <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
                      </svg>
                    </a>
                  </div>

                  <Dropdown className="dropdown country-selector d-flex">
                    <Dropdown.Toggle as="a" className="nav-link leading-none no-caret" variant="" id="portal-language-toggle">
                      <span className="header-avatar1 d-flex align-items-center gap-2">
                        <LanguageFlag language={currentLanguage.value} />
                        <span className="fs-14 font-weight-semibold country-text">{t(currentLanguage.labelKey)}</span>
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-end dropdown-menu-arrow animated">
                      {LANGUAGE_OPTIONS.map((option) => (
                        <Dropdown.Item key={option.value} className="dropdown-item d-flex align-items-center" onClick={() => setLanguage(option.value)}>
                          <LanguageFlag language={option.value} className="me-2" />
                          <span className="fs-13 text-wrap">{t(option.labelKey)}</span>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>

                  <Dropdown align="end">
                    <Dropdown.Toggle variant="light" className="border d-flex align-items-center gap-2 cloudon-profile-toggle">
                      <span className="avatar avatar-md rounded-circle bg-primary-transparent text-primary fw-bold d-inline-flex align-items-center justify-content-center">
                        {(client?.name || client?.company || 'C').slice(0, 1).toUpperCase()}
                      </span>
                      <span className="text-start d-none d-md-flex flex-column">
                        <span className="fw-semibold">{client?.company || client?.name || t('portal.title')}</span>
                        <span className="fs-11 text-muted">{client?.api_username || client?.email || ''}</span>
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => navigate(`/${portalRoutes.profile}`)}>{t('portal.actions.profile')}</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={() => void handleLogout()}>{t('portal.actions.logout')}</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Navbar.Collapse>
            </div>
          </Navbar>
        </div>
      </div>
    </div>
  );
}
