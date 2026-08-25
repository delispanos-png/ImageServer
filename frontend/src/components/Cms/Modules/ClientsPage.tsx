import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import ModulePage from '../ModulePage';
import { fetchCategories } from '../../../services/cms-catalog';
import {
  bulkDeleteClients,
  createClient,
  deleteClient,
  fetchClient,
  fetchClients,
  resendApiClientCredentials,
  resetTrialUsage,
  revealApiClientPassword,
  updateApiClientCredentials,
  updateClient,
} from '../../../services/cms-clients';
import type { CmsCategory, CmsClient, CmsClientPayload, CmsClientServices, CmsXmlSolutionType } from '../../../types';

const DEFAULT_XML_IMAGE_URL_BASE = 'https://image.cloudon.gr/photos';
const DEFAULT_XML_PHOTO_ROOT = '/app/images';
const DEFAULT_XML_CATEGORY = 'ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΟ > ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΟ > ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΟ';
const DEFAULT_SHOPFLIX_CATEGORY = 'ΠΑΡΑΦΑΡΜΑΚΕΥΤΙΚΟ';

interface ClientFormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  is_active: boolean;
  receive_all_categories: boolean;
  notes: string;
  category_ids: string[];
  services: CmsClientServices;
  is_trial: boolean;
  trial_mode: 'whitelist' | 'quota';
  trial_max_requests: number;
  trial_barcodes_text: string;
  webhook_url: string;
  webhook_secret: string;
  allowed_ips_text: string;
}

function buildDefaultServices(): CmsClientServices {
  return {
    image_service: {
      enabled: true,
    },
    xml_service: {
      enabled: false,
      domain: '',
      solution_type: '',
      function_name: '',
      company: '',
      whouse: 'E-Shop',
      api_key: '',
      site_xml: '',
      old_id_field: '',
      product_url_base: '',
      image_url_base: DEFAULT_XML_IMAGE_URL_BASE,
      photo_root: DEFAULT_XML_PHOTO_ROOT,
      default_category: DEFAULT_XML_CATEGORY,
      shopflix_category: DEFAULT_SHOPFLIX_CATEGORY,
      softone_distribution_channels: '',
      require_web_item: true,
    },
  };
}

function applyXmlSolutionDefaults(solutionType: CmsXmlSolutionType, services: CmsClientServices): CmsClientServices {
  const nextServices: CmsClientServices = {
    image_service: { ...services.image_service },
    xml_service: {
      ...services.xml_service,
      solution_type: solutionType,
      function_name: solutionType === 'no_site' ? 'fast' : solutionType === 'site' ? 'universal' : '',
      whouse: services.xml_service.whouse || 'E-Shop',
      old_id_field:
        services.xml_service.old_id_field || (solutionType === 'no_site' ? 'barcode' : solutionType === 'site' ? 'num05' : ''),
      image_url_base: services.xml_service.image_url_base || DEFAULT_XML_IMAGE_URL_BASE,
      photo_root: services.xml_service.photo_root || DEFAULT_XML_PHOTO_ROOT,
      default_category: services.xml_service.default_category || DEFAULT_XML_CATEGORY,
      shopflix_category: services.xml_service.shopflix_category || DEFAULT_SHOPFLIX_CATEGORY,
      softone_distribution_channels:
        services.xml_service.softone_distribution_channels ||
        (solutionType === 'no_site' ? 'skroutz,shopflix' : solutionType === 'site' ? 'skroutz' : ''),
      require_web_item: solutionType === 'no_site' ? false : solutionType === 'site' ? true : services.xml_service.require_web_item,
    },
  };
  return nextServices;
}

function normalizeClientServices(services?: CmsClientServices): CmsClientServices {
  if (!services) {
    return buildDefaultServices();
  }
  return applyXmlSolutionDefaults(services.xml_service.solution_type, {
    image_service: {
      enabled: services.image_service.enabled,
    },
    xml_service: {
      ...buildDefaultServices().xml_service,
      ...services.xml_service,
    },
  });
}

const initialFormState: ClientFormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  is_active: true,
  receive_all_categories: false,
  notes: '',
  category_ids: [],
  services: buildDefaultServices(),
  is_trial: false,
  trial_mode: 'whitelist',
  trial_max_requests: 300,
  trial_barcodes_text: '',
  webhook_url: '',
  webhook_secret: '',
  allowed_ips_text: '',
};

function parseTrialBarcodes(text: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of (text || '').split(/[\s,;]+/)) {
    const value = raw.trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
}

function formatDate(value: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function statusBadge(isActive: boolean) {
  return <Badge bg={isActive ? 'success' : 'secondary'}>{isActive ? 'Ενεργό' : 'Ανενεργό'}</Badge>;
}

function subscriptionBadge(client: Pick<CmsClient, 'receive_all_categories' | 'assigned_categories_count'>) {
  if (client.receive_all_categories) {
    return <Badge bg="info">Όλες οι κατηγορίες</Badge>;
  }
  return <Badge bg="light" text="dark">{client.assigned_categories_count} κατηγορίες</Badge>;
}

function clientSourceBadge(client: Pick<CmsClient, 'source_type' | 'api_domain'>) {
  if (client.source_type === 'api_basic') {
    return <Badge bg="dark">{client.api_domain || 'API πελάτης'}</Badge>;
  }
  return <Badge bg="light" text="dark">Χειροκίνητο</Badge>;
}

function xmlSolutionLabel(solutionType: CmsXmlSolutionType) {
  if (solutionType === 'site') {
    return 'XML site';
  }
  if (solutionType === 'no_site') {
    return 'XML χωρίς site';
  }
  return 'XML';
}

function servicesSummary(client: Pick<CmsClient, 'services' | 'is_trial'>) {
  return (
    <div className="d-flex flex-wrap gap-2">
      {client.is_trial ? <Badge bg="warning" text="dark">Trial</Badge> : null}
      {client.services.image_service.enabled ? <Badge bg="primary">Εικόνες</Badge> : null}
      {client.services.xml_service.enabled ? <Badge bg="info">{xmlSolutionLabel(client.services.xml_service.solution_type)}</Badge> : null}
    </div>
  );
}

function toPayload(state: ClientFormState): CmsClientPayload {
  return {
    name: state.name.trim(),
    email: state.email.trim(),
    phone: state.phone.trim(),
    company: state.company.trim(),
    is_active: state.is_active,
    receive_all_categories: state.receive_all_categories,
    notes: state.notes.trim(),
    category_ids: state.receive_all_categories ? [] : state.category_ids,
    services: state.services,
    is_trial: state.is_trial,
    trial_mode: state.is_trial ? state.trial_mode : 'whitelist',
    trial_max_requests: Math.max(1, Math.min(100000, Math.floor(state.trial_max_requests || 300))),
    trial_barcodes:
      state.is_trial && state.trial_mode === 'whitelist'
        ? parseTrialBarcodes(state.trial_barcodes_text)
        : [],
    webhook_url: state.webhook_url.trim(),
    webhook_secret: state.webhook_secret.trim(),
    allowed_ips: state.allowed_ips_text
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<CmsClient[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CmsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<'all' | 'all_categories' | 'selected_categories'>('all');
  const [sortBy, setSortBy] = useState<'updated_at' | 'created_at' | 'name' | 'email' | 'company' | 'status' | 'assigned_categories' | 'api_requests' | 'last_api_access_at'>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [pagination, setPagination] = useState({ total: 0, page: 1, per_page: 15, total_pages: 1 });
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingClient, setEditingClient] = useState<CmsClient | null>(null);
  const [detailsClient, setDetailsClient] = useState<CmsClient | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [formError, setFormError] = useState('');
  const [revealedPassword, setRevealedPassword] = useState('');
  const [revealing, setRevealing] = useState(false);
  const [resending, setResending] = useState(false);
  const [resettingTrialUsage, setResettingTrialUsage] = useState(false);
  const [formState, setFormState] = useState<ClientFormState>(initialFormState);
  const [apiUsername, setApiUsername] = useState('');
  const [apiPassword, setApiPassword] = useState('');
  const [generateApiPassword, setGenerateApiPassword] = useState(false);
  const [sendApiEmail, setSendApiEmail] = useState(true);
  const [apiCredentialsSubmitting, setApiCredentialsSubmitting] = useState(false);
  const [apiCredentialsMessage, setApiCredentialsMessage] = useState('');
  const [apiCredentialsError, setApiCredentialsError] = useState('');

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategoryOptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης επιλογών κατηγορίας.');
    }
  };

  const loadClients = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchClients({
        search,
        status_filter: statusFilter,
        subscription_filter: subscriptionFilter,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setClients(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης πελατών.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    void loadClients();
  }, [search, statusFilter, subscriptionFilter, sortBy, sortOrder, page, perPage]);

  const categoryLookup = useMemo(
    () => new Map(categoryOptions.map((category) => [category.id, category.name])),
    [categoryOptions],
  );

  const openCreate = () => {
    setEditingClient(null);
    setFormState({
      ...initialFormState,
      services: buildDefaultServices(),
    });
    setMessage('');
    setApiUsername('');
    setApiPassword('');
    setGenerateApiPassword(false);
    setSendApiEmail(true);
    setApiCredentialsMessage('');
    setApiCredentialsError('');
    setRevealedPassword('');
    setFormError('');
    setShowFormModal(true);
  };

  const openEdit = (client: CmsClient) => {
    setEditingClient(client);
    setFormState({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      is_active: client.is_active,
      receive_all_categories: client.receive_all_categories,
      notes: client.notes,
      category_ids: client.category_ids,
      services: normalizeClientServices(client.services),
      is_trial: Boolean(client.is_trial),
      trial_mode: client.trial_mode === 'quota' ? 'quota' : 'whitelist',
      trial_max_requests: Number(client.trial_max_requests) > 0 ? Number(client.trial_max_requests) : 300,
      trial_barcodes_text: (client.trial_barcodes || []).join('\n'),
      webhook_url: client.webhook_url || '',
      webhook_secret: client.webhook_secret || '',
      allowed_ips_text: (client.allowed_ips || []).join('\n'),
    });
    setMessage('');
    setApiUsername(client.api_username || '');
    setApiPassword('');
    setGenerateApiPassword(false);
    setSendApiEmail(Boolean(client.email));
    setApiCredentialsMessage('');
    setApiCredentialsError('');
    setRevealedPassword('');
    setFormError('');
    setShowFormModal(true);
  };

  const openDetails = async (clientId: string) => {
    setShowDetailsModal(true);
    setDetailsLoading(true);
    setDetailsClient(null);
    try {
      setDetailsClient(await fetchClient(clientId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης στοιχείων πελάτη.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError('');
    setMessage('');
    try {
      if (editingClient) {
        await updateClient(editingClient.id, toPayload(formState));
        setMessage('Ο πελάτης ενημερώθηκε.');
      } else {
        await createClient(toPayload(formState));
        setMessage('Ο πελάτης δημιουργήθηκε.');
      }
      setShowFormModal(false);
      await loadClients();
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Αποτυχία αποθήκευσης πελάτη.';
      const friendly = /email already exists/i.test(raw)
        ? 'Υπάρχει ήδη πελάτης με αυτό το email. Άλλαξε το email ή διέγραψε τον υπάρχοντα πελάτη.'
        : /xml domain already exists/i.test(raw)
          ? 'Υπάρχει ήδη πελάτης με αυτό το XML domain.'
          : /api username already exists/i.test(raw)
            ? 'Το API username χρησιμοποιείται ήδη από άλλο πελάτη.'
            : raw;
      setFormError(friendly);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === clients.length && clients.length > 0) return new Set();
      return new Set(clients.map((c) => c.id));
    });
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.size) return;
    const confirmed = window.confirm(
      `Διαγραφή ${selectedIds.size} επιλεγμένων πελατών;\nΗ ενέργεια είναι μη αναστρέψιμη.`,
    );
    if (!confirmed) return;
    setBulkDeleting(true);
    setError('');
    setMessage('');
    try {
      const result = await bulkDeleteClients(Array.from(selectedIds));
      setMessage(`Διαγράφηκαν ${result.deleted_count} πελάτες.`);
      setSelectedIds(new Set());
      await loadClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία μαζικής διαγραφής.');
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleDeleteClient = async (client: CmsClient) => {
    const confirmed = window.confirm(
      `Διαγραφή πελάτη "${client.name}";\nΗ ενέργεια είναι μη αναστρέψιμη. Το API username "${client.api_username || '-'}" θα πάψει να λειτουργεί άμεσα.`,
    );
    if (!confirmed) return;
    setDeletingId(client.id);
    setError('');
    setMessage('');
    try {
      await deleteClient(client.id);
      setMessage(`Ο πελάτης "${client.name}" διαγράφηκε.`);
      if (editingClient?.id === client.id) {
        setShowFormModal(false);
        setEditingClient(null);
      }
      await loadClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία διαγραφής πελάτη.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRevealPassword = async () => {
    if (!editingClient) return;
    setRevealing(true);
    setApiCredentialsError('');
    try {
      const result = await revealApiClientPassword(editingClient.id);
      if (result.password) {
        setRevealedPassword(result.password);
        setApiCredentialsMessage(`Τρέχων κωδικός: ${result.password}`);
      } else {
        setApiCredentialsError(result.detail || 'Δεν υπάρχει αποθηκευμένος κωδικός.');
      }
    } catch (err) {
      setApiCredentialsError(err instanceof Error ? err.message : 'Αποτυχία εμφάνισης κωδικού.');
    } finally {
      setRevealing(false);
    }
  };

  const handleResendCredentials = async () => {
    if (!editingClient) return;
    setResending(true);
    setApiCredentialsError('');
    setApiCredentialsMessage('');
    try {
      const result = await resendApiClientCredentials(editingClient.id);
      if (result.email_sent) {
        setApiCredentialsMessage(`Τα στοιχεία στάλθηκαν στο ${result.email}.`);
      } else {
        setApiCredentialsError(`Αποτυχία αποστολής email: ${result.email_error || 'άγνωστο σφάλμα'}`);
      }
    } catch (err) {
      setApiCredentialsError(err instanceof Error ? err.message : 'Αποτυχία αποστολής στοιχείων.');
    } finally {
      setResending(false);
    }
  };

  const handleResetTrialUsage = async () => {
    if (!editingClient) return;
    const confirmed = window.confirm(
      `Μηδενισμός μετρητή κλήσεων για τον "${editingClient.name}"; ο πελάτης θα έχει ξανά full quota.`,
    );
    if (!confirmed) return;
    setResettingTrialUsage(true);
    setApiCredentialsError('');
    setApiCredentialsMessage('');
    try {
      const result = await resetTrialUsage(editingClient.id);
      setApiCredentialsMessage(`Μηδενισμός επιτυχής. Προηγούμενο: ${result.previous_count} κλήσεις.`);
      await loadClients();
      setEditingClient((prev) => (prev ? { ...prev, api_request_count: 0 } : prev));
    } catch (err) {
      setApiCredentialsError(err instanceof Error ? err.message : 'Αποτυχία μηδενισμού.');
    } finally {
      setResettingTrialUsage(false);
    }
  };

  const handleApiCredentialsSubmit = async () => {
    if (!editingClient) {
      return;
    }
    setApiCredentialsSubmitting(true);
    setApiCredentialsError('');
    setApiCredentialsMessage('');
    try {
      const result = await updateApiClientCredentials(editingClient.id, {
        api_username: apiUsername.trim(),
        password: apiPassword,
        generate_password: generateApiPassword,
        send_email: sendApiEmail,
      });
      setEditingClient(result.data);
      setApiUsername(result.data.api_username || '');
      setApiPassword('');
      setGenerateApiPassword(false);
      if (result.credentials.generated_password) {
        setRevealedPassword(result.credentials.generated_password);
      }
      await loadClients();
      const emailStatus = result.credentials.generated_password
        ? result.credentials.email_sent
          ? ' | Στάλθηκε email.'
          : (result.credentials as { email_error?: string }).email_error
            ? ` | Email απέτυχε: ${(result.credentials as { email_error?: string }).email_error}`
            : ''
        : '';
      setApiCredentialsMessage(
        result.credentials.generated_password
          ? `Username: ${result.credentials.api_username} | Νέος κωδικός: ${result.credentials.generated_password}${emailStatus}`
          : `Το API username ενημερώθηκε σε ${result.credentials.api_username}.`,
      );
    } catch (err) {
      setApiCredentialsError(err instanceof Error ? err.message : 'Αποτυχία ενημέρωσης διαπιστευτηρίων API.');
    } finally {
      setApiCredentialsSubmitting(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFormState((previous) => {
      const exists = previous.category_ids.includes(categoryId);
      return {
        ...previous,
        category_ids: exists
          ? previous.category_ids.filter((id) => id !== categoryId)
          : [...previous.category_ids, categoryId],
      };
    });
  };

  const pages: React.ReactNode[] = [];
  for (let index = 1; index <= pagination.total_pages; index += 1) {
    pages.push(
      <Pagination.Item key={index} active={index === pagination.page} onClick={() => setPage(index)}>
        {index}
      </Pagination.Item>,
    );
  }

  const activeFilterCount = [
    Boolean(search.trim()),
    statusFilter !== 'all',
    subscriptionFilter !== 'all',
  ].filter(Boolean).length;

  const moduleMetrics = [
    {
      label: 'Φιλτραρισμένες Εγγραφές',
      value: pagination.total.toLocaleString(),
      helper: 'Πελάτες που ταιριάζουν στα φίλτρα',
      tone: 'primary' as const,
    },
    {
      label: 'Ενεργά Φίλτρα',
      value: activeFilterCount,
      helper: activeFilterCount ? 'Αναζήτηση, κατάσταση ή συνδρομή σε φίλτρα' : 'Προβολή όλων των πελατών',
      tone: activeFilterCount ? ('warning' as const) : ('info' as const),
    },
    {
      label: 'Σελίδα',
      value: `${pagination.page}/${Math.max(pagination.total_pages, 1)}`,
      helper: `${perPage} ανά σελίδα`,
      tone: 'success' as const,
    },
  ];

  return (
    <ModulePage
      title="Πελάτες"
      description="Λογαριασμοί πελατών με κανόνες κατηγοριών, στοιχεία επικοινωνίας και έλεγχο κατάστασης."
      metrics={moduleMetrics}
    >
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}

      <Row className="mb-4 g-3 align-items-end">
        <Col xl={3} md={6}>
          <Form.Label>Αναζήτηση</Form.Label>
          <Form.Control
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            placeholder="Όνομα, email, τηλέφωνο, εταιρεία"
          />
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>Κατάσταση</Form.Label>
          <Form.Select
            value={statusFilter}
            onChange={(event) => {
              setPage(1);
              setStatusFilter(event.target.value as 'all' | 'active' | 'inactive');
            }}
          >
            <option value="all">Όλα</option>
            <option value="active">Ενεργά</option>
            <option value="inactive">Ανενεργά</option>
          </Form.Select>
        </Col>
        <Col xl={3} md={6}>
          <Form.Label>Συνδρομή</Form.Label>
          <Form.Select
            value={subscriptionFilter}
            onChange={(event) => {
              setPage(1);
              setSubscriptionFilter(event.target.value as 'all' | 'all_categories' | 'selected_categories');
            }}
          >
            <option value="all">Όλα</option>
            <option value="all_categories">Όλες οι κατηγορίες</option>
            <option value="selected_categories">Επιλεγμένες κατηγορίες</option>
          </Form.Select>
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>Ταξινόμηση</Form.Label>
          <Form.Select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
            <option value="updated_at">Ενημερώθηκε</option>
            <option value="created_at">Δημιουργήθηκε</option>
            <option value="name">Όνομα</option>
            <option value="email">Email</option>
            <option value="company">Εταιρεία</option>
            <option value="status">Κατάσταση</option>
            <option value="assigned_categories">Κατηγορίες</option>
            <option value="api_requests">Αιτήματα API</option>
            <option value="last_api_access_at">Τελευταία πρόσβαση API</option>
          </Form.Select>
        </Col>
        <Col xl={1} md={6}>
          <Form.Label>Σειρά</Form.Label>
          <Form.Select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as 'asc' | 'desc')}>
            <option value="desc">Φθίνουσα</option>
            <option value="asc">Αύξουσα</option>
          </Form.Select>
        </Col>
        <Col xl={1} md={6} className="text-md-end">
          <Button onClick={openCreate}>Νέος</Button>
        </Col>
      </Row>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Card.Title>Λίστα Πελατών</Card.Title>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted fs-13">Ανά σελίδα</span>
            <Form.Select
              style={{ width: 100 }}
              value={perPage}
              onChange={(event) => {
                setPage(1);
                setPerPage(Number(event.target.value));
              }}
            >
              {[15, 25, 50].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <>
              {selectedIds.size > 0 ? (
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fs-13">{selectedIds.size} επιλεγμένοι</span>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => void handleBulkDelete()}
                    disabled={bulkDeleting}
                  >
                    {bulkDeleting ? 'Διαγραφή...' : 'Μαζική διαγραφή'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => setSelectedIds(new Set())}
                    disabled={bulkDeleting}
                  >
                    Καθαρισμός επιλογής
                  </Button>
                </div>
              ) : null}
              <Table responsive className="table table-striped mb-3 align-middle">
                <thead>
                  <tr>
                    <th style={{ width: 32 }}>
                      <Form.Check
                        type="checkbox"
                        checked={clients.length > 0 && selectedIds.size === clients.length}
                        ref={(el: HTMLInputElement | null) => {
                          if (el) {
                            el.indeterminate = selectedIds.size > 0 && selectedIds.size < clients.length;
                          }
                        }}
                        onChange={toggleSelectAll}
                        aria-label="Επιλογή όλων"
                      />
                    </th>
                    <th>Όνομα</th>
                    <th>Πηγή</th>
                    <th>Υπηρεσίες</th>
                    <th>Email</th>
                    <th>Τηλέφωνο</th>
                    <th>Κατάσταση</th>
                    <th>Κατηγορίες</th>
                    <th>Τελευταία πρόσβαση API</th>
                    <th>Ενημερώθηκε</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.length ? (
                    clients.map((client) => (
                      <tr key={client.id} className={selectedIds.has(client.id) ? 'table-active' : ''}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedIds.has(client.id)}
                            onChange={() => toggleSelect(client.id)}
                            aria-label={`Επιλογή ${client.name}`}
                          />
                        </td>
                        <td>
                          <div className="fw-semibold">{client.name}</div>
                          <div className="text-muted fs-12">{client.company || 'Χωρίς εταιρεία'}</div>
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {clientSourceBadge(client)}
                            {client.api_username ? <span className="text-muted fs-12">{client.api_username}</span> : null}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {servicesSummary(client)}
                            {client.services.xml_service.enabled && client.services.xml_service.domain ? (
                              <span className="text-muted fs-12">{client.services.xml_service.domain}</span>
                            ) : null}
                          </div>
                        </td>
                        <td>{client.email || '-'}</td>
                        <td>{client.phone || '-'}</td>
                        <td>{statusBadge(client.is_active)}</td>
                        <td>{subscriptionBadge(client)}</td>
                        <td>
                          <div className="fw-semibold">{formatDate(client.last_api_access_at)}</div>
                          <div className="text-muted fs-12">
                            {client.api_request_count} αιτ{client.api_request_count === 1 ? '' : 'ήματα'}
                            {client.last_api_ip ? ` · ${client.last_api_ip}` : ''}
                          </div>
                        </td>
                        <td>{formatDate(client.updated_at)}</td>
                        <td>
                          <Dropdown align="end">
                            <Dropdown.Toggle
                              size="sm"
                              variant="outline-secondary"
                              disabled={deletingId === client.id}
                            >
                              {deletingId === client.id ? 'Διαγραφή...' : 'Ενέργειες'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => void openDetails(client.id)}>
                                Λεπτομέρειες
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => openEdit(client)}>
                                Επεξεργασία
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => void handleDeleteClient(client)}
                              >
                                Διαγραφή
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="text-center text-muted py-4">
                        Δεν βρέθηκαν πελάτες.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span className="text-muted fs-13">
                  Σελίδα {pagination.page} από {pagination.total_pages} | Σύνολο {pagination.total}
                </span>
                <Pagination className="mb-0">{pages}</Pagination>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingClient ? 'Επεξεργασία Πελάτη' : 'Νέος Πελάτης'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {formError ? (
              <Alert variant="danger" onClose={() => setFormError('')} dismissible className="mb-3">
                {formError}
              </Alert>
            ) : null}
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Όνομα</Form.Label>
                <Form.Control
                  required
                  value={formState.name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Εταιρεία</Form.Label>
                <Form.Control
                  value={formState.company}
                  onChange={(event) => setFormState((prev) => ({ ...prev, company: event.target.value }))}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formState.email}
                  onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Τηλέφωνο</Form.Label>
                <Form.Control
                  value={formState.phone}
                  onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="client-active-toggle"
                  label="Ο πελάτης είναι ενεργός"
                  checked={formState.is_active}
                  onChange={(event) => setFormState((prev) => ({ ...prev, is_active: event.target.checked }))}
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="client-all-categories-toggle"
                  label="Λήψη ενημερώσεων για όλες τις κατηγορίες"
                  checked={formState.receive_all_categories}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      receive_all_categories: event.target.checked,
                      category_ids: event.target.checked ? [] : prev.category_ids,
                    }))
                  }
                />
              </Col>
              <Col md={12}>
                <Form.Label>Σημειώσεις</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formState.notes}
                  onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
                />
              </Col>
              <Col md={12}>
                <Form.Label>Κατηγορίες Πελάτη</Form.Label>
                <div className="border rounded p-3" style={{ maxHeight: 220, overflowY: 'auto' }}>
                  {formState.receive_all_categories ? (
                    <div className="text-muted">Όλες οι κατηγορίες είναι ενεργές για τον πελάτη.</div>
                  ) : categoryOptions.length ? (
                    categoryOptions.map((category) => (
                      <Form.Check
                        key={category.id}
                        type="checkbox"
                        id={`client-category-${category.id}`}
                        label={category.name}
                        checked={formState.category_ids.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="mb-2"
                      />
                    ))
                  ) : (
                    <div className="text-muted">Δεν υπάρχουν διαθέσιμες κατηγορίες.</div>
                  )}
                </div>
              </Col>
              <Col md={12}>
                <Card className="border">
                  <Card.Header>
                    <Card.Title>Υπηρεσίες</Card.Title>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column gap-3">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Check
                          type="switch"
                          id="client-image-service-toggle"
                          label="Η υπηρεσία εικόνων είναι ενεργή για τον πελάτη"
                          checked={formState.services.image_service.enabled}
                          onChange={(event) =>
                            setFormState((prev) => ({
                              ...prev,
                              services: {
                                ...prev.services,
                                image_service: {
                                  enabled: event.target.checked,
                                },
                              },
                            }))
                          }
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Check
                          type="switch"
                          id="client-xml-service-toggle"
                          label="Η υπηρεσία XML είναι ενεργή για τον πελάτη"
                          checked={formState.services.xml_service.enabled}
                          onChange={(event) =>
                            setFormState((prev) => ({
                              ...prev,
                              services: applyXmlSolutionDefaults(
                                event.target.checked
                                  ? (prev.services.xml_service.solution_type || 'site')
                                  : prev.services.xml_service.solution_type,
                                {
                                  ...prev.services,
                                  xml_service: {
                                    ...prev.services.xml_service,
                                    enabled: event.target.checked,
                                  },
                                },
                              ),
                            }))
                          }
                        />
                      </Col>
                      {formState.services.xml_service.enabled ? (
                        <>
                          <Col md={4}>
                            <Form.Label>XML domain</Form.Label>
                            <Form.Control
                              value={formState.services.xml_service.domain}
                              onChange={(event) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  services: {
                                    ...prev.services,
                                    xml_service: {
                                      ...prev.services.xml_service,
                                      domain: event.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="youpharmacy"
                            />
                          </Col>
                          <Col md={4}>
                            <Form.Label>Λύση XML</Form.Label>
                            <Form.Select
                              value={formState.services.xml_service.solution_type}
                              onChange={(event) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  services: applyXmlSolutionDefaults(
                                    event.target.value as CmsXmlSolutionType,
                                    prev.services,
                                  ),
                                }))
                              }
                            >
                              <option value="">Επιλογή λύσης XML</option>
                              <option value="site">Ο πελάτης έχει site</option>
                              <option value="no_site">Ο πελάτης δεν έχει site</option>
                            </Form.Select>
                          </Col>
                          <Col md={4}>
                            <Form.Label>XML Εταιρεία</Form.Label>
                            <Form.Control
                              value={formState.services.xml_service.company}
                              onChange={(event) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  services: {
                                    ...prev.services,
                                    xml_service: {
                                      ...prev.services.xml_service,
                                      company: event.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="1001"
                            />
                          </Col>
                          <Col md={6}>
                            <Form.Label>XML Αποθήκη</Form.Label>
                            <Form.Control
                              value={formState.services.xml_service.whouse}
                              onChange={(event) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  services: {
                                    ...prev.services,
                                    xml_service: {
                                      ...prev.services.xml_service,
                                      whouse: event.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="E-Shop"
                            />
                          </Col>
                          <Col md={6}>
                            <Form.Label>Κλειδί SoftOne API</Form.Label>
                            <Form.Control
                              value={formState.services.xml_service.api_key}
                              onChange={(event) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  services: {
                                    ...prev.services,
                                    xml_service: {
                                      ...prev.services.xml_service,
                                      api_key: event.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder="SoftOne API key"
                            />
                          </Col>
                          <Col md={6}>
                            <Form.Label>Πεδίο Old ID</Form.Label>
                            <Form.Control
                              value={formState.services.xml_service.old_id_field}
                              onChange={(event) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  services: {
                                    ...prev.services,
                                    xml_service: {
                                      ...prev.services.xml_service,
                                      old_id_field: event.target.value,
                                    },
                                  },
                                }))
                              }
                              placeholder={formState.services.xml_service.solution_type === 'no_site' ? 'barcode' : 'num05'}
                            />
                          </Col>
                          <Col md={6}>
                            <div className="border rounded p-3 h-100">
                              <div className="text-muted fs-12 mb-1">Επιλεγμένος connector</div>
                              <div className="fw-semibold">
                                {formState.services.xml_service.function_name || '-'}
                              </div>
                              <div className="text-muted fs-12 mt-2">
                                {formState.services.xml_service.solution_type === 'site'
                                  ? 'Οι πελάτες με site χρησιμοποιούν το site export flow.'
                                  : formState.services.xml_service.solution_type === 'no_site'
                                    ? 'Οι πελάτες χωρίς site χρησιμοποιούν το legacy marketplace flow.'
                                    : 'Επέλεξε πρώτα τύπο λύσης XML.'}
                              </div>
                            </div>
                          </Col>
                          {formState.services.xml_service.solution_type === 'site' ? (
                            <Col md={12}>
                              <Form.Label>URL XML Site</Form.Label>
                              <Form.Control
                                value={formState.services.xml_service.site_xml}
                                onChange={(event) =>
                                  setFormState((prev) => ({
                                    ...prev,
                                    services: {
                                      ...prev.services,
                                      xml_service: {
                                        ...prev.services.xml_service,
                                        site_xml: event.target.value,
                                      },
                                    },
                                  }))
                                }
                                placeholder="https://www.example.gr/export.xml"
                              />
                            </Col>
                          ) : null}
                          {formState.services.xml_service.solution_type === 'no_site' ? (
                            <>
                              <Col md={4}>
                                <Form.Label>Βάση URL Προϊόντος</Form.Label>
                                <Form.Control
                                  value={formState.services.xml_service.product_url_base}
                                  onChange={(event) =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      services: {
                                        ...prev.services,
                                        xml_service: {
                                          ...prev.services.xml_service,
                                          product_url_base: event.target.value,
                                        },
                                      },
                                    }))
                                  }
                                  placeholder="https://domain.gr"
                                />
                              </Col>
                              <Col md={4}>
                                <Form.Label>Βάση URL Εικόνων</Form.Label>
                                <Form.Control
                                  value={formState.services.xml_service.image_url_base}
                                  onChange={(event) =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      services: {
                                        ...prev.services,
                                        xml_service: {
                                          ...prev.services.xml_service,
                                          image_url_base: event.target.value,
                                        },
                                      },
                                    }))
                                  }
                                  placeholder={DEFAULT_XML_IMAGE_URL_BASE}
                                />
                              </Col>
                          <Col md={4}>
                            <Form.Label>Ρίζα φωτογραφιών</Form.Label>
                                <Form.Control
                                  value={formState.services.xml_service.photo_root}
                                  onChange={(event) =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      services: {
                                        ...prev.services,
                                        xml_service: {
                                          ...prev.services.xml_service,
                                          photo_root: event.target.value,
                                        },
                                      },
                                    }))
                                  }
                                  placeholder={DEFAULT_XML_PHOTO_ROOT}
                                />
                              </Col>
                              <Col md={6}>
                                <Form.Label>Προεπιλεγμένη Κατηγορία</Form.Label>
                                <Form.Control
                                  value={formState.services.xml_service.default_category}
                                  onChange={(event) =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      services: {
                                        ...prev.services,
                                        xml_service: {
                                          ...prev.services.xml_service,
                                          default_category: event.target.value,
                                        },
                                      },
                                    }))
                                  }
                                />
                              </Col>
                              <Col md={6}>
                                <Form.Label>Κατηγορία Shopflix</Form.Label>
                                <Form.Control
                                  value={formState.services.xml_service.shopflix_category}
                                  onChange={(event) =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      services: {
                                        ...prev.services,
                                        xml_service: {
                                          ...prev.services.xml_service,
                                          shopflix_category: event.target.value,
                                        },
                                      },
                                    }))
                                  }
                                />
                              </Col>
                              <Col md={6}>
                                <Form.Label>Κανάλια Διανομής</Form.Label>
                                <Form.Control
                                  value={formState.services.xml_service.softone_distribution_channels}
                                  onChange={(event) =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      services: {
                                        ...prev.services,
                                        xml_service: {
                                          ...prev.services.xml_service,
                                          softone_distribution_channels: event.target.value,
                                        },
                                      },
                                    }))
                                  }
                                  placeholder="skroutz,shopflix"
                                />
                              </Col>
                              <Col md={6}>
                                <Form.Check
                                  type="switch"
                                  id="client-xml-require-web-item-toggle"
                                  label="Απαίτηση web_item στα SoftOne φίλτρα"
                                  checked={formState.services.xml_service.require_web_item}
                                  onChange={(event) =>
                                    setFormState((prev) => ({
                                      ...prev,
                                      services: {
                                        ...prev.services,
                                        xml_service: {
                                          ...prev.services.xml_service,
                                          require_web_item: event.target.checked,
                                        },
                                      },
                                    }))
                                  }
                                />
                              </Col>
                            </>
                          ) : null}
                        </>
                      ) : (
                        <Col md={12}>
                          <div className="text-muted">
                            Ενεργοποίησε την υπηρεσία XML αν ο πελάτης πρέπει να λαμβάνει XML μέσω της ξεχωριστής υπηρεσίας.
                          </div>
                        </Col>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12}>
                <Card className="border">
                  <Card.Header>
                    <Card.Title>Δοκιμαστική πρόσβαση</Card.Title>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column gap-3">
                    <Form.Check
                      type="switch"
                      id="client-is-trial-toggle"
                      label="Δοκιμαστικός πελάτης (μόνο /products/trial)"
                      checked={formState.is_trial}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, is_trial: event.target.checked }))
                      }
                    />
                    {formState.is_trial ? (
                      <>
                        <div className="d-flex flex-wrap gap-3">
                          <Form.Check
                            type="radio"
                            id="trial-mode-whitelist"
                            name="trial-mode"
                            label="Συγκεκριμένα barcodes"
                            checked={formState.trial_mode === 'whitelist'}
                            onChange={() => setFormState((prev) => ({ ...prev, trial_mode: 'whitelist' }))}
                          />
                          <Form.Check
                            type="radio"
                            id="trial-mode-quota"
                            name="trial-mode"
                            label="Όριο κλήσεων (όπως production)"
                            checked={formState.trial_mode === 'quota'}
                            onChange={() => setFormState((prev) => ({ ...prev, trial_mode: 'quota' }))}
                          />
                        </div>
                        {formState.trial_mode === 'whitelist' ? (
                          <>
                            <Form.Label className="mb-0">Επιτρεπόμενα barcodes (ένα ανά γραμμή ή με κόμμα)</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={6}
                              value={formState.trial_barcodes_text}
                              onChange={(event) =>
                                setFormState((prev) => ({ ...prev, trial_barcodes_text: event.target.value }))
                              }
                              placeholder="5201234567890&#10;5209876543210"
                            />
                            <div className="text-muted fs-12">
                              Ο πελάτης θα παίρνει μόνο τα barcodes της λίστας. Αν ζητήσει άλλο, θα του επιστραφεί κενή απάντηση.
                            </div>
                          </>
                        ) : (
                          <>
                            <Form.Label className="mb-0">Μέγιστο πλήθος κλήσεων</Form.Label>
                            <Form.Control
                              type="number"
                              min={1}
                              max={100000}
                              value={formState.trial_max_requests}
                              onChange={(event) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  trial_max_requests: Number(event.target.value) || 300,
                                }))
                              }
                              style={{ maxWidth: 160 }}
                            />
                            {editingClient ? (
                              <div className="d-flex align-items-center flex-wrap gap-2">
                                <span className="text-muted fs-12">
                                  Έχουν χρησιμοποιηθεί {editingClient.api_request_count} / {formState.trial_max_requests} κλήσεις.
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline-warning"
                                  onClick={() => void handleResetTrialUsage()}
                                  disabled={resettingTrialUsage || editingClient.api_request_count === 0}
                                >
                                  {resettingTrialUsage ? 'Μηδενισμός...' : 'Μηδενισμός μετρητή'}
                                </Button>
                              </div>
                            ) : null}
                            <div className="text-muted fs-12">
                              Ο πελάτης μπορεί να ζητάει οποιοδήποτε barcode (όπως το /products της παραγωγής).
                              Όταν φτάσει το όριο κλήσεων, το /products/trial επιστρέφει 429.
                            </div>
                          </>
                        )}
                        <div className="text-muted fs-12">
                          Το /products και τα custom endpoints επιστρέφουν 403 για δοκιμαστικούς πελάτες.
                        </div>
                      </>
                    ) : (
                      <div className="text-muted fs-13">
                        Ενεργοποίησέ το για να δώσεις περιορισμένα δοκιμαστικά credentials. Διάλεξε συγκεκριμένα barcodes ή Ν τυχαία ενεργά προϊόντα ανά κλήση.
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12}>
                <Card className="custom-card">
                  <Card.Header className="border-bottom-0">
                    <Card.Title>Webhooks</Card.Title>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column gap-3">
                    <div>
                      <Form.Label className="mb-0">Webhook URL</Form.Label>
                      <Form.Control
                        value={formState.webhook_url}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, webhook_url: event.target.value }))
                        }
                        placeholder="https://your-site.com/api/cloudon-webhook"
                      />
                      <div className="text-muted fs-12 mt-1">
                        Όταν ένα barcode που είχε ζητήσει αυτός ο πελάτης γίνει διαθέσιμο στη βάση, στέλνουμε POST event &quot;barcode.available&quot;.
                      </div>
                    </div>
                    <div>
                      <Form.Label className="mb-0">Webhook Secret (προαιρετικό)</Form.Label>
                      <Form.Control
                        type="password"
                        value={formState.webhook_secret}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, webhook_secret: event.target.value }))
                        }
                        placeholder="Shared secret for HMAC-SHA256 signature"
                      />
                      <div className="text-muted fs-12 mt-1">
                        Αν συμπληρωθεί, κάθε POST έρχεται με header <code>X-Cloudon-Signature</code> = HMAC-SHA256(body, secret).
                      </div>
                    </div>
                    <div>
                      <Form.Label className="mb-0 d-flex justify-content-between align-items-center">
                        <span>Επιτρεπόμενες IPs (whitelist)</span>
                        {formState.allowed_ips_text.trim() ? (
                          <Badge bg="success">Ενεργό</Badge>
                        ) : (
                          <Badge bg="secondary">Ανοιχτό — δέχεται από παντού</Badge>
                        )}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={formState.allowed_ips_text}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, allowed_ips_text: event.target.value }))
                        }
                        placeholder={"1.2.3.4\n10.0.0.0/24\n2001:db8::/32"}
                        style={{ fontFamily: 'monospace', fontSize: 13 }}
                      />
                      <div className="text-muted fs-12 mt-1">
                        Μία ανά γραμμή (ή comma/space-separated). Δέχεται μεμονωμένες IPv4/IPv6 και CIDR blocks (π.χ. <code>10.0.0.0/8</code>).
                        Αν είναι κενό, το API δέχεται από <em>οποιαδήποτε</em> IP. Αν υπάρχουν εγγραφές, μόνο αυτές — τα υπόλοιπα requests παίρνουν HTTP 403.
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              {editingClient
                && (editingClient.source_type === 'api_basic'
                  || formState.services.image_service.enabled
                  || formState.is_trial) ? (
                <Col md={12}>
                  <Card className="border">
                    <Card.Header>
                      <Card.Title>Διαπιστευτήρια API</Card.Title>
                    </Card.Header>
                    <Card.Body className="d-flex flex-column gap-3">
                      {apiCredentialsError ? <Alert variant="danger" className="mb-0">{apiCredentialsError}</Alert> : null}
                      {apiCredentialsMessage ? <Alert variant="success" className="mb-0">{apiCredentialsMessage}</Alert> : null}
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Label>Όνομα χρήστη API</Form.Label>
                          <Form.Control
                            value={apiUsername}
                            onChange={(event) => setApiUsername(event.target.value)}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label>Email πελάτη</Form.Label>
                          <Form.Control value={formState.email || '-'} disabled />
                        </Col>
                        <Col md={6}>
                          <Form.Label>Νέος κωδικός API</Form.Label>
                          <Form.Control
                            type="text"
                            autoComplete="off"
                            value={apiPassword}
                            onChange={(event) => {
                              setApiPassword(event.target.value);
                              if (event.target.value && generateApiPassword) {
                                setGenerateApiPassword(false);
                              }
                            }}
                            placeholder="Πληκτρολόγησε κωδικό ή άναψε αυτόματη δημιουργία"
                          />
                          <div className="text-muted fs-12 mt-1">
                            Πληκτρολόγησε δικό σου κωδικό ή χρησιμοποίησε την αυτόματη δημιουργία.
                          </div>
                          {revealedPassword ? (
                            <div className="border rounded p-2 mt-2 bg-light">
                              <div className="text-muted fs-12 mb-1">Τρέχων κωδικός:</div>
                              <code className="user-select-all" style={{ wordBreak: 'break-all' }}>{revealedPassword}</code>
                            </div>
                          ) : null}
                        </Col>
                        <Col md={6}>
                          <div className="border rounded p-3 h-100 d-flex flex-column gap-2">
                            <div>
                              <div className="text-muted fs-12 mb-1">Κατάσταση κωδικού</div>
                              <div className="fw-semibold">{editingClient.password_configured ? 'Ρυθμισμένος' : 'Δεν έχει οριστεί'}</div>
                              <div className="text-muted fs-12 mt-1">
                                Τελευταία αλλαγή: {formatDate(editingClient.password_last_rotated_at)}
                              </div>
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-auto">
                              <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={() => void handleRevealPassword()}
                                disabled={!editingClient.password_configured || revealing}
                              >
                                {revealing ? 'Φόρτωση...' : 'Δείξε τρέχοντα κωδικό'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => void handleResendCredentials()}
                                disabled={!editingClient.password_configured || !formState.email || resending}
                              >
                                {resending ? 'Αποστολή...' : 'Αποστολή στο email'}
                              </Button>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <Form.Check
                            type="switch"
                            id="client-generate-api-password"
                            label="Αυτόματη δημιουργία ασφαλούς κωδικού"
                            checked={generateApiPassword}
                            onChange={(event) => {
                              setGenerateApiPassword(event.target.checked);
                              if (event.target.checked) {
                                setApiPassword('');
                              }
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Check
                            type="switch"
                            id="client-send-api-email"
                            label="Αποστολή νέων στοιχείων στο email πελάτη"
                            checked={sendApiEmail}
                            onChange={(event) => setSendApiEmail(event.target.checked)}
                            disabled={!formState.email}
                          />
                        </Col>
                      </Row>
                      <div>
                        <Button type="button" variant="outline-primary" onClick={() => void handleApiCredentialsSubmit()} disabled={apiCredentialsSubmitting}>
                          {apiCredentialsSubmitting ? 'Ενημέρωση...' : 'Ενημέρωση Διαπιστευτηρίων API'}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ) : null}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowFormModal(false)}>
              Ακύρωση
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Αποθήκευση...' : editingClient ? 'Αποθήκευση Αλλαγών' : 'Δημιουργία Πελάτη'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Λεπτομέρειες Πελάτη</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailsLoading ? (
            <Spinner animation="border" size="sm" />
          ) : detailsClient ? (
            <Row className="g-4">
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <Card.Title>Προφίλ</Card.Title>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column gap-2">
                    <div><strong>Όνομα:</strong> {detailsClient.name || '-'}</div>
                    <div><strong>Εταιρεία:</strong> {detailsClient.company || '-'}</div>
                    <div><strong>Email:</strong> {detailsClient.email || '-'}</div>
                    <div><strong>Τηλέφωνο:</strong> {detailsClient.phone || '-'}</div>
                    <div><strong>Κατάσταση:</strong> {statusBadge(detailsClient.is_active)}</div>
                    <div><strong>Πηγή:</strong> {clientSourceBadge(detailsClient)}</div>
                    <div><strong>Υπηρεσίες:</strong> {servicesSummary(detailsClient)}</div>
                    <div><strong>XML domain:</strong> {detailsClient.services.xml_service.domain || '-'}</div>
                    <div><strong>Λύση XML:</strong> {xmlSolutionLabel(detailsClient.services.xml_service.solution_type)}</div>
                    <div><strong>Όνομα χρήστη API:</strong> {detailsClient.api_username || '-'}</div>
                    <div><strong>API domain:</strong> {detailsClient.api_domain || '-'}</div>
                    <div><strong>Κωδικός ρυθμισμένος:</strong> {detailsClient.password_configured ? 'Ναι' : 'Όχι'}</div>
                    <div><strong>Τελευταία αλλαγή κωδικού:</strong> {formatDate(detailsClient.password_last_rotated_at)}</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>
                    <Card.Title>Συνδρομή</Card.Title>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column gap-2">
                    <div>
                      <strong>Τύπος:</strong>{' '}
                      {detailsClient.receive_all_categories ? 'Όλες οι κατηγορίες' : 'Επιλεγμένες κατηγορίες'}
                    </div>
                    <div>
                      <strong>Πλήθος:</strong> {detailsClient.assigned_categories_count}
                    </div>
                    <div>
                      <strong>Κατηγορίες:</strong>
                      <div className="mt-2 d-flex flex-wrap gap-2">
                        {detailsClient.receive_all_categories ? (
                          <Badge bg="info">Όλες οι κατηγορίες</Badge>
                        ) : detailsClient.assigned_categories.length ? (
                          detailsClient.assigned_categories.map((category) => (
                            <Badge key={category.id} bg="light" text="dark">
                              {category.name || categoryLookup.get(category.id) || category.id}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted">Δεν υπάρχουν επιλεγμένες κατηγορίες.</span>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12}>
                <Card>
                  <Card.Header>
                    <Card.Title>Σημειώσεις</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{detailsClient.notes || 'Δεν υπάρχουν σημειώσεις.'}</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12}>
                <Card>
                  <Card.Header>
                    <Card.Title>Μεταδεδομένα</Card.Title>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column gap-2">
                    <div><strong>Τελευταία πρόσβαση API:</strong> {formatDate(detailsClient.last_api_access_at)}</div>
                    <div><strong>Τελευταίο endpoint:</strong> {detailsClient.last_api_endpoint || '-'}</div>
                    <div><strong>Τελευταίο IP:</strong> {detailsClient.last_api_ip || '-'}</div>
                    <div><strong>Τελευταίο host:</strong> {detailsClient.last_api_host || '-'}</div>
                    <div><strong>Origin:</strong> {detailsClient.last_api_origin || '-'}</div>
                    <div><strong>Referer:</strong> {detailsClient.last_api_referer || '-'}</div>
                    <div><strong>Τελευταίο πλήθος barcodes:</strong> {detailsClient.last_api_barcodes_count || 0}</div>
                    <div><strong>Σύνολο API αιτημάτων:</strong> {detailsClient.api_request_count || 0}</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={12}>
                <Card>
                  <Card.Header>
                    <Card.Title>Μεταδεδομένα χρήσης</Card.Title>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column gap-2">
                    <div><strong>User Agent:</strong> {detailsClient.last_api_user_agent || '-'}</div>
                    <div><strong>Ενημερώθηκε:</strong> {formatDate(detailsClient.updated_at)}</div>
                    <div><strong>Δημιουργήθηκε:</strong> {formatDate(detailsClient.created_at)}</div>
                    <div><strong>Δημιουργήθηκε από:</strong> {detailsClient.created_by || '-'}</div>
                    <div><strong>Ενημερώθηκε από:</strong> {detailsClient.updated_by || '-'}</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <div className="text-muted">Δεν έχει επιλεγεί πελάτης.</div>
          )}
        </Modal.Body>
      </Modal>
    </ModulePage>
  );
}
