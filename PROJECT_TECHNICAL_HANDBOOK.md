# CloudOn Project Technical Handbook

## 1. Purpose
CloudOn is a catalog management platform for pharmacy products. The system currently has four runtime surfaces:

- `Customer Portal`: `https://image.cloudon.gr/`
- `Admin CMS`: `https://image.cloudon.gr/admin/`
- `Customer API`: `https://image.cloudon.gr/api/products`
- `Backend services/jobs`: source refresh, image ingestion, quality gate, source orchestration, XML feed generation, and background catalog jobs

The operating principle is strict separation between:

- `Admin users`: manage catalog, sources, clients, API, quality, review queues, and operational workflows
- `Customer users`: read-only access to active items inside their own assigned scope

## 2. Core Paths

### Application code
- Backend: `/home/imageuser/imageDataAPI/app`
- Frontend source: `/home/imageuser/imageDataAPI/frontend/src`

### Production frontend builds
- Admin build: `/home/imageuser/cms-admin-dist`
- Customer portal build: `/home/imageuser/cms-portal-dist`

### Build entrypoints
- Admin build script: `/home/imageuser/imageDataAPI/build_admin_cms.sh`
- Customer portal build script: `/home/imageuser/imageDataAPI/build_customer_portal.sh`

### Image storage
- Host path: `/home/imageuser/CloudonXMLGenerator/Photos/CloudOn`
- Container path: `/app/images`
- Public path: `https://image.cloudon.gr/photos/<barcode>/<index>.jpg`

## 3. Data Model Principles

### Product activation rules
A product is considered publishable only when the required quality gate is satisfied.

Current logic:
- `active` item: has text, category coverage, and at least one usable hosted image
- `public Image_url`: exposed only when the image is a CloudOn hosted URL
- external image URLs are not exposed to customers through public endpoints unless an API endpoint explicitly allows them

### Category model
The taxonomy model is fixed to three levels:
- `Category_1`
- `Category_2`
- `Category_3`

This model is used consistently in:
- item filters
- item details
- item edit
- customer portal filters
- categories module
- client scope assignment
- API field selection

### Client scope
Each customer sees only what belongs to their assigned scope.

A client may have one of two modes:
- `receive_all_categories = true`
- selected assigned categories only

If a client has no assigned scope and no full-access flag, the customer portal intentionally returns zero visible items and shows a scope warning.

## 4. Source Architecture

### Active source concepts
A source can:
- be enabled or disabled
- be removed from the active chain without deleting already downloaded items
- be restored later
- have separate editable priorities for:
  - general chain order
  - text-source order
  - image-source order

Removing a source does **not** delete items fetched from that source. It only removes the source from future refresh/fetch decisions.

### Current integrated source states
The runtime currently distinguishes between production sources, manual-only sources, and blocked/unstable sources.

Production-relevant examples:
- `farmakopoiosmou`: primary text/metadata source, image intake disabled
- `pharmacy295`: preferred clean photo source when feed coverage exists, live site access still `proxy_required`
- `kpdhellas`: enabled in the live chain at low text priority, image priority disabled by default because gallery extraction is not yet reliable enough for automatic use

Manual-only or validation-stage sources:
- `youpharmacy`: WooCommerce source with live manual refresh support plus XML photo-import job
- `gohealthy`: manual-refresh candidate wired on the `search-results?search=<barcode>` pattern
- `cure4u`: manual-refresh candidate wired on the PrestaShop `ambjolisearch` endpoint

Disabled or constrained sources:
- `vita4you`: disabled in the live chain, marked `unstable`
- `tofarmakeiomou`: search path is known, but live server-side access is `proxy_required` because of Cloudflare challenge pages
- `skroutz`: parser exists, not part of the active live chain
- `boxpharmacy`, `pharm16`: disabled because live access is unstable or blocked

### Source jobs
Sources may expose operational jobs in the admin, for example:
- photo import
- Excel feed import
- XML feed upload/import
- source-specific backfill

Job state is persisted and shown in the admin as:
- `running`
- `completed`
- `failed`
- `idle`

Operational rules:
- a source job must show `running` only while its real process is still alive
- if the process is gone after a restart or unexpected stop, stale `running` state must be cleared automatically on the next overview load
- `pharmacy295` photo import is driven by the Excel feed and can update only barcodes that actually exist in that feed
- `youpharmacy` is exposed as a job-only feed source for XML upload plus XML-driven photo replacement
- the admin `Managed Sources` view groups dense metadata into compact cards/summary blocks instead of wide unreadable tables

### Manual source selection model
Item-level and bulk refresh now support independent source selection by channel:
- `shared source`
- `text source`
- `image source`
- `category source`

Rules:
- `shared source` is a convenience override for all fields
- more specific selectors override the shared source for their own channel
- disabled sources or sources with `Text = 0` / `Images = 0` must be skipped completely for that purpose
- manual refresh can still explicitly target validation-stage sources such as `YouPharmacy`, `GoHealthy`, `Cure4u`, `KpdHellas`, and `Vita4You`

## 5. Image and Media Rules

### Multiple images per item
Images are stored per barcode directory:
- `/CloudOn/<barcode>/1.jpg`
- `/CloudOn/<barcode>/2.jpg`
- etc.

### Watermark handling
Historical watermark cleanup has been applied for the main affected source sets.

Current runtime rule:
- watermark cleanup is not always-on
- it is controlled from the admin `Settings -> Image Processing`
- when disabled, new image downloads and hosted-image reprocess jobs must not run the legacy `farmakopoiosmou` watermark remover
- when enabled, the cleanup is allowed only for `farmakopoiosmou` image intake paths that are still enabled in source settings

Operational guidance:
- keep watermark cleanup disabled when clean image sources such as `pharmacy295`, `youpharmacy`, `gohealthy`, or `cure4u` are preferred
- enable it only when intentionally accepting `farmakopoiosmou` image downloads or when running a legacy hosted-image cleanup pass

### Trusted source lock rule
If an image is imported from a trusted source, it can be locked so that it is not overwritten later by lower-quality refreshes.

Current trusted lock examples:
- `pharmacy295_excel`
- `youpharmacy_xml`

The `youpharmacy_xml` rule is used by the backend script `replace_farmakopoiosmou_with_youpharmacy_xml.py`:
- the script consumes a provided `youpharmacy` XML file
- matches by `ean` first and numeric `mpn` fallback
- downloads the clean source image
- replaces current hosted images only when the active provenance is still `farmakopoiosmou`
- locks the resulting hosted image set so later lower-quality refreshes do not overwrite it

### Manual source refresh image rule
Manual `Refresh From Sources` must not blindly trust all image URLs returned by a source.

Current rule set:
- source text and source images are resolved through separate source chains
- non-product assets such as icons, logos, favicons, placeholders, banners, and theme images are rejected
- `farmakopoiosmou` is no longer allowed to contribute image URLs to refreshed items; it is used for text and metadata only
- cached source results are invalidated before a manual refresh so that bad old image lists do not keep returning
- hosted images are downloaded as part of the same refresh action
- if a clean image source returns a valid hosted set, the existing barcode folder is replaced atomically so old images from previous sources do not remain mixed in
- if no clean image source returns a valid hosted set, the refresh must not inject dirty raw external URLs and must not misrepresent an older hosted file as the fresh result
- admin-facing hosted image URLs are versioned from file mtime so the editor sees the newly written file instead of a cached browser copy
- admin edit and details views expose only hosted/public item images, not raw external source URLs
- if a trusted stored snapshot exists in `Other_Sites`, manual refresh may reuse that stored snapshot when live lookup fails
- if a stored source snapshot points to an old source-local image path but the system cannot write a new hosted set for the current refresh, the draft image state must stay empty rather than reuse stale hosted files
- if `tofarmakeiomou` contributes only a stored snapshot and the current image download fails, it may still supply text but must not be counted as a successful fresh image hit
- proxy-required sources must skip live network fetch when no effective proxy is configured, but trusted stored snapshots may still be tried first
- `vita4you`, if re-enabled later, must use the canonical localized search path plus direct Klevu JSON fallback and keep strict matching/shorter timeouts

### Manual media fallback
The item editor also supports operator-driven media intake when source refresh is insufficient.

Supported operator paths:
- local file upload (`png`, `jpeg`, `webp`)
- remote import from direct image URL
- remote import from product/source page URL with automatic best-image extraction
- Google Images as a discovery helper only

Rules:
- Google results URLs are **not** accepted as direct import URLs
- the operator must paste either the direct origin image URL or the origin product-page URL
- local upload can replace the current hosted set
- local upload can force the first uploaded file to become the main image

### Provenance and activation diagnostics
Item edit/detail surfaces now expose media and quality diagnostics, including:
- quality state
- public API image visibility
- text completion
- category completion
- image-source completion
- photo provenance / lock source

These fields are used by admin review and are not cosmetic-only badges.

## 6. API Surfaces

### Customer API
Default endpoints:
- `POST https://image.cloudon.gr/api/products`
- `POST https://image.cloudon.gr/api/products_internal`

Rules:
- `/products` is intended for public/customer-safe output
- `/products_internal` may include internal fields and non-public image behavior when explicitly allowed
- hosted image URLs remain the default safe output mode

### Runtime-configured custom endpoints
The backend also exposes:
- `POST /api/products/{endpoint_key}`

Each custom endpoint is real runtime behavior, not a UI-only label.

Admin `Settings -> API Access` can create and manage endpoints with:
- endpoint key
- label
- enabled/disabled state
- public-only vs internal access mode
- include internal fields
- allow external image URLs
- enabled field list

Endpoint rules:
- built-in keys `products` and `products_internal` keep their direct paths
- all other keys resolve to `/products/<api_key>`
- save applies immediately to new requests
- API client usage tracking stores the last endpoint used by each client

### Field registry
API field output is driven by a central registry in runtime settings.

Current behavior:
- admins edit endpoint-specific fields from the endpoint `Edit` panel
- the edit panel shows all available fields from the registry
- field labels are human-readable for operators, while stored field keys remain stable in runtime settings

### Portal API
Portal backend routes live under:
- `/portal/*`

Examples:
- `/portal/auth/login`
- `/portal/dashboard/overview`
- `/portal/items`
- `/portal/items/{id}`
- `/portal/comments`

### Admin API
Admin backend routes live under:
- `/cms/*`

Examples:
- `/cms/catalog/*`
- `/cms/clients/*`
- `/cms/sources/*`
- `/cms/settings/*`
- `/cms/header/events`

## 7. Permissions and Roles

### Admin roles
Current role model:
- `super_admin`
- `admin`
- `editor`
- `client`

Permission format:
- `module.action`

Examples:
- `items.view`
- `items.update`
- `clients.view`
- `sources.view`
- `settings.update`

### Customer role
Customer permissions are intentionally minimal:
- login
- dashboard view
- item list view
- item detail view
- filter/search
- submit remarks/comments

Customers cannot:
- create items
- edit items
- delete items
- change status
- manage users
- manage categories

## 8. Admin and Portal UI Rules

### Placeholder policy
Runtime UI must not ship template placeholders.

This includes removal or replacement of:
- fake user names
- fake job titles
- fake message dropdowns
- non-working profile actions
- template demo branding where CloudOn branding exists
- fake language assets when real flags/language switching is available

### Runtime cleanup rule
Template code may remain on disk for reference, but it must not stay connected to live admin or portal routes unless it is explicitly adopted as product behavior.

This applies especially to:
- demo switchers
- template settings drawers
- placeholder error-page shells
- placeholder profile menus
- placeholder language assets
- template-only localStorage keys

Post-build rule:
- active runtime bundles must be scanned for `Azea`, `Spruko`, `Patrenna`, and `Web Designer`
- if any of these appear in the deployed admin or portal bundles, the import chain must be removed before release

### Admin shell
The admin shell must use:
- CloudOn logo and CloudOn ContentSync Platform branding
- live profile actions
- real system events in the bell dropdown
- only `English` and `Greek` in the language selector
- no fake template message center
- translated runtime menu/search/header labels for the selected language

### Customer portal shell
The customer portal must use:
- CloudOn logo and branded login shell
- live profile/logout actions
- only `English` and `Greek`
- default language priority `English` unless the browser already stored `Greek`
- read-only item detail presentation with real product media, rendered HTML description, and real remarks

### System events routing
Header notification/event entries must route directly to the relevant runtime target.

Current rules:
- item audit/notification events route to `/items?focus=<item_id>`
- API client events route to `/clients`
- generic notification/audit fallback routes stay module-specific instead of linking to dead template pages

### List-page metrics
Operational list pages in admin and portal should expose compact metrics in the hero area:
- filtered records
- active filters
- current page / pagination state

These metrics are part of the workflow and should stay synchronized with the active filters.

## 9. Customer Portal Architecture

### Portal shell
Customer portal is a dedicated frontend shell, separate from admin.

Core pages:
- Dashboard
- All Items
- New Items
- Categories
- My Remarks
- Profile

### Customer portal rules
- read-only data presentation
- comments are the only allowed intervention path
- only active items in assigned scope are visible
- detail pages render `cms_description_html` when available and fall back to plain text converted to HTML

## 10. Admin Workflows

### Catalog quality management
Admin can identify products requiring work by using the item quality filters:
- needs fix
- missing text
- missing category
- missing public image

### Review queue and go-live
Inactive items that become structurally complete are staged in a temporary review list:
- `Ready for Review`
- visible in the dedicated `Review Queue`
- final publication happens through explicit `Approve Go Live`

### Item edit workflow
The item editor now combines:
- direct field editing
- HTML description editing with live preview
- source-refresh overrides by channel
- hosted image gallery management
- manual local image upload
- manual remote image import
- activation/provenance diagnostics

### Bulk source refresh workflow
The Fix Queue can trigger a server-side background bulk refresh against the currently filtered dataset.

Rules:
- the job uses the current filters and an explicit processing limit
- optional source overrides can be set for shared/text/image/category channels
- progress is persisted server-side and polled by the UI
- the operator does **not** need to keep the page open; closing the browser does not stop the background job
- the UI must expose progress, updated/skipped/failed counts, and the last processed barcode
- the operator can issue `stop`, `cancel`, and `restart` commands from the UI

### Customer feedback workflow
Customer remarks are collected separately and can be reviewed by admin in a dedicated remarks queue.

### Source control workflow
Admin can:
- enable/disable source usage
- remove/restore sources from the active chain
- launch source jobs
- upload XML input files for job-only sources
- configure proxy settings

## 11. Settings

Admin settings currently include operational controls such as:
- proxy configuration
- API access switches
- API endpoint registry and field output selection
- API client enable/disable
- mail account settings
- image processing runtime toggles
- XML service configuration and manual XML feed generation
- activation policy visibility

### API Access
The API settings surface is now an endpoint designer, not only two legacy toggles.

Operators can:
- add a new API endpoint
- edit an existing endpoint
- choose public-only vs internal behavior
- toggle inclusion of internal fields
- allow or deny external image URLs
- select the exact output fields for each endpoint from the available field registry

### XML Service
The `XML Service` card controls the internal XML generator container used for marketplace XML feeds.

Operational UI rules:
- `Published XML Files` must separate current published files from archived `backup/old` files
- current published XML files must expose direct `Download` actions
- when no successful latest-run file metadata exists, non-archived filenames such as `skroutz.xml`, `bestprice.xml`, and `shopflix.xml` must still be treated as the current downloadable set

## 12. Translation Policy

Current target language policy:
- supported languages: `English`, `Greek`
- both admin and portal remember the selected language in localStorage
- default fallback language is `English`

Runtime rule:
- mixed-language visible shells are defects unless the untranslated token is a deliberate product/API term
- menu labels, hero cards, filters, statuses, and header actions must respect the selected language

## 13. Deployment Notes

### Frontend builds
Portal build script:
- `/home/imageuser/imageDataAPI/build_customer_portal.sh`

Admin build script:
- `/home/imageuser/imageDataAPI/build_admin_cms.sh`

Deploy targets:
- `/home/imageuser/cms-portal-dist`
- `/home/imageuser/cms-admin-dist`

### Runtime XML service
- docker service name: `xml_generator`
- build context: `/home/imageuser/CloudonXMLGeneratorNew`
- public XML route proxied by the main backend: `/api/xml_generator/{domain}/{marketplace_xml}`

### Build hygiene
- build scripts must compile from the repo-local frontend source at `/home/imageuser/imageDataAPI/frontend`
- deployed shells must use CloudOn branding and must not regress to template/demo assets

## 14. Documentation Change Rule

For every project change that affects runtime behavior, UI, workflows, permissions, source handling, or customer/admin operations, documentation must be updated as part of the same change.

Default requirement:
- update the technical handbook
- update the relevant user manual(s)
- do not treat documentation as optional follow-up work

This is a standard operating rule for the project.
