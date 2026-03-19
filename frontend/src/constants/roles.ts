import type { CmsRole } from '../types';

export const CMS_ROLE_LABELS: Record<CmsRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  client: 'Client',
};

export const CMS_ROLE_ORDER: CmsRole[] = ['super_admin', 'admin', 'editor', 'client'];
