# CloudOn Admin CMS Manual

## 1. Purpose
The admin CMS is the operational control panel for:
- catalog management
- category management
- clients
- sources
- quality review
- portal/customer workflows

URL:
- `https://image.cloudon.gr/admin/`

## 2. Header
The admin top bar includes:
- sidebar toggle
- module search
- dark mode toggle
- fullscreen
- language selector
- system events bell
- account menu

The account menu provides:
- settings
- sign out

## 3. Supported Languages
Only these languages are supported in the admin:
- `English`
- `Greek`

## 4. Sidebar Areas
The sidebar contains the main operational modules:
- Dashboard
- Server
- Sources
- Items
- Fix Queue
- Items by Category
- Categories
- Clients
- Customer Remarks
- Users
- Roles
- Notifications
- Audit Log
- Settings

## 5. Sources
The `Sources` module is used to:
- enable or disable sources
- remove or restore sources without deleting already downloaded items
- edit source priorities for:
  - general chain order
  - text preference order
  - image preference order
- start source jobs
- monitor source job status

Important:
- removing a source does not delete its products
- existing products remain in the catalog
- future refreshes are handled by the remaining enabled sources
- source priorities are edited directly in the `Sources` grid with:
  - `Chain`
  - `Text`
  - `Images`
- `0` means that the source is not used for that purpose
- a job shows `Running` only while its real process is alive; after a restart or unexpected stop, stale `Running` state is cleared automatically
- `pharmacy295 -> Import Photos` uses the Excel feed and can import photos only for barcodes that actually exist in that feed
- for degraded `farmakopoiosmou` hosted photos, operators can run the backend script `replace_farmakopoiosmou_with_youpharmacy_xml.py` against a provided `youpharmacy` XML feed; it matches first on `ean`, then on numeric `mpn`, and locks the resulting image set as `youpharmacy_xml`
- `youpharmacy` is exposed in Sources as a job-only feed source: operators upload a fresh XML file from the admin and then run `Import XML Photos`; it is not part of the live text/image refresh chain
- the `Managed Sources` table uses grouped columns; image counts are shown under `Image Stats`, while capabilities, search pattern, and notes are grouped under `Details` so the page stays readable

## 6. Items
The `Items` module is used to:
- search items
- filter by status, quality, and category levels
- open item details
- edit product information
- refresh item information from sources
- delete item images
- delete an item entirely if needed

### Refresh From Sources
When `Refresh From Sources` is used:
1. texts are fetched from the first available source
2. barcode category mapping is checked first
3. if no barcode mapping exists, source categories are used
4. categories remain editable after refresh
5. images are resolved through a separate image-source chain
6. `farmakopoiosmou` is treated as a text/metadata source only and must not inject image URLs into refreshed items
7. the item image state is replaced by the current filtered image-source result, so stale icon/logo/pagespeed images are not kept after a manual refresh
8. hosted images are downloaded during the same refresh action, so source-specific post-processing also runs immediately
9. when a cleaner image source such as `pharmacy295` is available, it is preferred over `farmakopoiosmou`
10. the current `farmakopoiosmou` cleanup version is `farmakopoiosmou_crop_v3`, but it is now a fallback cleanup path rather than the preferred image strategy
11. the edit form shows only hosted/public item images; raw external source URLs must not appear in the editable media list
12. when the active image source returns a valid hosted image set, the existing hosted folder for that barcode is replaced atomically; old hosted images from previous sources must not remain mixed into the refreshed item
13. admin edit/details image URLs include a version token so the browser is forced to reload the newly refreshed hosted image instead of showing a cached older file
14. if a source is marked `proxy_required` and no effective proxy is configured, its live network fetch is skipped; if a trusted stored source snapshot exists under `Other_Sites`, that snapshot is tried before the system moves to the next available source
15. if a source is disabled or has `Text = 0` / `Images = 0`, it is skipped completely for that purpose; historical badges must not be interpreted as live eligibility
16. if a source requires proxy for live search and proxy is not configured, `Refresh From Sources` still tries any trusted stored source snapshot under `Other_Sites` for that same source before falling back to the next source
17. if live source lookup fails but the item already has trusted source-backed data on the main record or under `Other_Sites`, the refresh can reuse that stored source record instead of failing immediately
18. if the current refresh does not produce a fresh hosted image set for the chosen source, the edit draft must not continue to show a stale hosted image from an older source run; it shows no image instead
19. `vita4you` is currently disabled from the live text/image chains because it is not considered reliable enough for production refresh decisions
20. if `tofarmakeiomou` contributes only a stored snapshot and the current image download fails, the refresh may still keep its text fields but it must not report that source as a successful fresh image hit
21. if `tofarmakeiomou` enters image mode only through a stored snapshot while proxy is off, `Refresh From Sources` must skip remote source-image download attempts and leave the draft image state empty unless a fresh hosted image set can actually be produced
22. if `vita4you` is re-enabled later, it must use only `/el/search/?q=<query>` plus direct Klevu JSON lookup; it must not wait for browser-rendered search fallback
23. if `vita4you` is re-enabled later, fallback title matches must still agree with the most specific item title; `No8 26τμχ` must not be accepted for an item whose current title says `14τμχ`
24. if `vita4you` is re-enabled later, no-match refreshes should keep the tighter candidate window and shorter source-specific timeout so manual refresh remains responsive
25. refresh/save/delete-image errors from the item edit modal are shown inside that modal and cleared on close; the main items list banner is reserved for page-level loading failures

## 7. Quality Review
The admin quality workflow separates items into:
- ready
- needs fix
- ready for review

The item list and queue views are used to identify:
- missing text
- missing category
- missing image coverage

## 8. Clients
The `Clients` module is used to:
- manage customer accounts
- set category scope
- manage API client state
- send client credentials

## 9. Customer Remarks
The `Customer Remarks` module is the admin queue for customer comments.

It is used to see:
- which item has a remark
- which client wrote it
- what was written
- when it was created
- its current handling state

## 10. Settings
The `Settings` module is used for:
- proxy configuration
- API access enable/disable
- API client enable/disable
- mail account configuration
- image processing runtime toggles
- XML service configuration and manual XML generation
- activation policy visibility

### Image Processing
The `Image Processing` card controls whether the legacy watermark-removal mechanism is active.

Rule:
- `Enabled` means the system is allowed to run the legacy `farmakopoiosmou` watermark cleanup during:
  - new image downloads
  - hosted-image reprocess jobs
- `Disabled` means the system must skip that cleanup path entirely

Recommended use:
- keep it `Disabled` when cleaner image sources such as `pharmacy295` and `vita4you` are the preferred image sources
- turn it `Enabled` only when you intentionally want to use legacy `farmakopoiosmou` image intake or reprocess old hosted images from that source

### XML Service
The `XML Service` card controls the internal XML generator container used for marketplace XML feeds.

Operational UI rules:
- `Published XML Files` must separate current published XML files from archived `backup/old` files
- current published XML files must expose direct `Download` actions from the admin
- archived XML files may stay available as secondary links, but they must not be mixed visually with the current published set
- when no successful latest-run file metadata exists, the admin should still treat non-archived filenames such as `skroutz.xml`, `bestprice.xml`, and `shopflix.xml` as the current downloadable set

Operator rules:
- `Enabled` allows the image server backend to proxy published XML files and to trigger XML generation
- `Internal Service URL` is the docker-network address used by the backend, normally `http://xml_generator`
- `Public Base URL` is the published path shown to operators and clients for generated XML feeds
- `Run full XML generation` starts a full rebuild for all configured XML domains inside the XML service
- the card also shows last run status, configured domains, and published XML file links

### Manual Source Refresh
`Items -> Edit -> Refresh From Sources` works in this order:
- barcode search first
- if the source does not expose the product by barcode, fallback search terms are built from the current item title/brand
- category mapping is checked first against the barcode-category table
- if no barcode-category match exists, category data falls back to the source result

`vita4you` specific rule:
- `vita4you` is currently disabled in the live runtime source chains
- if it is re-enabled later, the exact search path used first is `/el/search/?q=<query>`
- if it is re-enabled later and static HTML contains no product links, the system calls the direct Klevu search API and uses the returned product URLs
- if it is re-enabled later, title-based fallback results are accepted only when they still match the most specific current item title, including pack-count and size discriminators
- no-match cases use shorter source-specific timeout limits, so the editor does not wait for the full generic per-site timeout before moving to the next source

`tofarmakeiomou` proxy-off snapshot rule:
- if proxy is off and the refresh uses only a stored `tofarmakeiomou` snapshot, text fields may still refresh from that snapshot
- in that same proxy-off path, the refresh no longer waits on remote source-image download attempts from stored external URLs
- unless a fresh hosted/local image set already exists, the draft image result stays empty

## 11. Placeholder Policy
Template placeholders must not remain active in runtime UI.

Examples that must not appear in production:
- fake users
- fake message center
- demo text
- placeholder flags
- template branding instead of CloudOn branding
- template switcher/demo behavior attached to live routes
- placeholder error-page wrappers attached to the main runtime shell

## 12. Operational Rule
Every runtime/UI change must be reflected in project documentation:
- technical handbook
- relevant manual(s)

Build verification rule:
- deployed admin bundles must not contain `Azea`, `Spruko`, `Patrenna`, or `Web Designer`
