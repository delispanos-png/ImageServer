import React from 'react';
import type { CmsRole } from '../../types';
import { canAccessModule } from '../../services/permissions';

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

const usersIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="side-menu__icon" width="24" height="24" viewBox="0 0 24 24">
    <path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zm-8 0c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zm0 2c-2.673 0-8 1.344-8 4v3h10v-3c0-1.087.39-2.055 1.048-2.857C9.938 13.423 8.48 13 8 13zm8 0c-.48 0-1.938.423-3.048 1.143C13.61 14.945 14 15.913 14 17v3h10v-3c0-2.656-5.327-4-8-4z" />
  </svg>
);

const bellIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="side-menu__icon" width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2z" />
  </svg>
);

const listIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="side-menu__icon" width="24" height="24" viewBox="0 0 24 24">
    <path d="M4 6h2v2H4V6zm4 0h12v2H8V6zM4 11h2v2H4v-2zm4 0h12v2H8v-2zM4 16h2v2H4v-2zm4 0h12v2H8v-2z" />
  </svg>
);

const settingsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="side-menu__icon" width="24" height="24" viewBox="0 0 24 24">
    <path d="M19.14 12.94a7.963 7.963 0 0 0 .06-.94 7.963 7.963 0 0 0-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.28 7.28 0 0 0-1.63-.94L14.5 2.5a.488.488 0 0 0-.49-.5h-4a.488.488 0 0 0-.49.5l-.36 2.56c-.58.23-1.12.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.62 8.58a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.07.63-.07.95s.03.64.07.95l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.39 1.05.71 1.63.94l.36 2.56a.488.488 0 0 0 .49.5h4c.25 0 .46-.18.49-.42l.36-2.64c.58-.23 1.12-.54 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.02-1.57zM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5z" />
  </svg>
);

const MENU_ITEMS: any = [
  {
    menutitle: 'APPLICATION',
    id: 1,
    Items: [
      { path: 'dashboard', moduleKey: 'dashboard', icon: dashboardIcon, type: 'link', active: false, selected: false, title: 'Dashboard' },
      { path: 'server', moduleKey: 'server', icon: listIcon, type: 'link', active: false, selected: false, title: 'Server' },
      { path: 'sources', moduleKey: 'sources', icon: listIcon, type: 'link', active: false, selected: false, title: 'Sources' },
      { path: 'items', moduleKey: 'items', icon: folderIcon, type: 'link', active: false, selected: false, title: 'Items' },
      { path: 'fix-queue', moduleKey: 'items_fix_queue', icon: listIcon, type: 'link', active: false, selected: false, title: 'Fix Queue' },
      { path: 'review-queue', moduleKey: 'items_review_queue', icon: listIcon, type: 'link', active: false, selected: false, title: 'Review Queue' },
      { path: 'items-by-category', moduleKey: 'items_by_category', icon: listIcon, type: 'link', active: false, selected: false, title: 'Items by Category' },
      { path: 'categories', moduleKey: 'categories', icon: folderIcon, type: 'link', active: false, selected: false, title: 'Categories' },
      { path: 'clients', moduleKey: 'clients', icon: usersIcon, type: 'link', active: false, selected: false, title: 'Clients' },
      { path: 'customer-remarks', moduleKey: 'customer_remarks', icon: bellIcon, type: 'link', active: false, selected: false, title: 'Customer Remarks' },
      { path: 'missing-barcodes', moduleKey: 'missing_barcodes', icon: listIcon, type: 'link', active: false, selected: false, title: 'Missing Barcodes' },
      { path: 'source-scanner', moduleKey: 'missing_barcodes', icon: listIcon, type: 'link', active: false, selected: false, title: 'Source Scanner' },
      { path: 'product-submissions', moduleKey: 'missing_barcodes', icon: listIcon, type: 'link', active: false, selected: false, title: 'Product Submissions' },
      { path: 'brand-queue', moduleKey: 'brand_queue', icon: folderIcon, type: 'link', active: false, selected: false, title: 'Brand Queue' },
      { path: 'duplicates', moduleKey: 'duplicates', icon: listIcon, type: 'link', active: false, selected: false, title: 'Duplicates' },
      { path: 'analytics', moduleKey: 'dashboard', icon: dashboardIcon, type: 'link', active: false, selected: false, title: 'Analytics' },
      { path: 'product-attributes', moduleKey: 'items', icon: settingsIcon, type: 'link', active: false, selected: false, title: 'Product Attributes' },
      { path: 'users', moduleKey: 'users', icon: usersIcon, type: 'link', active: false, selected: false, title: 'Users' },
      { path: 'roles', moduleKey: 'roles', icon: usersIcon, type: 'link', active: false, selected: false, title: 'Roles' },
      { path: 'notifications', moduleKey: 'notifications', icon: bellIcon, type: 'link', active: false, selected: false, title: 'Notifications' },
      { path: 'audit-log', moduleKey: 'audit_log', icon: listIcon, type: 'link', active: false, selected: false, title: 'Audit Log' },
      { path: 'settings', moduleKey: 'settings', icon: settingsIcon, type: 'link', active: false, selected: false, title: 'Settings' },
    ],
  },
];

export function getSidebarMenuItems(role?: CmsRole | null) {
  return MENU_ITEMS.map((group) => ({
    ...group,
    Items: group.Items.filter((item) => canAccessModule(role, item.moduleKey)).map((item) => ({ ...item })),
  })).filter((group) => group.Items.length > 0);
}

export default MENU_ITEMS;
