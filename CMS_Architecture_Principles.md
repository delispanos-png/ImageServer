# CMS Architecture Principles

## Purpose
This document defines the architecture rules for the CMS platform.

These rules are not optional style preferences. They are the baseline for all
next implementation work across backend, frontend, data model, and UI flows.

## Core Principles

### 1. Clean Architecture
- Business rules must stay separate from delivery concerns.
- HTTP routes should remain thin.
- Validation, mapping, and domain logic should not be buried inside UI
  components or scattered across route handlers.
- Side effects such as audit writes, notification event creation, and image
  processing should be explicit and traceable.

### 2. Modular Design
- Each business area must remain isolated by module.
- Current CMS modules:
  - `auth`
  - `dashboard`
  - `items`
  - `categories`
  - `clients`
  - `users`
  - `roles`
  - `audit`
  - `notifications`
- A module owns:
  - routes
  - service calls
  - page components
  - local UI state
  - module-specific types where needed
- Cross-module coupling must be intentional and minimal.

### 3. Scalable Database
- Data structures must support growth in record count, filters, and event
  history.
- Category filtering, item search, audit lookup, and notification lookup must
  be queryable without forcing the frontend to reconstruct business logic.
- Event and change history must be append-oriented, not overwritten.

### 4. Reusable Components
- Repeated UI patterns must be extracted into reusable components or stable
  composition patterns.
- Reuse should favor:
  - filter rows
  - list headers
  - detail cards
  - modal forms
  - status badges
  - loading, empty, and error states
- Reuse must not come at the cost of unclear abstractions.

### 5. Maintainable Code
- Prefer explicit data contracts over hidden assumptions.
- Prefer small helpers with clear responsibility over large mixed functions.
- Keep naming aligned between backend and frontend.
- Avoid magic fallback behavior when the business model is known.
- When a rule is important to the domain, encode it directly in the model.

## Domain Rules

### 1. Category Model
The product taxonomy is treated as a fixed 3-level business model:
- `Category_1`
- `Category_2`
- `Category_3`

This rule applies everywhere:
- item list filters
- item details
- item edit
- category listing
- category create/edit flows
- notification targeting
- client category subscriptions

We do not treat category display as a single combined string unless the UI
needs a readable label. The source model remains 3 explicit levels.

### 2. Item Editing
An item edit flow must allow operators to correct bad upstream data.

That means edit screens should support:
- title
- code
- sku
- barcode
- brand
- unit
- status
- HTML description
- category assignment using the 3-level taxonomy model
- main image correction or replacement when image editing is enabled

### 3. HTML Content
Product content should be stored and rendered in structured HTML form when used
inside the CMS.

Rules:
- HTML must be sanitized on write.
- Plain text may still exist as compatibility fallback.
- The editor should help operators transform raw text into structured content.

### 4. Auditability
All important write operations must be explainable later.

At minimum:
- item create
- item update
- category create
- category update
- client create
- client update
- login
- logout
- notification publish

## Backend Rules

### 1. Route Layer
- Route handlers should validate input, call domain logic, and return stable
  response shapes.
- Route handlers should not become the main place where business rules live.

### 2. Response Contracts
- Backend responses must expose explicit fields used by the UI.
- If the UI needs `category_1`, `category_2`, `category_3`, the backend must
  return those fields directly.
- The frontend should not have to reconstruct core domain fields from weak
  string parsing.

### 3. Sync and Derived Data
- If CMS projection tables depend on source product data, the sync rule must be
  explicit and repeatable.
- If taxonomy is derived from `products`, that relationship must be encoded in
  code and documented, not assumed implicitly.

## Frontend Rules

### 1. Module Boundaries
- Pages should live under their business module entrypoints.
- Services should encapsulate API calls.
- Shared types must remain in `src/types`.

### 2. List Behavior
All list pages should follow one consistent behavior model:
- search
- filters
- sorting
- pagination
- status filtering where relevant

When a domain has structured filters, the UI must expose them in structured
form. For product categories, that means 3 separate category selectors.

### 3. Detail and Edit Consistency
- The edit experience should follow the same mental model as the view
  experience.
- Operators should not see one data structure in details and a different one in
  edit.
- Detail and edit should use the same category model, same image model, and the
  same field naming.

### 4. UI States
Every module page should support:
- loading state
- empty state
- success state
- error state
- confirmation flow for destructive or important actions

## Implementation Rules Going Forward

### 1. No New Work on Top of Broken Contracts
Before opening a new feature area:
- verify the existing page uses the intended backend contract
- verify the bundle deployed to `/admin/` matches the source code
- verify the database contains the expected projection data

### 2. Fix Root Cause, Not Only Surface UI
If a page shows empty data:
- check live API response
- check database state
- check projection/sync tables
- then patch the UI only if the contract is correct

### 3. Prefer Migration and Sync Over Ad-Hoc UI Patching
When source data needs to appear in CMS-specific structures:
- write a repeatable sync path
- avoid one-off manual data assumptions in components

## Current Architectural Direction

### Backend
- FastAPI for delivery layer
- MongoDB-backed CMS projection logic for current operational state
- explicit CMS routers by module

### Frontend
- React + TypeScript application shell under `/admin/`
- module-based services and pages
- shared route map
- permission-gated module access

### Data Model Direction
- continue current Mongo operational model for active delivery work
- keep relational schema design as the normalized target architecture for
  longer-term stabilization and reporting

## Definition of Done for Future Work
A module is not considered done when only the route exists or only the page
renders.

A module is done only when:
- the data contract is stable
- the page is usable
- filters match the domain model
- create/edit/view flows use the same business structure
- UI states exist
- audit/perms are respected where applicable

