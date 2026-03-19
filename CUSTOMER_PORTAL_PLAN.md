# Customer Portal Plan

## 1. Στόχος

Το `image.cloudon.gr` πρέπει να αποκτήσει ξεχωριστό **customer portal** για τους πελάτες.

Απαράβατος κανόνας:

- ο πελάτης βλέπει **μόνο ενεργά είδη**
- ο πελάτης βλέπει **μόνο είδη που επιτρέπονται από το category subscription του**
- ο πελάτης **δεν επεμβαίνει** στα δεδομένα προϊόντων
- ο μόνος τρόπος παρέμβασης είναι **remark / comment προς τον admin**

Το admin παραμένει στο:

- `https://image.cloudon.gr/admin/`

Το customer portal προτείνεται να γίνει το κύριο frontend του domain:

- `https://image.cloudon.gr/`

Το customer API παραμένει:

- `https://image.cloudon.gr/api/products`

## 2. Core Product Visibility Contract

Για να εμφανιστεί είδος στο customer portal πρέπει να ισχύουν **όλα** τα παρακάτω:

- `status = active`
- το είδος ανήκει στο scope του πελάτη
- το είδος δεν είναι soft-deleted / hidden

Σημαντικό:

- Το portal δεν εμφανίζει `inactive`, `needs_fix`, `ready_for_review` ή draft items.
- Το portal και το public API πρέπει να βασίζονται στον **ίδιο active-only κανόνα**.
- Το `Image_url` εμφανίζεται μόνο όταν υπάρχει **δικό μας hosted URL**.
- Αν το είδος είναι ενεργό αλλά έχει μόνο external source image, το είδος μπορεί να εμφανίζεται, αλλά το `Image_url` πρέπει να είναι κενό.

## 3. Αρχιτεκτονική Κατεύθυνση

Το customer portal δεν πρέπει να είναι “μισό admin”.

Σωστή αρχιτεκτονική:

- ίδιο backend
- ίδιο auth provider
- ίδιο catalog dataset
- **ξεχωριστό frontend shell** για πελάτη
- **ξεχωριστό route tree**
- **ξεχωριστό permission layer** για customer views

### Προτεινόμενος διαχωρισμός

- `Admin Shell`: `/admin/*`
- `Customer Shell`: `/*` ή `/portal/*`
- `Public API`: `/api/products`

Σύσταση:

- βάζουμε το customer portal στο root `image.cloudon.gr`
- κρατάμε το admin στο `/admin/`
- δεν ανακατεύουμε admin navigation με customer navigation

## 4. Customer Role Model

Ο ρόλος πελάτη παραμένει `client`, αλλά αποκτά **ξεχωριστές portal permissions**.

### Προτεινόμενα permissions

- `portal.dashboard.view`
- `portal.items.view`
- `portal.categories.view`
- `portal.item_detail.view`
- `portal.remarks.create`
- `portal.remarks.view_own`
- `portal.profile.view`

Ο `client` **δεν** πρέπει να έχει δικαίωμα σε admin modules όπως:

- `items.create`
- `items.update`
- `items.delete`
- `categories.create`
- `categories.update`
- `users.*`
- `roles.*`
- `notifications.publish`
- `settings.update`

## 5. Customer Data Scope

Το portal πρέπει να σέβεται το scope του κάθε πελάτη από το `cms_clients`.

### Subscription modes

- `all_categories`
- `selected_categories`

### Visibility rules

Αν ο πελάτης έχει `all_categories`:

- βλέπει όλα τα `active` items

Αν ο πελάτης έχει `selected_categories`:

- βλέπει μόνο items που ανήκουν στις category nodes που του έχουν ανατεθεί
- το scope είναι **ιεραρχικό**

Παράδειγμα:

- αν ο πελάτης έχει `Category_1 = ΠΡΟΣΩΠΙΚΗ ΥΓΙΕΙΝΗ`
- βλέπει όλα τα items κάτω από αυτό το `Category_1`

Αν ο πελάτης έχει `Category_2` ή `Category_3`:

- βλέπει μόνο τα items αυτής της συγκεκριμένης υποενότητας

## 6. Προτεινόμενη Δομή Πλοήγησης

Αριστερό menu / main navigation:

- `Dashboard`
- `Όλα τα Είδη`
- `Νέα Είδη`
- `Κατηγορίες`
- `Οι Παρατηρήσεις Μου`
- `Προφίλ`

Προαιρετικά αργότερα:

- `Σημαντικές Ενημερώσεις`
- `Αγαπημένα / Παρακολουθούμενα`

## 7. Customer Screens

### 7.1 Dashboard

Σκοπός:

- γρήγορη εικόνα του catalog που αφορά τον συγκεκριμένο πελάτη

Widgets / cards:

- `Σύνολο ενεργών προϊόντων`
- `Νέες καταχωρίσεις`
- `Πρόσφατα ενημερωμένα είδη`
- `Προϊόντα ανά κατηγορία`
- `Είδη με δικές μου παρατηρήσεις`
- `Ανοιχτές παρατηρήσεις`

Optional charts:

- `Items by Category`
- `Items added last 30 days`
- `Recently updated last 30 days`

### 7.2 Όλα τα Είδη

Σκοπός:

- κύρια λίστα των ειδών που μπορεί να δει ο πελάτης

Columns:

- τίτλος
- κωδικός
- barcode
- `Category 1`
- `Category 2`
- `Category 3`
- status
- created at
- updated at

Filters:

- search
- `Category 1`
- `Category 2`
- `Category 3`
- status
- recent / new
- sort field
- sort order
- pagination

Κανόνες:

- εμφανίζονται μόνο `active` items
- τα φίλτρα κατηγοριών είναι 3-επίπεδα, όχι ένα merged string
- από εδώ ανοίγει η αναλυτική καρτέλα

### 7.3 Νέα Είδη

Σκοπός:

- γρήγορη προβολή νέων ενεργών ειδών

Κανόνες:

- subset του `Όλα τα Είδη`
- default sort: `created_at desc`
- default χρονικό παράθυρο: τελευταίες `30` ημέρες
- configurable αργότερα

### 7.4 Κατηγορίες

Σκοπός:

- αναλυτική προβολή taxonomy και item counts

Περιεχόμενο:

- όλες οι διαθέσιμες κατηγορίες για τον πελάτη
- `Category 1`
- `Category 2`
- `Category 3`
- item count ανά category node

Behavior:

- click σε category node => ανοίγει item list με pre-applied filters
- ο πελάτης βλέπει μόνο categories που έχουν items στο δικό του scope

### 7.5 Αναλυτική Καρτέλα Είδους

Σκοπός:

- πλήρης **read-only** προβολή του είδους

Sections:

- `Basic Info`
- `Categories`
- `Description`
- `Characteristics`
- `Brand / Unit`
- `Product Media`
- `Metadata`
- `Remarks`

Πεδία που πρέπει να εμφανίζονται:

- title
- code
- sku
- barcode
- `Category 1`
- `Category 2`
- `Category 3`
- description / html description
- χαρακτηριστικά / structured content
- brand
- unit
- status
- created at
- updated at
- hosted images
- approved metadata fields

Κανόνες UI:

- αυστηρά read-only
- κανένα edit / delete / approve control
- καθαρό visual separation ανάμεσα στα δεδομένα και στο remark form
- εύκολη επιστροφή στη λίστα

### 7.6 Οι Παρατηρήσεις Μου

Σκοπός:

- ο πελάτης βλέπει μόνο τα δικά του remarks

Columns:

- item title
- barcode
- category path
- comment text
- status
- created at
- updated at

Statuses:

- `new`
- `under_review`
- `resolved`

## 8. Remarks / Comments Προς Admin

Ο πελάτης πρέπει να μπορεί να αφήνει remark πάνω σε item.

### Επιτρεπτές χρήσεις

- «Το είδος δεν έχει σωστές πληροφορίες»
- «Λείπει περιγραφή»
- «Η κατηγορία δεν είναι σωστή»
- «Χρειάζεται διόρθωση στα χαρακτηριστικά»

### Τι μπορεί να κάνει ο πελάτης

- create νέο comment
- δει τα προηγούμενα δικά του comments για το item

### Τι δεν μπορεί να κάνει

- edit item data
- delete item data
- approve item
- change item status
- resolve comment μόνος του

## 9. Database Logic Για Customer Remarks

Η τωρινή βάση είναι Mongo-driven, άρα η σωστή πρώτη υλοποίηση είναι με νέα collection.

### Νέα collection

- `cms_customer_item_comments`

### Προτεινόμενο schema

- `_id`
- `item_id`
- `item_barcode`
- `item_title_snapshot`
- `client_id`
- `client_name_snapshot`
- `client_email_snapshot`
- `comment_text`
- `comment_type`
- `status`
- `admin_response`
- `resolution_note`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`
- `resolved_at`
- `resolved_by`
- `is_active`

### Comment types

- `missing_description`
- `wrong_category`
- `wrong_characteristics`
- `wrong_media`
- `generic_remark`

### Status values

- `new`
- `under_review`
- `resolved`

### Indexes

- `item_id + status`
- `client_id + created_at`
- `status + created_at`
- `item_barcode`

Σωστή πρώτη έκδοση:

- create comment
- list own comments
- admin update status / response
- no client-side edit/delete μετά την υποβολή

## 10. Admin Integration Για Σχολιασμένα Είδη

Στο admin πρέπει να μπει νέο module:

- `Customer Remarks`

ή εναλλακτικά label:

- `Pending Customer Remarks`

### Τι πρέπει να δείχνει

- item
- barcode
- πελάτης
- comment
- comment type
- status
- created at
- updated at
- admin response

### Admin actions

- mark `under_review`
- mark `resolved`
- add response / note
- open item detail directly
- filter by client
- filter by status
- filter by date

### Admin dashboard indicators

Να υπάρχουν widgets / counters:

- `New customer remarks`
- `Customer remarks under review`
- `Items with open customer remarks`

### Header bell integration

Το bell του admin πρέπει να δείχνει και:

- νέα customer remarks
- status updates σε existing remarks

## 11. Customer UX / UI Direction

Το portal πρέπει να είναι:

- καθαρό
- σύγχρονο
- mobile friendly
- επαγγελματικό
- clearly read-only

### Σχεδιαστικές αρχές

- έντονος διαχωρισμός `Dashboard / List / Detail / Remarks`
- μεγάλα, καθαρά cards
- readable tables
- compact but not cramped filters
- item detail με δυνατό focus σε media και structured content
- το remark box να είναι ορατό αλλά όχι να μοιάζει με “edit item” form

### Σήμανση read-only

Στην item detail να υπάρχει οπτική ένδειξη:

- `Product data is managed by CloudOn Admin`
- `Use remarks to request corrections`

## 12. Προτεινόμενο Layout Για Item Detail

### Left column

- gallery / product media
- zoom
- thumbnails

### Center column

- title
- code / barcode / sku
- brand / unit / status
- category path
- structured description / html content

### Right column

- metadata card
- remarks summary
- `Add Remark` card
- previous remarks for this item

Κανόνας:

- customer δεν πρέπει να μπερδεύει ποτέ το remark form με edit form

## 13. API / Backend Contracts

Χρειάζονται ξεχωριστά customer-facing CMS routes, όχι reuse των admin endpoints ως έχουν.

### Προτεινόμενα endpoints

- `POST /portal/auth/login`
- `POST /portal/auth/logout`
- `GET /portal/auth/me`
- `GET /portal/dashboard/overview`
- `GET /portal/items`
- `GET /portal/items/{item_id}`
- `GET /portal/categories`
- `GET /portal/comments`
- `POST /portal/items/{item_id}/comments`
- `GET /portal/profile`

### Βασικός κανόνας portal endpoints

Κάθε query πρέπει να εφαρμόζει:

- client scope
- `status = active`
- visibility constraints

## 14. Σχέση Με Public Customer API

Το `https://image.cloudon.gr/api/products` παραμένει API channel για πελάτες.

Το customer portal πρέπει να ακολουθεί τους ίδιους βασικούς publish rules:

- active-only items
- hosted-only `Image_url`
- category-aware filtering

Αυτό είναι κρίσιμο ώστε:

- το portal και το API να μην δείχνουν διαφορετική αλήθεια

## 15. Implementation Order

Σωστή σειρά υλοποίησης:

1. **Portal data contract**
- active-only filtering
- client scope filtering
- customer-facing serializers

2. **Customer permissions**
- portal-only permission layer
- route guards
- shell separation από admin

3. **Customer shell / layout**
- dashboard shell
- left navigation
- profile/logout

4. **Items list + item detail**
- read-only list
- read-only detail
- category filters `1/2/3`
- recent/new filters

5. **Categories view**
- counts ανά category node
- click-through στα items

6. **Customer remarks backend**
- collection
- create/list endpoints
- validation / status workflow

7. **Customer remarks frontend**
- add remark form
- my remarks page
- item-level remark history

8. **Admin remarks module**
- queue view
- item open actions
- status workflow
- dashboard indicators
- bell events

9. **Dashboard completion**
- widgets
- recent updates
- remarks counters
- category distribution

10. **Polish / mobile / empty states**
- loading
- empty states
- error states
- responsive review

## 16. Τι Θεωρείται Done

Το customer portal θεωρείται ολοκληρωμένο όταν:

- ο πελάτης μπαίνει με δικό του login
- βλέπει μόνο τα δικά του ενεργά είδη
- πλοηγείται σε dashboard / items / categories / item detail
- δεν μπορεί να επεξεργαστεί τίποτα
- μπορεί να αφήσει remark σε item
- ο admin βλέπει συγκεντρωμένα τα customer remarks
- υπάρχουν indicators για νέα remarks στο admin
- portal και public API ακολουθούν κοινό active-only publishing rule

## 17. Απόφαση Υλοποίησης

Αυτή η προδιαγραφή κλειδώνει τα εξής:

- το customer portal είναι **ξεχωριστό frontend shell**
- το customer portal δείχνει **μόνο active items**
- ο πελάτης έχει **read-only πρόσβαση** στα δεδομένα ειδών
- ο πελάτης παρεμβαίνει **μόνο μέσω remarks**
- τα customer remarks γίνονται **admin workflow**, όχι direct product edit
