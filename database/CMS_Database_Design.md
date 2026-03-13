# CMS Database Design

## Scope
Normalized relational schema for the CMS platform covering:
- authentication and access control
- products and categories
- clients and category subscriptions
- item change tracking
- notification events
- audit logging

Assumption: PostgreSQL 15+.

## Design Principles
- Integer primary keys generated as `bigserial`
- Unique human-facing identifiers where needed (`email`, `slug`, `code`, `barcode`)
- Foreign keys with explicit delete behavior
- JSONB reserved for flexible payloads (`notification_events.payload`, `audit_logs.metadata`)
- Timestamps stored as `timestamptz`
- Soft-activity flags (`is_active`) used where operationally useful
- Business history stored append-only for `item_changes`, `notification_events`, `audit_logs`

## Core Tables

### 1. users
Purpose: CMS operators and client users.

Fields:
- `id`
- `name`
- `email`
- `password_hash`
- `role_id`
- `is_active`
- `last_login_at`
- `created_at`
- `updated_at`

Notes:
- `email` unique
- each user belongs to one role
- client-facing users can also use this table if needed later

### 2. roles
Purpose: role catalog.

Fields:
- `id`
- `name`
- `slug`
- `description`
- `created_at`
- `updated_at`

Initial rows:
- Super Admin
- Admin
- Editor
- Client

### 3. permissions
Purpose: permission catalog with `module.action` model.

Fields:
- `id`
- `code`
- `module`
- `action`

Examples:
- `items.view`
- `items.create`
- `items.update`
- `items.delete`
- `notifications.publish`
- `audit.view`

### 4. role_permissions
Purpose: normalized many-to-many mapping between roles and permissions.

Fields:
- `role_id`
- `permission_id`

Reason:
- required to support the permission model properly in relational form
- avoids encoding permissions directly inside the roles table

### 5. categories
Purpose: hierarchical item taxonomy.

Fields:
- `id`
- `parent_id`
- `name`
- `slug`
- `description`
- `is_active`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`

Notes:
- `parent_id` self-references `categories.id`
- root categories have `parent_id = null`
- category nesting supports 3-level model but schema does not hard-limit depth

### 6. items
Purpose: CMS canonical product record.

Fields:
- `id`
- `category_id`
- `title`
- `slug`
- `code`
- `sku`
- `barcode`
- `description`
- `brand`
- `unit`
- `status`
- `main_image`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`

Status enum values:
- `active`
- `inactive`

Notes:
- `barcode` should be unique when present
- `code` and `sku` are nullable but indexed for operational search
- `main_image` stores the hosted canonical image URL/path

### 7. clients
Purpose: organizations or customers receiving product notifications.

Fields:
- `id`
- `name`
- `email`
- `phone`
- `company`
- `is_active`
- `receive_all_categories`
- `notes`
- `created_at`
- `updated_at`

Notes:
- `receive_all_categories = true` means category subscriptions are bypassed

### 8. client_categories
Purpose: client subscription mapping to categories.

Fields:
- `client_id`
- `category_id`

Notes:
- composite primary key
- only used when `receive_all_categories = false`

### 9. item_changes
Purpose: immutable field-level item history.

Fields:
- `id`
- `item_id`
- `change_type`
- `field_name`
- `old_value`
- `new_value`
- `changed_by`
- `created_at`

Examples for `change_type`:
- `create`
- `update`
- `delete`
- `status_change`
- `bulk_update`

Notes:
- `old_value` and `new_value` stored as text for auditability
- can later evolve to JSONB if structured diffs are needed

### 10. notification_events
Purpose: queue/history of client-facing notification-worthy changes.

Fields:
- `id`
- `item_id`
- `category_id`
- `event_type`
- `payload`
- `created_at`
- `published_at`

Examples for `event_type`:
- `item_created`
- `item_updated`
- `item_reactivated`
- `category_changed`

Notes:
- `payload` stored as JSONB to keep the exact event snapshot
- `published_at = null` means pending / not yet published

### 11. audit_logs
Purpose: broad system audit trail beyond item field changes.

Fields:
- `id`
- `user_id`
- `entity_type`
- `entity_id`
- `action`
- `metadata`
- `created_at`

Examples:
- user login/logout
- role updates
- permission changes
- client subscription updates
- manual publish actions

Notes:
- `metadata` stored as JSONB
- `entity_id` left as bigint to support all core entity tables

## Supporting Tables
These are not in the original phase list, but they are required for a production-ready auth flow.

### 12. user_sessions
Purpose: active session storage.

Fields:
- `id`
- `user_id`
- `session_token`
- `ip_address`
- `user_agent`
- `expires_at`
- `created_at`
- `revoked_at`

### 13. password_reset_tokens
Purpose: forgot/reset password flow.

Fields:
- `id`
- `user_id`
- `token_hash`
- `expires_at`
- `used_at`
- `created_at`

## Key Constraints
- `users.email` unique
- `roles.slug` unique
- `permissions.code` unique
- `categories.slug` unique
- `items.slug` unique
- `items.barcode` unique when not null
- `clients.email` unique when not null
- `client_categories (client_id, category_id)` primary key
- `role_permissions (role_id, permission_id)` primary key

## Recommended Indexes
- `users(role_id, is_active)`
- `categories(parent_id, is_active)`
- `items(category_id, status)`
- `items(barcode)`
- `items(code)`
- `items(sku)`
- `item_changes(item_id, created_at desc)`
- `notification_events(published_at, created_at)`
- `audit_logs(user_id, created_at desc)`
- `audit_logs(entity_type, entity_id, created_at desc)`
- `user_sessions(session_token)` unique
- `password_reset_tokens(token_hash)` unique

## Relationship Summary
- `users.role_id -> roles.id`
- `role_permissions.role_id -> roles.id`
- `role_permissions.permission_id -> permissions.id`
- `categories.parent_id -> categories.id`
- `categories.created_by -> users.id`
- `categories.updated_by -> users.id`
- `items.category_id -> categories.id`
- `items.created_by -> users.id`
- `items.updated_by -> users.id`
- `client_categories.client_id -> clients.id`
- `client_categories.category_id -> categories.id`
- `item_changes.item_id -> items.id`
- `item_changes.changed_by -> users.id`
- `notification_events.item_id -> items.id`
- `notification_events.category_id -> categories.id`
- `audit_logs.user_id -> users.id`
- `user_sessions.user_id -> users.id`
- `password_reset_tokens.user_id -> users.id`

## Recommended Implementation Order
1. `roles`
2. `permissions`
3. `role_permissions`
4. `users`
5. `categories`
6. `items`
7. `clients`
8. `client_categories`
9. `item_changes`
10. `notification_events`
11. `audit_logs`
12. `user_sessions`
13. `password_reset_tokens`

## Migration Strategy from Current System
Current backend is Mongo-oriented. Recommended migration path:
1. Stand up relational schema in PostgreSQL.
2. Keep existing product ingestion pipeline unchanged temporarily.
3. Build CMS backend against PostgreSQL for auth/users/roles/categories/items management.
4. Add ETL jobs from Mongo product records into relational `items` and `categories`.
5. Switch CMS writes to relational DB only.
6. Gradually move notification/audit logic to relational layer.

## Deliverables in this folder
- `cms_schema_postgres.sql`
- `cms_seed_postgres.sql`
- this design document
