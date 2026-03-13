INSERT INTO roles (name, slug, description)
VALUES
    ('Super Admin', 'super_admin', 'Full system access'),
    ('Admin', 'admin', 'Manage items, categories, clients, and notifications'),
    ('Editor', 'editor', 'Edit items, view categories, create updates'),
    ('Client', 'client', 'View allowed updates')
ON CONFLICT (slug) DO UPDATE
SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO permissions (code, module, action)
VALUES
    ('dashboard.view', 'dashboard', 'view'),
    ('items.view', 'items', 'view'),
    ('items.create', 'items', 'create'),
    ('items.update', 'items', 'update'),
    ('items.delete', 'items', 'delete'),
    ('categories.view', 'categories', 'view'),
    ('categories.create', 'categories', 'create'),
    ('categories.update', 'categories', 'update'),
    ('categories.delete', 'categories', 'delete'),
    ('clients.view', 'clients', 'view'),
    ('clients.create', 'clients', 'create'),
    ('clients.update', 'clients', 'update'),
    ('clients.delete', 'clients', 'delete'),
    ('users.view', 'users', 'view'),
    ('users.create', 'users', 'create'),
    ('users.update', 'users', 'update'),
    ('users.delete', 'users', 'delete'),
    ('roles.view', 'roles', 'view'),
    ('roles.create', 'roles', 'create'),
    ('roles.update', 'roles', 'update'),
    ('roles.delete', 'roles', 'delete'),
    ('notifications.view', 'notifications', 'view'),
    ('notifications.publish', 'notifications', 'publish'),
    ('audit.view', 'audit', 'view'),
    ('settings.view', 'settings', 'view'),
    ('settings.update', 'settings', 'update')
ON CONFLICT (code) DO UPDATE
SET
    module = EXCLUDED.module,
    action = EXCLUDED.action;

WITH role_perm(role_slug, perm_code) AS (
    VALUES
        ('admin', 'dashboard.view'),
        ('admin', 'items.view'),
        ('admin', 'items.create'),
        ('admin', 'items.update'),
        ('admin', 'items.delete'),
        ('admin', 'categories.view'),
        ('admin', 'categories.create'),
        ('admin', 'categories.update'),
        ('admin', 'categories.delete'),
        ('admin', 'clients.view'),
        ('admin', 'clients.create'),
        ('admin', 'clients.update'),
        ('admin', 'clients.delete'),
        ('admin', 'notifications.view'),
        ('admin', 'notifications.publish'),
        ('admin', 'settings.view'),
        ('admin', 'settings.update'),

        ('editor', 'dashboard.view'),
        ('editor', 'items.view'),
        ('editor', 'items.update'),
        ('editor', 'categories.view'),
        ('editor', 'notifications.view'),
        ('editor', 'notifications.publish'),
        ('editor', 'settings.view'),

        ('client', 'dashboard.view'),
        ('client', 'notifications.view'),
        ('client', 'settings.view')
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM role_perm rp
JOIN roles r ON r.slug = rp.role_slug
JOIN permissions p ON p.code = rp.perm_code
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.slug = 'super_admin'
ON CONFLICT DO NOTHING;
