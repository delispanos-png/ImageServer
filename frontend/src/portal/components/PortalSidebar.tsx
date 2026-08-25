import { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import cloudonMark from '../../assets/images/brand/cloudon-mark.svg';
import { usePortalLanguage } from '../i18n/PortalLanguageProvider';
import { portalRoutes } from '../routes/portalRouteMap';

const dashboardIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="side-menu__icon" width="24" height="24" viewBox="0 0 24 24">
    <path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13zm7 7v-5h4v5h-4z" />
  </svg>
);

const folderIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="side-menu__icon" width="24" height="24" viewBox="0 0 24 24">
    <path d="M20 6h-8l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
  </svg>
);

const listIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="side-menu__icon" width="24" height="24" viewBox="0 0 24 24">
    <path d="M4 6h2v2H4V6zm4 0h12v2H8V6zM4 11h2v2H4v-2zm4 0h12v2H8v-2zM4 16h2v2H4v-2zm4 0h12v2H8v-2z" />
  </svg>
);

const userIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="side-menu__icon" width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
  </svg>
);

const commentIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="side-menu__icon" width="24" height="24" viewBox="0 0 24 24">
    <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
  </svg>
);

function toPortalPath(pathname?: string) {
  const normalized = String(pathname || portalRoutes.dashboard).replace(/^\/+/, '').replace(/\/+$/, '');
  return `/${normalized || portalRoutes.dashboard}`;
}

export default function PortalSidebar() {
  const { t } = usePortalLanguage();

  const menuItems = [
    { path: portalRoutes.dashboard, title: t('portal.nav.dashboard'), icon: dashboardIcon },
    { path: portalRoutes.items, title: t('portal.nav.items'), icon: folderIcon },
    { path: portalRoutes.newItems, title: t('portal.nav.newItems'), icon: listIcon },
    { path: portalRoutes.categories, title: t('portal.nav.categories'), icon: listIcon },
    { path: portalRoutes.myRemarks, title: t('portal.nav.remarks'), icon: commentIcon },
    { path: portalRoutes.submitProduct, title: 'Υποβολή νέου προϊόντος', icon: listIcon },
    { path: portalRoutes.profile, title: t('portal.nav.profile'), icon: userIcon },
  ];

  return (
    <Fragment>
      <div className="sticky">
        <div className="app-sidebar cloudon-shell-sidebar">
          <PerfectScrollbar>
            <div className="app-sidebar__logo">
              <Link className="header-brand cloudon-brand-block" to={toPortalPath(portalRoutes.dashboard)}>
                <span className="cloudon-brand-mark">
                  <img src={cloudonMark} className="cloudon-brand-image cloudon-brand-image--mark" alt="CloudOn Portal" />
                </span>
                <span className="cloudon-brand-copy">
                  <span className="cloudon-brand-title">CloudOn</span>
                  <span className="cloudon-brand-subtitle">ContentSync Platform</span>
                </span>
              </Link>
            </div>
            <div className="main-sidemenu">
              <ul className="side-menu app-sidebar3">
                <li className="side-item side-item-category cloudon-side-group">{t('portal.sidebar.section')}</li>
                {menuItems.map((item) => (
                  <li key={item.path} className="slide">
                    <NavLink to={toPortalPath(item.path)} className={({ isActive }) => `side-menu__item ${isActive ? 'active' : ''}`} end={item.path !== portalRoutes.items && item.path !== portalRoutes.categories}>
                      {item.icon}
                      <span className="side-menu__label">{item.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </Fragment>
  );
}
