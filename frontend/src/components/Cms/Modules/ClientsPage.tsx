import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import ModulePage from '../ModulePage';
import { fetchCategories } from '../../../services/cms-catalog';
import { createClient, fetchClient, fetchClients, updateApiClientCredentials, updateClient } from '../../../services/cms-clients';
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
};

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

function servicesSummary(client: Pick<CmsClient, 'services'>) {
  return (
    <div className="d-flex flex-wrap gap-2">
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
    });
    setMessage('');
    setApiUsername(client.api_username || '');
    setApiPassword('');
    setGenerateApiPassword(false);
    setSendApiEmail(Boolean(client.email));
    setApiCredentialsMessage('');
    setApiCredentialsError('');
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
    setError('');
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
      setError(err instanceof Error ? err.message : 'Αποτυχία αποθήκευσης πελάτη.');
    } finally {
      setSubmitting(false);
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
      await loadClients();
      setApiCredentialsMessage(
        result.credentials.generated_password
          ? `Username: ${result.credentials.api_username} | Νέος κωδικός: ${result.credentials.generated_password}${result.credentials.email_sent ? ' | Στάλθηκε email.' : ''}`
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
              <Table responsive className="table table-striped mb-3 align-middle">
                <thead>
                  <tr>
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
                      <tr key={client.id}>
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
                          <div className="d-flex gap-2">
                            <Button size="sm" variant="outline-info" onClick={() => void openDetails(client.id)}>
                              Λεπτομέρειες
                            </Button>
                            <Button size="sm" variant="outline-primary" onClick={() => openEdit(client)}>
                              Επεξεργασία
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center text-muted py-4">
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
              {editingClient?.source_type === 'api_basic' ? (
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
                            type="password"
                            value={apiPassword}
                            onChange={(event) => setApiPassword(event.target.value)}
                            placeholder="Άφησε κενό αν θα δημιουργηθεί αυτόματα"
                            disabled={generateApiPassword}
                          />
                          <div className="text-muted fs-12 mt-1">
                            Ο τρέχων κωδικός δεν εμφανίζεται ξανά. Χρησιμοποίησε μόνο reset/rotate.
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="border rounded p-3 h-100">
                            <div className="text-muted fs-12 mb-1">Κατάσταση κωδικού</div>
                            <div className="fw-semibold">{editingClient.password_configured ? 'Ρυθμισμένος' : 'Δεν έχει οριστεί'}</div>
                            <div className="text-muted fs-12 mt-2">
                              Τελευταία αλλαγή: {formatDate(editingClient.password_last_rotated_at)}
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <Form.Check
                            type="switch"
                            id="client-generate-api-password"
                            label="Αυτόματη δημιουργία ασφαλούς κωδικού"
                            checked={generateApiPassword}
                            onChange={(event) => setGenerateApiPassword(event.target.checked)}
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
