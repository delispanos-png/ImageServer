import { Fragment, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useAuth } from '../../app/providers/AuthProvider';
import { getSidebarMenuItems } from './SidebarData';
import cloudonMark from '../../assets/images/brand/cloudon-mark.svg';
import { useAdminLanguage } from '../../app/i18n/AdminLanguageProvider';

const GROUP_TRANSLATIONS: Record<string, string> = {
  APPLICATION: 'admin.sidebar.application',
};

const ITEM_TRANSLATIONS: Record<string, string> = {
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
  'missing-barcodes': 'admin.menu.missingBarcodes',
  'brand-queue': 'admin.menu.brandQueue',
  duplicates: 'admin.menu.duplicates',
  analytics: 'admin.menu.analytics',
  'product-attributes': 'admin.menu.productAttributes',
  users: 'admin.menu.users',
  roles: 'admin.menu.roles',
  notifications: 'admin.menu.notifications',
  'audit-log': 'admin.menu.auditLog',
  settings: 'admin.menu.settings',
};

function toCmsPath(pathname?: string) {
  const normalized = String(pathname || 'dashboard').replace(/^\/+/, '').replace(/\/+$/, '');
  return `/${normalized || 'dashboard'}`;
}

export default function SideBar() {
  const { role } = useAuth();
  const { t } = useAdminLanguage();
  const groups = useMemo(() => getSidebarMenuItems(role), [role]);

  return (
    <Fragment>
      <div className="sticky">
        <div className="app-sidebar cloudon-shell-sidebar">
          <PerfectScrollbar>
            <div className="app-sidebar__logo">
              <Link className="header-brand cloudon-brand-block" to={toCmsPath('dashboard')}>
                <span className="cloudon-brand-mark">
                  <img
                    src={cloudonMark}
                    className="cloudon-brand-image cloudon-brand-image--mark"
                    alt="CloudOn CMS"
                  />
                </span>
                <span className="cloudon-brand-copy">
                  <span className="cloudon-brand-title">CloudOn</span>
                  <span className="cloudon-brand-subtitle">ContentSync Platform</span>
                </span>
              </Link>
            </div>

            <div className="main-sidemenu">
              <ul className="side-menu app-sidebar3">
                {groups.map((group) => (
                  <Fragment key={group.id}>
                    <li className="side-item side-item-category cloudon-side-group">{t(GROUP_TRANSLATIONS[group.menutitle] || group.menutitle)}</li>
                    {group.Items.map((item: any) => (
                      <li key={item.title} className="slide">
                        <NavLink
                          to={toCmsPath(item.path)}
                          className={({ isActive }) => `side-menu__item ${isActive ? 'active' : ''}`}
                          end
                        >
                          {item.icon}
                          <span className="side-menu__label">{t(ITEM_TRANSLATIONS[item.path] || item.title)}</span>
                        </NavLink>
                      </li>
                    ))}
                  </Fragment>
                ))}
              </ul>
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </Fragment>
  );
}
