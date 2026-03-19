# CloudOn Admin CMS Manual

## 1. Σκοπός
Το Admin CMS είναι το κεντρικό λειτουργικό panel για:
- διαχείριση καταλόγου
- διαχείριση κατηγοριών
- διαχείριση πελατών
- διαχείριση πηγών
- quality review
- review queue / go-live
- ρυθμίσεις API
- XML jobs και background εργασίες

URL:
- `https://image.cloudon.gr/admin/`

## 2. Επάνω μπάρα
Η επάνω μπάρα περιλαμβάνει:
- toggle για sidebar
- αναζήτηση ενοτήτων CMS
- dark mode toggle
- fullscreen
- επιλογή γλώσσας
- bell με system events
- account menu

Το account menu δίνει:
- ρυθμίσεις
- αποσύνδεση

### System events
Το bell δεν είναι απλό notification badge. Δείχνει πραγματικά runtime events:
- item updates
- audit events
- API access events
- notifications

Όταν επιλέγεις event:
- για item events ανοίγει απευθείας το σχετικό item με `focus`
- για API/client events σε οδηγεί στο σωστό module
- δεν πρέπει να σε πετάει σε άσχετη γενική λίστα ή template route

## 3. Υποστηριζόμενες γλώσσες
Στο admin υποστηρίζονται μόνο:
- `English`
- `Greek`

Κανόνες:
- η επιλογή γλώσσας αποθηκεύεται στον browser
- το shell, τα menu, τα φίλτρα και τα header actions πρέπει να ακολουθούν τη γλώσσα που έχει επιλεγεί
- μεμονωμένα αγγλικά strings μέσα σε ελληνικό shell θεωρούνται defect αν δεν είναι όρος προϊόντος ή API

## 4. Sidebar ενότητες
Το αριστερό menu περιλαμβάνει τις βασικές operational ενότητες:
- Dashboard
- Server
- Sources
- Items
- Fix Queue
- Review Queue
- Items by Category
- Categories
- Clients
- Customer Remarks
- Users
- Roles
- Notifications
- Audit Log
- Settings

## 5. Dashboard και γενική πλοήγηση
Το admin shell χρησιμοποιεί:
- CloudOn logo
- CloudOn ContentSync Platform branding
- πραγματικά profile actions
- πραγματικά system events
- responsive hero cards και metrics

Σε όλες τις βασικές λίστες επιδιώκεται κοινό pattern:
- title / description module
- compact summary metrics
- φίλτρα
- table ή cards με τις πραγματικές ενέργειες

Στα modules με φίλτρα εμφανίζονται summary boxes όπως:
- φιλτραρισμένες εγγραφές
- ενεργά φίλτρα
- τρέχουσα σελίδα

## 6. Sources
Η ενότητα `Sources` χρησιμοποιείται για:
- ενεργοποίηση / απενεργοποίηση πηγών
- remove / restore χωρίς διαγραφή των ήδη κατεβασμένων προϊόντων
- ρύθμιση priorities για:
  - general chain
  - text preference
  - image preference
- εκκίνηση source jobs
- παρακολούθηση source job status
- XML upload για job-only πηγές

### Βασικοί κανόνες
- η αφαίρεση πηγής δεν διαγράφει προϊόντα
- τα υπάρχοντα προϊόντα μένουν στον κατάλογο
- τα μελλοντικά refresh γίνονται από τις υπόλοιπες ενεργές πηγές
- `0` σε `Text` ή `Images` σημαίνει ότι η πηγή δεν χρησιμοποιείται για αυτόν τον σκοπό
- `Running` σημαίνει ότι υπάρχει πραγματικό ενεργό process
- stale `Running` state καθαρίζεται αυτόματα όταν δεν υπάρχει πια process

### Ενδεικτική επιχειρησιακή κατάσταση πηγών
- `Ofarmakopoiosmou`: κύρια πηγή κειμένου/metadata, όχι automatic image source
- `Pharmacy295`: προτιμώμενη καθαρή πηγή φωτογραφιών από feed, live access συνήθως `proxy_required`
- `YouPharmacy`: WooCommerce πηγή, manual refresh candidate και job-only XML photo source
- `GoHealthy`: manual refresh candidate
- `Cure4u`: manual refresh candidate μέσω PrestaShop search endpoint
- `KpdHellas`: χαμηλής προτεραιότητας live text fallback, manual image override available
- `Vita4You`: disabled στο live chain, κρατιέται για validation only
- `ToFarmakeioMou`: known search pattern, αλλά live fetch θέλει proxy λόγω Cloudflare

### Source jobs
Παραδείγματα jobs:
- import photos
- Excel-driven import
- XML upload + XML photo import
- hosted image cleanup / reprocess

### YouPharmacy XML φωτογραφίες
Η `youpharmacy` εμφανίζεται ως job-only source για XML φωτογραφίες:
- ανεβάζεις νέο XML από το admin
- τρέχεις `Import XML Photos`
- η διαδικασία αντικαθιστά degraded `farmakopoiosmou` hosted images όπου υπάρχει ασφαλές match
- το νέο result κλειδώνει την προέλευση ως `youpharmacy_xml`

## 7. Items, Fix Queue και Review Queue

### Items list
Η ενότητα `Items` χρησιμοποιείται για:
- αναζήτηση
- φίλτρα κατάστασης
- quality filter
- φίλτρα category 1/2/3
- photo source filter για trusted hosted photo provenance
- sorting / pagination
- detail / edit / go-live actions

### Fix Queue
Το `Fix Queue` είναι operational όψη πάνω στα items που χρειάζονται διόρθωση.

Χρησιμοποιείται για:
- `Quality = Needs Fix`
- διάκριση missing text / missing category / missing public image
- bulk refresh workflows

### Review Queue
Το `Review Queue` είναι προσωρινή λίστα για inactive items που έχουν πλέον γίνει πλήρη και θέλουν τελικό έλεγχο.

Κανόνας:
- αν το item μείνει inactive αλλά περάσει πλήρως το quality gate, μπαίνει σε `Ready for Review`
- από εκεί ο διαχειριστής μπορεί να κάνει `Approve Go Live`

## 8. Edit item
Το edit item είναι το βασικό operational σημείο για διορθώσεις.

Περιλαμβάνει:
- hosted media preview
- edit πεδίων
- HTML description editor με live preview
- manual source refresh
- manual image upload
- remote image import
- activation/provenance diagnostics

### Refresh From Sources
Το `Refresh From Sources` λειτουργεί με αυτή τη σειρά:
1. lookup με barcode
2. fallback search terms από title / brand αν χρειαστεί
3. category mapping από barcode table
4. fallback στις κατηγορίες της πηγής αν δεν υπάρχει mapping
5. image fetch από ξεχωριστό image chain

### Source selectors
Στο edit modal υπάρχουν selectors για:
- `Κοινή Πηγή`
- `Πηγή Κειμένου`
- `Πηγή Εικόνων`
- `Πηγή Κατηγοριών`

Κανόνες:
- η κοινή πηγή χρησιμοποιείται για όλα, εκτός αν την σπάσεις με τα ειδικά selectors
- τα text/image/category overrides υπερισχύουν της κοινής πηγής
- disabled πηγές ή πηγές με `Text = 0` / `Images = 0` δεν πρέπει να ξαναμπαίνουν από fallback path

### Ειδικοί κανόνες refresh
- `Ofarmakopoiosmou` χρησιμοποιείται μόνο για κείμενο/metadata, όχι ως automatic source εικόνων
- `Pharmacy295` παραμένει preferred clean image source όταν υπάρχει καλό source result
- `ToFarmakeioMou` χωρίς proxy μπορεί να δώσει μόνο stored snapshot για text, όχι ασφαλές live image result
- `Vita4You` είναι disabled στο live chain και χρησιμοποιείται μόνο αν επιλεγεί ρητά για validation
- `KpdHellas` μπορεί να χρησιμοποιηθεί χειροκίνητα για εικόνες, αλλά automatic image priority μένει κλειστό
- αν δεν προκύψει νέο valid hosted image set, το draft πρέπει να μείνει κενό και όχι να δείξει stale hosted εικόνα από παλιότερο source
- όταν υπάρξει valid fresh hosted image set, ο φάκελος εικόνων του barcode αντικαθίσταται ατομικά

### Hosted media list
Η media στήλη δείχνει:
- μόνο hosted/public εικόνες
- versioned URLs για να μη βλέπεις cache
- delete ανά εικόνα
- zoom στην κύρια εικόνα και στη gallery

## 9. Manual images και Google fallback
Όταν καμία πηγή δεν δίνει usable αποτέλεσμα, ο operator έχει δύο fallback paths.

### Χειροκίνητη μεταφόρτωση
Υποστηρίζεται upload αρχείων:
- `png`
- `jpeg`
- `webp`

Επιλογές:
- αντικατάσταση υπαρχουσών hosted εικόνων
- ορισμός της πρώτης εικόνας ως κύρια

### Remote import
Ο operator μπορεί να εισάγει:
- direct image URL
- source page URL για auto-extract

### Google Images helper
Το Google χρησιμοποιείται μόνο σαν βοηθητικό discovery layer.

Κανόνες:
- δεν βάζουμε Google search results URL ως image URL
- δεν βάζουμε Google results URL στο `Source page URL`
- το σωστό workflow είναι:
  1. άνοιγμα Google Images
  2. εύρεση origin site
  3. επικόλληση direct image URL ή product page URL από το πραγματικό site

## 10. Description editor
Ο description editor δουλεύει σε HTML mode με live preview.

Συμπεριφορά:
- ο editor αποθηκεύει `description_html`
- αν δοθεί μόνο plain text, το backend το μετατρέπει σε ασφαλές HTML
- το portal/rendered detail χρησιμοποιεί `description_html` όταν υπάρχει

## 11. Activation Check και provenance
Στο edit/detail view εμφανίζεται operational κατάσταση όπως:
- quality state
- public API image visibility
- text completion
- category completion
- image source completion
- photo provenance / photo lock source

Παραδείγματα provenance:
- `pharmacy295_excel`
- `youpharmacy_xml`

Αυτό βοηθά στο να ξέρει ο operator:
- αν το item είναι publishable
- από πού ήρθε η εικόνα
- αν η εικόνα είναι κλειδωμένη ώστε να μην overwritten από χαμηλότερης ποιότητας source

## 12. Bulk Source Refresh
Η μαζική ανανέωση εμφανίζεται στο `Fix Queue` όταν το φίλτρο είναι `Quality = Needs Fix`.

### Τι κάνει
- χρησιμοποιεί τα τρέχοντα φίλτρα της λίστας
- εφαρμόζει processing limit
- τρέχει background refresh μόνο στα matching items
- μπορεί να χρησιμοποιήσει auto chain ή source overrides ανά κανάλι

### Τι δείχνει
- matched by current filters
- active filters
- selected source overrides
- progress
- updated / skipped / failed
- last barcode
- last finished time

### Controls
Ο operator έχει:
- `Start Bulk Refresh`
- `Stop`
- `Cancel`
- `Restart`

### Operational rule
Το bulk refresh τρέχει server-side.

Άρα:
- μπορείς να κλείσεις τη σελίδα ή τον browser
- η διαδικασία συνεχίζει
- όταν ξαναμπείς, το panel φορτώνει το persisted status

## 13. Quality Review και Go Live
Η quality ροή ξεχωρίζει items σε:
- `Ready`
- `Needs Fix`
- `Ready for Review`

Η τελική λογική είναι:
- `Needs Fix`: λείπει requirement
- `Ready for Review`: structurally complete αλλά ακόμη inactive
- `Approve Go Live`: ο τελικός operator approval για να περάσει live

## 14. Clients
Η ενότητα `Clients` χρησιμοποιείται για:
- διαχείριση customer accounts
- category scope
- API client state
- αποστολή credentials
- έλεγχο τελευταίου endpoint / τελευταίας API πρόσβασης

## 15. Customer Remarks
Η ενότητα `Customer Remarks` είναι η ουρά παρατηρήσεων πελατών.

Εκεί ο admin βλέπει:
- ποιος πελάτης έγραψε
- για ποιο item
- τι έγραψε
- πότε
- σε ποια κατάσταση είναι η παρατήρηση

## 16. Settings
Η ενότητα `Settings` καλύπτει:
- proxy configuration
- API access
- API clients
- mail accounts
- image processing toggles
- XML service
- activation policies

### API Access
Το `API Access` δεν είναι πλέον μόνο δύο toggles.

Πλέον ο admin μπορεί:
- να προσθέσει νέο API
- να δημιουργήσει πραγματικό endpoint
- να κάνει edit σε κάθε endpoint ξεχωριστά
- να επιλέξει ποια fields επιστρέφει το endpoint
- να δει όλα τα διαθέσιμα fields σε λίστα
- να επιλέξει public-only ή internal mode
- να επιτρέψει ή όχι external image URLs

Κανόνες:
- τα built-in endpoints είναι:
  - `/products`
  - `/products_internal`
- κάθε νέο endpoint δημιουργείται ως:
  - `/products/<api_key>`
- το `Edit` ανοίγει όλα τα διαθέσιμα fields για το συγκεκριμένο API
- οι αλλαγές εφαρμόζονται άμεσα

### Image Processing
Το card `Image Processing` ελέγχει το legacy watermark cleanup.

Κανόνας:
- `Enabled`: επιτρέπεται legacy cleanup σε intake/reprocess paths που το χρησιμοποιούν
- `Disabled`: δεν τρέχει watermark cleanup

Προτεινόμενη χρήση:
- άστο `Disabled` όταν δουλεύεις με καθαρές πηγές
- άνοιξέ το μόνο όταν συνειδητά αποδέχεσαι legacy `Ofarmakopoiosmou` image intake ή reprocess

### XML Service
Το `XML Service` δείχνει:
- ενεργοποίηση / απενεργοποίηση XML service
- internal service URL
- public base URL
- configured domains
- last run
- published XML files

Κανόνες UI:
- τα current XML files πρέπει να ξεχωρίζουν από archived/backup files
- τα current files πρέπει να έχουν direct download action

## 17. Placeholder policy
Δεν πρέπει να μένουν ενεργά template placeholders σε production.

Παραδείγματα που δεν επιτρέπονται:
- fake users
- fake message center
- demo branding
- template switchers
- placeholder error-page shells
- Azea / Spruko leftovers σε live shell

## 18. Operational documentation rule
Κάθε αλλαγή που επηρεάζει runtime behavior ή operator workflow πρέπει να ενημερώνει:
- το τεχνικό εγχειρίδιο
- το σχετικό manual

Δεν αντιμετωπίζεται ως προαιρετικό follow-up.
