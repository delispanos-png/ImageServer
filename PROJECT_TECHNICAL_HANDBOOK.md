# CloudOn Project Technical Handbook

## 1. Purpose
CloudOn is a catalog management platform for pharmacy products. The system currently has four runtime surfaces:

- `Customer Portal`: `https://image.cloudon.gr/`
- `Admin CMS`: `https://image.cloudon.gr/admin/`
- `Customer API`: `https://image.cloudon.gr/api/products`
- `Backend services/jobs`: source refresh, image ingestion, quality gate, source orchestration, and XML feed generation

The operating principle is strict separation between:

- `Admin users`: manage catalog, sources, clients, API, quality, and workflows
- `Customer users`: read-only access to active items inside their own assigned scope

## 2. Core Paths

### Application code
- Backend: `/home/imageuser/imageDataAPI/app`
- Frontend source: `/home/imageuser/imageDataAPI/frontend/src`

### Production frontend builds
- Admin build: `/home/imageuser/cms-admin-dist`
- Customer portal build: `/home/imageuser/cms-portal-dist`

### Image storage
- Host path: `/home/imageuser/CloudonXMLGenerator/Photos/CloudOn`
- Container path: `/app/images`
- Public path: `https://image.cloudon.gr/photos/<barcode>/<index>.jpg`

## 3. Data Model Principles

### Product activation rules
A product is considered publishable only when the required quality gate is satisfied.

Current logic:
- `active` item: has text, category coverage, and at least one image source
- `public Image_url`: exposed only when the image is a CloudOn hosted URL
- external image URLs are not exposed to customers through `/api/products`

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

### Client scope
Each customer sees only what belongs to their assigned scope.

A client may have one of two modes:
- `receive_all_categories = true`
- selected assigned categories only

If a client has no assigned scope and no full-access flag, the customer portal intentionally returns zero visible items.

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

### Known sources in the system
Examples already integrated:
- `farmakopoiosmou`
- `pharmacy295`
- `vita4you`
- `skroutz`
- candidate/disabled domains such as `boxpharmacy`, `tofarmakeiomou`, `pharm16`

### Source jobs
Sources may expose operational jobs in the admin, for example:
- photo import
- Excel feed import
- source-specific backfill

Job state is persisted and shown in the admin as:
- `running`
- `completed`
- `failed`

Operational rule:
- a source job must show `running` in admin only while its real process is still alive
- if the process is gone after a container restart or unexpected stop, the stale `running` state must be cleared automatically on the next overview load
- `pharmacy295` photo import is driven by the Excel feed and can update only barcodes that actually exist in that feed
- the admin `Managed Sources` view must group dense metadata into compact summary columns instead of expanding the table into many narrow columns that break readability

Source ordering is edited from the admin `Sources` module. Runtime settings persist:
- `priority`
- `text_priority`
- `image_priority`

`0` disables the source for the specific purpose (`text` or `images`) without removing the source entirely.

## 5. Image Rules

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
- keep watermark cleanup disabled when clean image sources such as `pharmacy295` or `vita4you` are active and preferred
- enable it only when intentionally accepting `farmakopoiosmou` image downloads or when running a legacy hosted-image cleanup pass

### Source lock rule
If an image is imported from a trusted Excel-driven source such as `pharmacy295_excel`, it can be locked so that it is not overwritten later by lower-quality source refreshes.

The same rule now applies to offline trusted XML photo replacement:
- `youpharmacy_xml` is a trusted image-lock source used by the backend script `replace_farmakopoiosmou_with_youpharmacy_xml.py`
- the script consumes a provided `youpharmacy` XML file, maps products by `ean` first and numeric `mpn` fallback, downloads the clean source image, and replaces current hosted images only for products whose active image provenance is still `farmakopoiosmou`
- once replaced, the image set is locked so future `farmakopoiosmou` refreshes do not overwrite it
- the admin `Sources` module now exposes `youpharmacy` as a job-only source with XML upload plus `Import XML Photos`; operators do not need shell access to refresh the XML input file

### Manual source refresh image rule
Manual `Refresh From Sources` must not blindly trust all image URLs returned by a source.

Current rule:
- source text and source images are resolved through separate source chains
- source images are filtered before they are shown in admin edit
- non-product assets such as icons, logos, favicons, flags, placeholders, banners, and theme images are rejected
- `farmakopoiosmou` is no longer allowed to contribute image URLs to refreshed items; it is used for text and metadata only
- cached source results are invalidated before a manual refresh so that old bad image lists do not keep returning
- manual `Refresh From Sources` downloads hosted images from the image-source chain as part of the same action
- clean image source currently preferred is `pharmacy295`
- `vita4you` is currently disabled in the live source chains because it is not considered reliable enough for production refresh decisions
- `tofarmakeiomou` support is wired with the direct title-search pattern `https://www.tofarmakeiomou.gr/el-gr/ALL?title=<barcode>`, but it currently requires proxy because live server requests return Cloudflare challenge pages
- proxy-required live sources must skip only the live network fetch when no effective proxy is configured; manual refresh must still try any trusted stored source snapshot for that source from `Other_Sites`
- if `tofarmakeiomou` enters image mode through a stored snapshot while proxy is off, it must not spend time on remote source-image download attempts from external URLs; only an already valid hosted/local image set may be reused, otherwise the draft image state stays empty
- manual item refresh builds a source search-term set from the current item state: first barcode, then current title/brand fallbacks
- if `vita4you` is re-enabled later, manual refresh must use only the canonical localized search path `/el/search/?q=<query>`
- if `vita4you` is re-enabled later and static HTML has no product links, manual refresh must call the direct Klevu search endpoint and extract product URLs from that JSON response; browser-rendered fallback is no longer part of the hot path
- if `vita4you` is re-enabled later, title-based fallback matches must be validated against the most specific available item title query as well; generic `No8` / weight matches must not override pack-count mismatches such as `14τμχ` vs `26τμχ`
- if `vita4you` is re-enabled later, manual refresh should keep the bounded candidate window and shorter source-specific timeouts so a no-match case does not stall the whole refresh chain for the full generic per-site timeout budget
- a source that is not enabled for the current purpose (`Text` or `Images`) must be skipped completely even if it still appears in historical priority metadata; removed or image-disabled sources must not re-enter refresh through fallback paths
- if no clean image source returns a valid fresh hosted image set, the refresh must not inject dirty raw source image URLs and must not misrepresent an older hosted file as the result of the new refresh
- if a clean image source does return a valid product image set, manual refresh replaces the existing hosted folder atomically so old hosted images from previous sources do not remain mixed into the item
- admin-facing hosted image URLs must be versioned from file mtime so manual refresh shows the newly written hosted image instead of a cached older browser copy
- admin edit and details views must expose only hosted/public item images, not raw external source URLs
- if the item already carries trusted source-backed fields on the main record or in `Other_Sites`, manual refresh may use that stored source snapshot when the live search path fails, so existing reliable source metadata and image links are not wasted
- if a stored source snapshot points to an old source-local image path but the system cannot write a new hosted image set for the current refresh, the draft image state must stay empty rather than reuse stale hosted files from a previous source
- if `tofarmakeiomou` stored metadata exists but a new hosted image download fails during the current refresh, that snapshot may still supply text but must not be counted as a successful image-source hit
- admin item-form actions such as refresh/save/delete-image must keep their errors scoped to the modal; the main items list banner should be used only for page-level data loading failures
- the current hosted-image reprocess version for this cleanup is `farmakopoiosmou_crop_v3`
- `farmakopoiosmou_crop_v3` uses a stronger lower-left watermark removal pass that detects watermark clusters and replaces them with nearby clean pixels instead of using a flat paint-over

## 6. API Surfaces

### Customer API
Endpoint:
- `POST https://image.cloudon.gr/api/products`

Rules:
- returns only `active` items
- returns only customer-safe fields
- image URLs are returned only if they are CloudOn hosted URLs

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
- fake user names such as `Patrenna`
- fake job titles such as `Web Designer`
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
- CloudOn logo
- live profile actions
- real system events in the bell dropdown
- only `English` and `Greek` in the language selector
- no fake template message center

### Customer portal shell
The customer portal must use:
- CloudOn logo
- live profile/logout actions
- only `English` and `Greek`
- default language priority `English`
- branded login background that visually references the service

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

## 10. Admin Workflows

### Catalog quality management
Admin can identify products requiring work by using the item quality filters:
- needs fix
- missing text
- missing category
- missing image source

### Customer feedback workflow
Customer remarks are collected separately and can be reviewed by admin in a dedicated remarks queue.

### Source control workflow
Admin can:
- enable/disable source usage
- remove/restore sources from the active chain
- launch source jobs
- configure proxy settings

## 11. Settings

Admin settings currently include operational controls such as:
- proxy configuration
- API access switches
- API client enable/disable
- mail account settings
- XML service configuration and manual XML feed generation
- activation policy visibility

## 12. Translation Policy

Current target language policy:
- supported languages: `English`, `Greek`
- default priority: `English`

Portal and admin selectors must expose only these two languages.

## 13. Deployment Notes

### Frontend builds
Portal build script:
- `/home/imageuser/imageDataAPI/build_customer_portal.sh`

Admin build script:
- `/home/imageuser/imageDataAPI/build_admin_cms.sh`

Deploy targets:
- `/home/imageuser/cms-portal-dist`
- `/home/imageuser/cms-admin-dist`

Runtime XML service:
- docker service name: `xml_generator`
- build context: `/home/imageuser/CloudonXMLGeneratorNew`
- public XML route proxied by the main backend: `/api/xml_generator/{domain}/{marketplace_xml}`
- admin XML settings must present current published files separately from archived `backup/old` files and expose direct download actions for the current set through the proxied public XML route

## 14. Documentation Change Rule

For every project change that affects runtime behavior, UI, workflows, permissions, source handling, or customer/admin operations, documentation must be updated as part of the same change.

Default requirement:
- update the technical handbook
- update the relevant user manual(s)
- do not treat documentation as optional follow-up work

This is now a standard operating rule for the project.
