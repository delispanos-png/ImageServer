import { cmsRoutes } from '../../app/routes/routeMap';
import { CMS_ROLE_LABELS } from '../../constants/roles';
import type { CmsModuleKey, CmsPermission, CmsRole } from '../../types';

export interface RoleDefinition {
  role: CmsRole;
  label: string;
  responsibilities: string[];
}

const PERMISSIONS_BY_ROLE: Record<CmsRole, CmsPermission[]> = {
  super_admin: [
    'dashboard.view',
    'server.view',
    'sources.view',
    'sources.update',
    'sources.run',
    'items.view',
    'items.create',
    'items.update',
    'items.delete',
    'categories.view',
    'categories.create',
    'categories.update',
    'categories.delete',
    'clients.view',
    'clients.create',
    'clients.update',
    'clients.delete',
    'missing_barcodes.view',
    'missing_barcodes.update',
    'brand_queue.view',
    'brand_queue.update',
    'duplicates.view',
    'duplicates.update',
    'users.view',
    'users.create',
    'users.update',
    'users.delete',
    'roles.view',
    'roles.create',
    'roles.update',
    'roles.delete',
    'notifications.view',
    'notifications.publish',
    'audit.view',
    'settings.view',
    'settings.update',
  ],
  admin: [
    'dashboard.view',
    'server.view',
    'sources.view',
    'sources.update',
    'sources.run',
    'items.view',
    'items.create',
    'items.update',
    'items.delete',
    'categories.view',
    'categories.create',
    'categories.update',
    'categories.delete',
    'clients.view',
    'clients.create',
    'clients.update',
    'clients.delete',
    'missing_barcodes.view',
    'missing_barcodes.update',
    'brand_queue.view',
    'brand_queue.update',
    'duplicates.view',
    'duplicates.update',
    'notifications.view',
    'notifications.publish',
    'settings.view',
    'settings.update',
  ],
  editor: [
    'dashboard.view',
    'sources.view',
    'items.view',
    'items.update',
    'missing_barcodes.view',
    'missing_barcodes.update',
    'brand_queue.view',
    'brand_queue.update',
    'duplicates.view',
    'duplicates.update',
    'categories.view',
    'notifications.view',
    'notifications.publish',
    'settings.view',
  ],
  client: ['dashboard.view', 'notifications.view', 'settings.view'],
};

const MODULE_PERMISSION_PREFIX: Record<CmsModuleKey, string> = {
  dashboard: 'dashboard.',
  server: 'server.',
  sources: 'sources.',
  items: 'items.',
  items_fix_queue: 'items.',
  items_review_queue: 'items.',
  items_by_category: 'categories.',
  categories: 'categories.',
  clients: 'clients.',
  customer_remarks: 'clients.',
  missing_barcodes: 'missing_barcodes.',
  brand_queue: 'brand_queue.',
  duplicates: 'duplicates.',
  users: 'users.',
  roles: 'roles.',
  notifications: 'notifications.',
  audit_log: 'audit.',
  settings: 'settings.',
};

export const CMS_ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: 'super_admin',
    label: CMS_ROLE_LABELS.super_admin,
    responsibilities: ['Full system access'],
  },
  {
    role: 'admin',
    label: CMS_ROLE_LABELS.admin,
    responsibilities: ['Manage items', 'Manage categories', 'Manage clients', 'Manage notifications'],
  },
  {
    role: 'editor',
    label: CMS_ROLE_LABELS.editor,
    responsibilities: ['Edit items', 'View categories', 'Create updates'],
  },
  {
    role: 'client',
    label: CMS_ROLE_LABELS.client,
    responsibilities: ['View allowed updates'],
  },
];

export function normalizeCmsRole(role?: string | null): CmsRole {
  switch ((role || '').toLowerCase()) {
    case 'super_admin':
    case 'super admin':
      return 'super_admin';
    case 'admin':
      return 'admin';
    case 'editor':
      return 'editor';
    case 'client':
      return 'client';
    default:
      return 'client';
  }
}

export function getPermissionsForRole(role?: string | null): CmsPermission[] {
  return PERMISSIONS_BY_ROLE[normalizeCmsRole(role)];
}

export function hasPermission(role: string | null | undefined, permission: CmsPermission): boolean {
  const normalizedRole = normalizeCmsRole(role);
  if (normalizedRole === 'super_admin') {
    return true;
  }
  return getPermissionsForRole(role).includes(permission);
}

export function canAccessModule(role: string | null | undefined, moduleKey: CmsModuleKey): boolean {
  const modulePrefix = MODULE_PERMISSION_PREFIX[moduleKey];
  return getPermissionsForRole(role).some((permission) => permission.startsWith(modulePrefix));
}

export function getAllowedModules(role: string | null | undefined): CmsModuleKey[] {
  return (Object.keys(MODULE_PERMISSION_PREFIX) as CmsModuleKey[]).filter((moduleKey) =>
    canAccessModule(role, moduleKey),
  );
}

export function getAccessibleRoutes(role: string | null | undefined): string[] {
  const allowedModules = new Set(getAllowedModules(role));
  const routes: string[] = [];

  if (allowedModules.has('dashboard')) routes.push(cmsRoutes.dashboard);
  if (allowedModules.has('server')) routes.push(cmsRoutes.server);
  if (allowedModules.has('sources')) routes.push(cmsRoutes.sources);
  if (allowedModules.has('items')) routes.push(cmsRoutes.items);
  if (allowedModules.has('items_fix_queue')) routes.push(cmsRoutes.itemsFixQueue);
  if (allowedModules.has('items_review_queue')) routes.push(cmsRoutes.itemsReviewQueue);
  if (allowedModules.has('items_by_category')) routes.push(cmsRoutes.itemsByCategory);
  if (allowedModules.has('categories')) routes.push(cmsRoutes.categories);
  if (allowedModules.has('clients')) routes.push(cmsRoutes.clients);
  if (allowedModules.has('customer_remarks')) routes.push(cmsRoutes.customerRemarks);
  if (allowedModules.has('missing_barcodes')) routes.push(cmsRoutes.missingBarcodes);
  if (allowedModules.has('brand_queue')) routes.push(cmsRoutes.brandQueue);
  if (allowedModules.has('duplicates')) routes.push(cmsRoutes.duplicates);
  if (allowedModules.has('users')) routes.push(cmsRoutes.users);
  if (allowedModules.has('roles')) routes.push(cmsRoutes.roles);
  if (allowedModules.has('notifications')) routes.push(cmsRoutes.notifications);
  if (allowedModules.has('audit_log')) routes.push(cmsRoutes.auditLog);
  if (allowedModules.has('settings')) routes.push(cmsRoutes.settings);

  return routes;
}
