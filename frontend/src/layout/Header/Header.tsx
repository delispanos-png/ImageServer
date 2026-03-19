import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Form, ListGroup, Navbar } from 'react-bootstrap';
import { Scrollbar } from 'react-scrollbars-custom';
import { getSidebarMenuItems } from '../SideBar/SidebarData';
import cloudonLogo from '../../assets/images/brand/cloudon-wordmark.svg';
import LanguageFlag from '../../CommonComponents/LanguageFlag';
import { fetchHeaderEvents, markHeaderEventsRead } from '../../services/cms-header';
import type { CmsHeaderEvent } from '../../types';
import { useAuth } from '../../app/providers/AuthProvider';
import { cmsRoutes } from '../../app/routes/routeMap';
import { useAdminLanguage } from '../../app/i18n/AdminLanguageProvider';
import { getStoredAdminTheme, initializeAdminShellState, setAdminTheme } from '../../app/ui/shell';

const MENU_TRANSLATIONS: Record<string, string> = {
  dashboard: 'admin.menu.dashboard',
  server: 'admin.menu.server',
  sources: 'admin.menu.sources',
  items: 'admin.menu.items',
  'fix-queue': 'admin.menu.fixQueue',
  'review-queue': 'admin.menu.reviewQueue',
  'items-by-category': 'admin.menu.itemsByCategory',
  categories: 'admin.menu.categories',
  clients: 'admin.menu.clients',
  'customer-remarks': 'admin.menu.customerRemarks',
  users: 'admin.menu.users',
  roles: 'admin.menu.roles',
  notifications: 'admin.menu.notifications',
  'audit-log': 'admin.menu.auditLog',
  settings: 'admin.menu.settings',
};

function Header() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { language, setLanguage, t } = useAdminLanguage();
  const [inputValue, setInputValue] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerEvents, setHeaderEvents] = useState<CmsHeaderEvent[]>([]);
  const [headerEventsLoading, setHeaderEventsLoading] = useState(true);
  const [headerEventsError, setHeaderEventsError] = useState('');
  const [headerUnreadCount, setHeaderUnreadCount] = useState(0);
  const [headerEventsOpen, setHeaderEventsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredAdminTheme());

  useEffect(() => {
    initializeAdminShellState();
  }, []);

  useEffect(() => {
    setAdminTheme(theme);
  }, [theme]);

  const menuGroups = useMemo(() => getSidebarMenuItems(role), [role]);
  const searchItems = useMemo(
    () =>
      menuGroups.flatMap((group) =>
        group.Items.map((item: any) => ({
          path: String(item.path || '').replace(/^\/+/, ''),
          title: t(MENU_TRANSLATIONS[item.path] || item.title),
        })),
      ),
    [menuGroups, t],
  );

  const searchResults = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    if (!query) {
      return [];
    }
    return searchItems.filter((item) => item.title.toLowerCase().includes(query));
  }, [inputValue, searchItems]);

  useEffect(() => {
    let mounted = true;

    const loadHeaderEvents = async () => {
      try {
        const response = await fetchHeaderEvents(12);
        if (!mounted) {
          return;
        }
        setHeaderEvents(response.data || []);
        setHeaderUnreadCount(response.meta?.unread_events ?? (response.data || []).length);
        setHeaderEventsError('');
      } catch (error) {
        if (!mounted) {
          return;
        }
        setHeaderEvents([]);
        setHeaderUnreadCount(0);
        setHeaderEventsError(error instanceof Error ? error.message : t('admin.events.loading'));
      } finally {
        if (mounted) {
          setHeaderEventsLoading(false);
        }
      }
    };

    void loadHeaderEvents();
    const timer = window.setInterval(() => {
      if (!headerEventsOpen) {
        void loadHeaderEvents();
      }
    }, 15000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, [headerEventsOpen, t]);

  const onHeaderEventsToggle = async (show: boolean) => {
    setHeaderEventsOpen(show);
    if (!show) {
      return;
    }

    setHeaderEventsLoading(true);
    try {
      const response = await fetchHeaderEvents(12);
      const unreadEvents = response.data || [];
      setHeaderEvents(unreadEvents);
      setHeaderUnreadCount(response.meta?.unread_events ?? unreadEvents.length);
      setHeaderEventsError('');
      if (unreadEvents.length) {
        await markHeaderEventsRead(unreadEvents.map((event) => event.id));
        setHeaderUnreadCount(0);
      }
    } catch (error) {
      setHeaderEvents([]);
      setHeaderUnreadCount(0);
      setHeaderEventsError(error instanceof Error ? error.message : t('admin.events.loading'));
    } finally {
      setHeaderEventsLoading(false);
    }
  };

  const openSidebar = () => {
    document.body.classList.toggle('sidenav-toggled');
  };

  const toggleResponsiveSearch = () => {
    document.querySelector('.header-search')?.classList.toggle('show');
  };

  const toggleDarkMode = () => {
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

  const accountDisplayName = user?.full_name?.trim() || user?.email?.trim() || 'CloudOn Admin';
  const accountSubtitle = user?.email?.trim() || (user?.role ? String(user.role).replaceAll('_', ' ') : 'CMS user');
  const accountInitial = accountDisplayName.slice(0, 1).toUpperCase();

  const formatHeaderEventTime = (value: string) => {
    if (!value) {
      return '-';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat(language === 'el' ? 'el-GR' : 'en-GB', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getHeaderEventAppearance = (event: CmsHeaderEvent) => {
    if (event.source === 'notification') {
      return { border: 'primary', text: 'primary', background: 'primary', icon: 'fa-bell' };
    }
    if (event.source === 'api_client') {
      return { border: 'info', text: 'info', background: 'info', icon: 'fa-plug' };
    }
    return { border: 'secondary', text: 'secondary', background: 'secondary', icon: 'fa-history' };
  };

  const openAccountSettings = () => {
    navigate(`/${cmsRoutes.settings}`);
  };

  const handleSignOut = async () => {
    await logout();
    navigate(`/${cmsRoutes.login}`, { replace: true });
  };

  const currentLanguageLabel = language === 'el' ? t('admin.language.greek') : t('admin.language.english');

  return (
    <Fragment>
      <div className="app-header header cloudon-shell-header">
        <div className="container-fluid main-container">
          <div className="d-flex align-items-stretch">
            <div className="app-sidebar__toggle d-flex align-items-center" data-bs-toggle="sidebar">
              <Link className="open-toggle" to="#" onClick={(event) => {
                event.preventDefault();
                openSidebar();
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="cloudon-ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 7h16"></path>
                  <path d="M4 12h16"></path>
                  <path d="M4 17h16"></path>
                </svg>
              </Link>
            </div>
            <div className="logo-horizontal">
              <Link to={`${import.meta.env.BASE_URL}dashboard`}>
                <img src={cloudonLogo} className="header-brand-img desktop-lgo" alt="CloudOn ContentSync Platform" style={{ width: '196px', height: 'auto' }} />
                <img src={cloudonLogo} className="header-brand-img dark-logo" alt="CloudOn ContentSync Platform" style={{ width: '196px', height: 'auto' }} />
              </Link>
            </div>
            <div className="main-header-center ms-3 d-none d-lg-block flex-grow-1 cloudon-shell-search">
              <div className="form-inline w-100">
                <div className="search-element w-100 position-relative">
                  <Form.Control
                    className="cloudon-search-field"
                    type="text"
                    value={inputValue}
                    id="typehead"
                    placeholder={t('admin.search.placeholder')}
                    autoComplete="off"
                    onFocus={() => setSearchOpen(true)}
                    onChange={(event) => {
                      setInputValue(event.target.value);
                      setSearchOpen(true);
                    }}
                  />
                  <Button type="button" variant="" className="cloudon-search-trigger" onClick={() => setSearchOpen((current) => !current)} aria-label={t('admin.search.placeholder')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="cloudon-ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="7"></circle>
                      <path d="M20 20l-3.5-3.5"></path>
                    </svg>
                  </Button>
                  {searchOpen ? (
                    <div className="card search-result cloudon-search-dropdown position-absolute z-index-9 search-fix border mt-1 w-100">
                      <div className="card-header">
                        <h4 className="card-title me-2 text-break mb-0">{inputValue ? `${t('admin.search.placeholder')}: ${inputValue}` : t('admin.search.empty')}</h4>
                      </div>
                      <ListGroup className="mt-2 search_bar">
                        {inputValue ? (
                          searchResults.length ? (
                            searchResults.map((item) => (
                              <ListGroup.Item key={item.path}>
                                <Link
                                  to={`/${item.path}`}
                                  className="search-result-item"
                                  onClick={() => {
                                    setSearchOpen(false);
                                    setInputValue('');
                                  }}
                                >
                                  {item.title}
                                </Link>
                              </ListGroup.Item>
                            ))
                          ) : (
                            <b className="text-danger px-3 py-2">{t('admin.search.noResults')}</b>
                          )
                        ) : (
                          <b className="text-muted px-3 py-2">{t('admin.search.empty')}</b>
                        )}
                      </ListGroup>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <Navbar className="d-flex order-lg-2 ms-auto main-header-end p-0 cloudon-shell-toolbar" expand="lg">
              <Navbar.Toggle
                className="navresponsive-toggler d-lg-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent-4"
                aria-controls="navbarSupportedContent-4"
                aria-expanded="true"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon header-iocns fe fe-more-vertical mt-1"></span>
              </Navbar.Toggle>

              <div className="mb-0 navbar navbar-expand-lg navbar-nav-right responsive-navbar navbar-dark p-0">
                <Navbar.Collapse className="collapse navbar-collapse" id="navbarSupportedContent-4">
                  <div className="d-flex order-lg-2 align-items-center">
                    <div className="dropdown d-block d-lg-none">
                      <Link
                        to="#"
                        className="nav-link icon"
                        onClick={(event) => {
                          event.preventDefault();
                          toggleResponsiveSearch();
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="cloudon-ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="11" cy="11" r="7"></circle>
                          <path d="M20 20l-3.5-3.5"></path>
                        </svg>
                      </Link>
                      <div className="dropdown-menu header-search dropdown-menu-start">
                        <div className="input-group w-100 p-2 border">
                          <input
                            type="text"
                            className="form-control cloudon-search-field"
                            placeholder={t('admin.search.placeholder')}
                            value={inputValue}
                            onChange={(event) => setInputValue(event.target.value)}
                          />
                          <div className="input-group-text btn btn-primary cloudon-search-trigger">
                            <i className="fa fa-search" aria-hidden="true"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dropdown theme-setting">
                      <a className="nav-link icon theme-layout nav-link-bg layout-setting" onClick={toggleDarkMode} role="button" aria-label="Toggle theme">
                        <span className="light-layout">
                          <svg xmlns="http://www.w3.org/2000/svg" className="cloudon-ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path>
                          </svg>
                        </span>
                        <span className="dark-layout">
                          <svg xmlns="http://www.w3.org/2000/svg" className="cloudon-ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="4"></circle>
                            <path d="M12 2v2"></path>
                            <path d="M12 20v2"></path>
                            <path d="m4.93 4.93 1.41 1.41"></path>
                            <path d="m17.66 17.66 1.41 1.41"></path>
                            <path d="M2 12h2"></path>
                            <path d="M20 12h2"></path>
                            <path d="m6.34 17.66-1.41 1.41"></path>
                            <path d="m19.07 4.93-1.41 1.41"></path>
                          </svg>
                        </span>
                      </a>
                    </div>

                    <div className="dropdown header-fullscreen d-flex">
                      <a className="nav-link icon full-screen-link p-0" id="fullscreen-button" onClick={() => void toggleFullscreen()} role="button" aria-label="Toggle fullscreen">
                        <svg xmlns="http://www.w3.org/2000/svg" className="cloudon-ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                          <path d="M16 3h3a2 2 0 0 1 2 2v3"></path>
                          <path d="M21 16v3a2 2 0 0 1-2 2h-3"></path>
                          <path d="M8 21H5a2 2 0 0 1-2-2v-3"></path>
                        </svg>
                      </a>
                    </div>

                    <Dropdown className="dropdown country-selector d-flex">
                      <Dropdown.Toggle as="a" className="nav-link leading-none no-caret" variant="" id="admin-language-toggle">
                        <span className="header-avatar1 d-flex align-items-center gap-2">
                          <LanguageFlag language={language} />
                          <span className="fs-14 font-weight-semibold country-text">{currentLanguageLabel}</span>
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-end dropdown-menu-arrow animated">
                        <Dropdown.Item className="dropdown-item d-flex align-items-center" onClick={() => setLanguage('en')}>
                          <LanguageFlag language="en" className="me-2" />
                          <span className="fs-13 text-wrap">{t('admin.language.english')}</span>
                        </Dropdown.Item>
                        <Dropdown.Item className="dropdown-item d-flex align-items-center" onClick={() => setLanguage('el')}>
                          <LanguageFlag language="el" className="me-2" />
                          <span className="fs-13 text-wrap">{t('admin.language.greek')}</span>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown className="header-notify d-flex" onToggle={(show) => { void onHeaderEventsToggle(Boolean(show)); }}>
                      <Dropdown.Toggle as="a" className="nav-link icon no-caret" variant="" id="admin-events-toggle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="cloudon-ui-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5"></path>
                          <path d="M9 17a3 3 0 0 0 6 0"></path>
                        </svg>
                        {headerUnreadCount > 0 ? <span className="badge bg-danger side-badge">{headerUnreadCount > 99 ? '99+' : headerUnreadCount}</span> : <span className="pulse"></span>}
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-end dropdown-menu-arrow animated ps ps--active-y">
                        <Scrollbar style={{ width: 340, height: 360 }}>
                          <div className="dropdown-header d-flex align-items-center">
                            <h6 className="mb-0">{t('admin.events.system')}</h6>
                            <span className="badge fs-10 bg-secondary br-7 ms-auto">{headerUnreadCount || 0}</span>
                          </div>
                          {headerEventsLoading ? (
                            <div className="dropdown-item text-center text-muted py-3">{t('admin.events.loading')}</div>
                          ) : headerEventsError ? (
                            <div className="dropdown-item text-center text-danger py-3">{headerEventsError}</div>
                          ) : headerEvents.length ? (
                            <>
                              {headerEvents.map((event) => {
                                const appearance = getHeaderEventAppearance(event);
                                return (
                                  <Link
                                    key={event.id}
                                    className="dropdown-item border-bottom d-flex ps-4"
                                    to={`/${String(event.route || '').replace(/^\/+/, '')}`}
                                  >
                                    <span className={`avatar avatar-md brround me-3 align-self-center border border-${appearance.border} bg-${appearance.background}-transparent text-${appearance.text}`}>
                                      <i className={`fa ${appearance.icon}`}></i>
                                    </span>
                                    <div className="d-flex mt-1 mb-1 w-100">
                                      <div className="flex-fill text-start">
                                        <h6 className="mb-1 fw-semibold text-dark">{event.title}</h6>
                                        <div className="text-muted fs-12 mb-1">{event.subtitle}</div>
                                        <div className="d-flex justify-content-between align-items-center gap-2 fs-11 text-muted">
                                          <span>{event.source}</span>
                                          <span>{formatHeaderEventTime(event.created_at)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                );
                              })}
                            </>
                          ) : (
                            <div className="dropdown-item text-center text-muted py-3">{t('admin.events.none')}</div>
                          )}
                        </Scrollbar>
                      </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown className="profile-1 d-flex">
                      <Dropdown.Toggle as="a" variant="" className="nav-link leading-none d-flex no-caret align-items-center gap-2 cloudon-profile-toggle" id="admin-profile-toggle">
                        <span
                          className="avatar avatar-md rounded-circle bg-primary-transparent text-primary fw-bold d-inline-flex align-items-center justify-content-center"
                          style={{ width: '40px', height: '40px' }}
                        >
                          {accountInitial}
                        </span>
                        <span className="d-none d-xl-flex flex-column text-start lh-sm">
                          <span className="fw-semibold text-dark">{accountDisplayName}</span>
                          <span className="text-muted fs-11">{accountSubtitle}</span>
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-end dropdown-menu-arrow animated">
                        <div className="dropdown-header text-center border-bottom pb-3">
                          <span className="avatar avatar-xxl rounded-circle bg-primary-transparent text-primary fw-bold d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
                            {accountInitial}
                          </span>
                          <div className="fw-semibold text-dark">{accountDisplayName}</div>
                          <div className="text-muted fs-12">{accountSubtitle}</div>
                        </div>
                        <Dropdown.Item className="d-flex align-items-center gap-2" onClick={openAccountSettings}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 9 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                          </svg>
                          {t('admin.actions.settings')}
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="d-flex align-items-center gap-2 text-danger" onClick={() => void handleSignOut()}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                          </svg>
                          {t('admin.actions.signOut')}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Navbar.Collapse>
              </div>
            </Navbar>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Header;
