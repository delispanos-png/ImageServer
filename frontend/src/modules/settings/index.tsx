import { FormEvent, useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ModulePage from '../../components/Cms/ModulePage';
import { useAuth } from '../../app/providers/AuthProvider';
import { ApiError } from '../../services/api';
import {
  fetchCmsSettings,
  runXmlGeneration,
  updateApiClientStatus,
  updateApiSettings,
  updateImageProcessingSettings,
  updateMailSettings,
  updateProxySettings,
  updateXmlClientStatus,
  updateXmlSettings,
} from '../../services/cms-settings';
import type { CmsApiEndpoint, CmsClient, CmsSettingsData, CmsXmlConfiguredClient } from '../../types';

function formatDateTime(value: string) {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

function apiClientLabel(client: CmsClient) {
  return client.api_domain || client.name || client.company || client.api_username || '-';
}

function formatXmlRequestedDomain(settings: CmsSettingsData | null) {
  const lastRun = settings?.xml.last_run;
  if (!lastRun) {
    return 'all enabled domains';
  }
  if (lastRun.requested_domain) {
    return lastRun.requested_domain;
  }
  if (lastRun.requested_domains.length) {
    return lastRun.requested_domains.join(', ');
  }
  return 'all enabled domains';
}

function describeXmlRunTarget(domain?: string) {
  return domain ? `for ${domain}` : 'for all enabled domains';
}

function describeXmlClientSolution(client: CmsXmlConfiguredClient) {
  if (client.solution_type === 'no_site') {
    return 'no-site solution';
  }
  if (client.solution_type === 'site') {
    return 'site solution';
  }
  return 'unknown solution';
}

function isArchivedXmlFile(fileName: string) {
  return /backup|old/i.test(String(fileName || ''));
}

export default function SettingsPage() {
  const { user, logout, changePassword, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [settings, setSettings] = useState<CmsSettingsData | null>(null);
  const [settingsError, setSettingsError] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const [isProxySaving, setIsProxySaving] = useState(false);
  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [proxyUrl, setProxyUrl] = useState('');
  const [proxyUsername, setProxyUsername] = useState('');
  const [proxyPassword, setProxyPassword] = useState('');
  const [isApiSaving, setIsApiSaving] = useState(false);
  const [isApiClientUpdating, setIsApiClientUpdating] = useState('');
  const [productsApiEnabled, setProductsApiEnabled] = useState(true);
  const [productsInternalApiEnabled, setProductsInternalApiEnabled] = useState(true);
  const [apiFieldRegistry, setApiFieldRegistry] = useState<string[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<CmsApiEndpoint[]>([]);
  const [newApiKey, setNewApiKey] = useState('');
  const [newApiLabel, setNewApiLabel] = useState('');
  const [editingApiKey, setEditingApiKey] = useState('');
  const [isMailSaving, setIsMailSaving] = useState(false);
  const [mailHost, setMailHost] = useState('');
  const [mailPort, setMailPort] = useState('587');
  const [mailUser, setMailUser] = useState('');
  const [mailPassword, setMailPassword] = useState('');
  const [mailFrom, setMailFrom] = useState('');
  const [mailStartTls, setMailStartTls] = useState(true);
  const [isImageProcessingSaving, setIsImageProcessingSaving] = useState(false);
  const [watermarkCleanupEnabled, setWatermarkCleanupEnabled] = useState(false);
  const [isXmlSaving, setIsXmlSaving] = useState(false);
  const [isXmlRunning, setIsXmlRunning] = useState(false);
  const [xmlRunTarget, setXmlRunTarget] = useState('');
  const [isXmlClientUpdating, setIsXmlClientUpdating] = useState('');
  const [xmlEnabled, setXmlEnabled] = useState(false);
  const [xmlServiceUrl, setXmlServiceUrl] = useState('');
  const [xmlPublicBaseUrl, setXmlPublicBaseUrl] = useState('');
  const canUpdateSettings = hasPermission('settings.update');
  const hasEnabledXmlClients = Boolean(settings?.xml.configured_clients.some((client) => client.enabled));
  const sortedApiFields = [...apiFieldRegistry].sort((a, b) => a.localeCompare(b));
  const apiFieldLabels: Record<string, string> = {
    Title: 'Title',
    Sml_Title: 'Short title',
    Description: 'Description',
    Image_url: 'Images',
    Weight: 'Weight / Volume',
    Brand: 'Brand',
    Category_1: 'Category level 1',
    Category_2: 'Category level 2',
    Category_3: 'Category level 3',
    Site: 'Source site',
    Categ: 'Source category (raw)',
    Product_Link: 'Product link',
    Img_src: 'Source image URL',
    last_source: 'Last source',
    last_updated_at: 'Last updated at',
  };

  const applyLoadedSettings = (loadedSettings: CmsSettingsData) => {
    const incomingEndpoints = loadedSettings.api.endpoints ?? [];
    const fallbackEndpoints: CmsApiEndpoint[] = [
      {
        key: 'products',
        label: '/products',
        path: '/products',
        enabled: loadedSettings.api.products_enabled,
        public_only: true,
        include_internal_fields: false,
        allow_external_image_urls: false,
        fields: loadedSettings.api.products_fields ?? [],
      },
      {
        key: 'products_internal',
        label: '/products_internal',
        path: '/products_internal',
        enabled: loadedSettings.api.products_internal_enabled,
        public_only: false,
        include_internal_fields: true,
        allow_external_image_urls: true,
        fields: loadedSettings.api.products_internal_fields ?? [],
      },
    ];
    setSettings(loadedSettings);
    setProxyEnabled(loadedSettings.proxy.enabled);
    setProxyUrl(loadedSettings.proxy.url);
    setProxyUsername(loadedSettings.proxy.username);
    setProxyPassword('');
    setProductsApiEnabled(loadedSettings.api.products_enabled);
    setProductsInternalApiEnabled(loadedSettings.api.products_internal_enabled);
    setApiFieldRegistry(loadedSettings.api.field_registry ?? []);
    setApiEndpoints(incomingEndpoints.length ? incomingEndpoints : fallbackEndpoints);
    setMailHost(loadedSettings.mail.smtp_host);
    setMailPort(String(loadedSettings.mail.smtp_port || 587));
    setMailUser(loadedSettings.mail.smtp_user);
    setMailPassword('');
    setMailFrom(loadedSettings.mail.smtp_from);
    setMailStartTls(loadedSettings.mail.starttls);
    setWatermarkCleanupEnabled(loadedSettings.image_processing.watermark_cleanup_enabled);
    setXmlEnabled(loadedSettings.xml.enabled);
    setXmlServiceUrl(loadedSettings.xml.service_url);
    setXmlPublicBaseUrl(loadedSettings.xml.public_base_url);
  };

  useEffect(() => {
    const loadSettings = async () => {
      setIsSettingsLoading(true);
      setSettingsError('');
      try {
        const loadedSettings = await fetchCmsSettings();
        applyLoadedSettings(loadedSettings);
      } catch (settingsLoadError) {
        if (settingsLoadError instanceof ApiError) {
          setSettingsError(settingsLoadError.message);
        } else {
          setSettingsError('Failed to load settings.');
        }
      } finally {
        setIsSettingsLoading(false);
      }
    };

    void loadSettings();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation must match.');
      return;
    }

    setIsSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Password updated successfully.');
    } catch (submissionError) {
      if (submissionError instanceof ApiError) {
        setError(submissionError.message);
      } else {
        setError('Failed to update password.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const onLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const onProxySubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSettingsError('');
    setSettingsMessage('');
    setIsProxySaving(true);
    try {
      const updated = await updateProxySettings({
        enabled: proxyEnabled,
        url: proxyUrl,
        username: proxyUsername,
        password: proxyPassword,
      });
      applyLoadedSettings(updated);
      setSettingsMessage('Proxy settings updated successfully.');
    } catch (proxySaveError) {
      if (proxySaveError instanceof ApiError) {
        setSettingsError(proxySaveError.message);
      } else {
        setSettingsError('Failed to update proxy settings.');
      }
    } finally {
      setIsProxySaving(false);
    }
  };

  const onApiSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSettingsError('');
    setSettingsMessage('');
    setIsApiSaving(true);
    try {
      const productsEndpoint = apiEndpoints.find((endpoint) => endpoint.key === 'products');
      const productsInternalEndpoint = apiEndpoints.find((endpoint) => endpoint.key === 'products_internal');
      const updated = await updateApiSettings({
        products_enabled: productsEndpoint?.enabled ?? productsApiEnabled,
        products_internal_enabled: productsInternalEndpoint?.enabled ?? productsInternalApiEnabled,
        endpoints: apiEndpoints,
        products_fields: productsEndpoint?.fields ?? [],
        products_internal_fields: productsInternalEndpoint?.fields ?? [],
        field_registry: apiFieldRegistry,
      });
      applyLoadedSettings(updated);
      setSettingsMessage('API settings updated successfully.');
    } catch (apiSaveError) {
      if (apiSaveError instanceof ApiError) {
        setSettingsError(apiSaveError.message);
      } else {
        setSettingsError('Failed to update API settings.');
      }
    } finally {
      setIsApiSaving(false);
    }
  };

  const updateEndpoint = (key: string, updater: (endpoint: CmsApiEndpoint) => CmsApiEndpoint) => {
    setApiEndpoints((prev) =>
      prev.map((endpoint) => (endpoint.key === key ? updater(endpoint) : endpoint)),
    );
  };

  const toggleApiField = (endpointKey: string, field: string) => {
    updateEndpoint(endpointKey, (endpoint) => {
      const exists = endpoint.fields.includes(field);
      return {
        ...endpoint,
        fields: exists ? endpoint.fields.filter((value) => value !== field) : [...endpoint.fields, field],
      };
    });
  };

  const onAddApiEndpoint = () => {
    const key = newApiKey.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!key || apiEndpoints.some((endpoint) => endpoint.key === key)) {
      return;
    }
    const path = key === 'products' || key === 'products_internal' ? `/${key}` : `/products/${key}`;
    const label = newApiLabel.trim() || path;
    setApiEndpoints((prev) => [
      ...prev,
      {
        key,
        label,
        path,
        enabled: true,
        public_only: true,
        include_internal_fields: false,
        allow_external_image_urls: false,
        fields: [],
      },
    ]);
    setNewApiKey('');
    setNewApiLabel('');
    setEditingApiKey(key);
  };

  const onApiClientToggle = async (client: CmsClient) => {
    setSettingsError('');
    setSettingsMessage('');
    setIsApiClientUpdating(client.id);
    try {
      const updated = await updateApiClientStatus(client.id, !client.is_active);
      applyLoadedSettings(updated);
      setSettingsMessage(`API client ${client.api_username || client.name} updated successfully.`);
    } catch (apiClientError) {
      if (apiClientError instanceof ApiError) {
        setSettingsError(apiClientError.message);
      } else {
        setSettingsError('Failed to update API client status.');
      }
    } finally {
      setIsApiClientUpdating('');
    }
  };

  const onMailSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSettingsError('');
    setSettingsMessage('');
    setIsMailSaving(true);
    try {
      const updated = await updateMailSettings({
        smtp_host: mailHost,
        smtp_port: Number(mailPort) || 587,
        smtp_user: mailUser,
        smtp_password: mailPassword,
        smtp_from: mailFrom,
        starttls: mailStartTls,
      });
      applyLoadedSettings(updated);
      setSettingsMessage('Mail settings updated successfully.');
    } catch (mailSaveError) {
      if (mailSaveError instanceof ApiError) {
        setSettingsError(mailSaveError.message);
      } else {
        setSettingsError('Failed to update mail settings.');
      }
    } finally {
      setIsMailSaving(false);
    }
  };

  const onImageProcessingSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSettingsError('');
    setSettingsMessage('');
    setIsImageProcessingSaving(true);
    try {
      const updated = await updateImageProcessingSettings({
        watermark_cleanup_enabled: watermarkCleanupEnabled,
      });
      applyLoadedSettings(updated);
      setSettingsMessage('Image processing settings updated successfully.');
    } catch (imageProcessingError) {
      if (imageProcessingError instanceof ApiError) {
        setSettingsError(imageProcessingError.message);
      } else {
        setSettingsError('Failed to update image processing settings.');
      }
    } finally {
      setIsImageProcessingSaving(false);
    }
  };

  const onXmlSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSettingsError('');
    setSettingsMessage('');
    setIsXmlSaving(true);
    try {
      const updated = await updateXmlSettings({
        enabled: xmlEnabled,
        service_url: xmlServiceUrl,
        public_base_url: xmlPublicBaseUrl,
      });
      applyLoadedSettings(updated);
      setSettingsMessage('XML settings updated successfully.');
    } catch (xmlSaveError) {
      if (xmlSaveError instanceof ApiError) {
        setSettingsError(xmlSaveError.message);
      } else {
        setSettingsError('Failed to update XML settings.');
      }
    } finally {
      setIsXmlSaving(false);
    }
  };

  const onXmlClientToggle = async (client: CmsXmlConfiguredClient) => {
    setSettingsError('');
    setSettingsMessage('');
    setIsXmlClientUpdating(client.domain);
    try {
      const updated = await updateXmlClientStatus(client.domain, !client.enabled);
      applyLoadedSettings(updated);
      setSettingsMessage(`XML client ${client.domain} updated successfully.`);
    } catch (xmlClientError) {
      if (xmlClientError instanceof ApiError) {
        setSettingsError(xmlClientError.message);
      } else {
        setSettingsError('Failed to update XML client status.');
      }
    } finally {
      setIsXmlClientUpdating('');
    }
  };

  const onXmlRun = async (domain = '') => {
    setSettingsError('');
    setSettingsMessage('');
    setIsXmlRunning(true);
    setXmlRunTarget(domain);
    try {
      const response = await runXmlGeneration({ mode: 'full', domain: domain || undefined });
      applyLoadedSettings(response.settings);
      setSettingsMessage(
        response.job.already_running
          ? 'XML generation is already running.'
          : `XML generation started ${describeXmlRunTarget(domain)}.`
      );
    } catch (xmlRunError) {
      if (xmlRunError instanceof ApiError) {
        setSettingsError(xmlRunError.message);
      } else {
        setSettingsError('Failed to start XML generation.');
      }
    } finally {
      setIsXmlRunning(false);
      setXmlRunTarget('');
    }
  };

  return (
    <ModulePage title="Ρυθμίσεις" description="Διαχείριση συνεδρίας, αλλαγή κωδικού και στοιχεία χειριστή.">
      <Row>
        <Col xl={4}>
          <Card>
            <Card.Header>
              <Card.Title>Συνεδρία</Card.Title>
            </Card.Header>
            <Card.Body className="d-flex flex-column gap-3">
              <div>
                <div className="text-muted fs-12">Συνδεδεμένος ως</div>
                <div className="fw-semibold">{user?.full_name || 'Unknown user'}</div>
                <div className="text-muted">{user?.email || '-'}</div>
              </div>
              <div>
                <div className="text-muted fs-12">Ρόλος</div>
                <div className="fw-semibold">{user?.role || '-'}</div>
              </div>
              <Button variant="outline-danger" onClick={onLogout} disabled={isLoggingOut}>
                {isLoggingOut ? <Spinner animation="border" size="sm" /> : 'Αποσύνδεση'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={8}>
          <Card>
            <Card.Header>
              <Card.Title>Αλλαγή Κωδικού</Card.Title>
            </Card.Header>
            <Card.Body>
              {error ? <Alert variant="danger">{error}</Alert> : null}
              {message ? <Alert variant="success">{message}</Alert> : null}
              <Form onSubmit={onSubmit} className="d-flex flex-column gap-3">
                <Form.Group>
                  <Form.Label>Τρέχων κωδικός</Form.Label>
                  <Form.Control
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Νέος κωδικός</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Επιβεβαίωση νέου κωδικού</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </Form.Group>
                <div>
                  <Button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? <Spinner animation="border" size="sm" /> : 'Ενημέρωση κωδικού'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title>Ρυθμίσεις Proxy</Card.Title>
            </Card.Header>
            <Card.Body>
              {settingsError ? <Alert variant="danger">{settingsError}</Alert> : null}
              {settingsMessage ? <Alert variant="success">{settingsMessage}</Alert> : null}
              {isSettingsLoading ? (
                <div className="py-4 text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Form onSubmit={onProxySubmit} className="d-flex flex-column gap-3">
                  <Row className="g-3">
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Ρυθμισμένο</div>
                        <div className="fw-semibold">{settings?.proxy.configured ? 'Ναι' : 'Όχι'}</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Κωδικός</div>
                        <div className="fw-semibold">{settings?.proxy.password_configured ? 'Αποθηκευμένος' : 'Δεν έχει οριστεί'}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Ενεργό proxy</div>
                        <div className="fw-semibold text-break">{settings?.proxy.effective_proxy_url || '-'}</div>
                      </div>
                    </Col>
                  </Row>
                  <Form.Check
                    type="switch"
                    id="cms-proxy-enabled"
                    label="Ενεργοποίηση proxy για skroutz / pharmacy295"
                    checked={proxyEnabled}
                    onChange={(event) => setProxyEnabled(event.target.checked)}
                  />
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Proxy URL</Form.Label>
                        <Form.Control
                          value={proxyUrl}
                          onChange={(event) => setProxyUrl(event.target.value)}
                          placeholder="http://proxy-host:port"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Όνομα χρήστη</Form.Label>
                        <Form.Control value={proxyUsername} onChange={(event) => setProxyUsername(event.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Κωδικός</Form.Label>
                        <Form.Control
                          type="password"
                          value={proxyPassword}
                          onChange={(event) => setProxyPassword(event.target.value)}
                          placeholder={settings?.proxy.password_configured ? 'Άφησέ το κενό για να μείνει ο τρέχων' : ''}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-muted fs-12">
                    Οι ρυθμίσεις εφαρμόζονται άμεσα στα νέα fetches. Άφησε τον κωδικό κενό για να διατηρηθεί ο τρέχων.
                  </div>
                  <div>
                    <Button type="submit" disabled={isProxySaving}>
                      {isProxySaving ? <Spinner animation="border" size="sm" /> : 'Αποθήκευση ρυθμίσεων proxy'}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title>Πρόσβαση API</Card.Title>
            </Card.Header>
            <Card.Body>
              {isSettingsLoading ? (
                <div className="py-4 text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Form onSubmit={onApiSubmit} className="d-flex flex-column gap-3">
                  <Row className="g-3">
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">/products</div>
                        <div className="fw-semibold">{settings?.api.products_enabled ? 'Ενεργό' : 'Ανενεργό'}</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">/products_internal</div>
                        <div className="fw-semibold">{settings?.api.products_internal_enabled ? 'Ενεργό' : 'Ανενεργό'}</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">API clients</div>
                        <div className="fw-semibold">{settings?.api_clients.length ?? 0}</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Ενεργοί clients</div>
                        <div className="fw-semibold">{(settings?.api_clients ?? []).filter((client) => client.is_active).length}</div>
                      </div>
                    </Col>
                  </Row>
                  <div className="border rounded p-3">
                    <div className="fw-semibold">API endpoints</div>
                    <div className="text-muted fs-12 mb-3">
                      Πρόσθεσε νέα endpoints και όρισε ποια fields επιστρέφει το καθένα. Στο Edit εμφανίζονται όλα τα διαθέσιμα fields.
                    </div>
                    <Row className="g-2 align-items-end">
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Κλειδί API</Form.Label>
                          <Form.Control
                            value={newApiKey}
                            onChange={(event) => setNewApiKey(event.target.value)}
                            placeholder="e.g. products_public"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Ετικέτα</Form.Label>
                          <Form.Control
                            value={newApiLabel}
                            onChange={(event) => setNewApiLabel(event.target.value)}
                            placeholder="e.g. /products/public"
                          />
                        </Form.Group>
                      </Col>
                      <Col md="auto">
                          <Button
                            type="button"
                            variant="outline-primary"
                            onClick={onAddApiEndpoint}
                            disabled={!newApiKey.trim()}
                          >
                            Προσθήκη API
                          </Button>
                        </Col>
                      </Row>
                    <div className="text-muted fs-12 mt-2">
                      Τα νέα endpoints δημιουργούνται ως <span className="fw-semibold">/products/&lt;api_key&gt;</span>.
                    </div>
                    <div className="table-responsive mt-3">
                      <Table className="table table-sm mb-0">
                        <thead>
                          <tr>
                            <th>API</th>
                            <th>Διαδρομή</th>
                            <th>Κατάσταση</th>
                            <th>Fields</th>
                            <th>Ενέργειες</th>
                          </tr>
                        </thead>
                        <tbody>
                          {apiEndpoints.length ? (
                            apiEndpoints.map((endpoint) => (
                              <tr key={endpoint.key}>
                                <td className="fw-semibold">{endpoint.label || endpoint.key}</td>
                                <td className="text-muted">{endpoint.path}</td>
                                <td>
                                  <Form.Check
                                    type="switch"
                                    id={`api-endpoint-enabled-${endpoint.key}`}
                                    checked={endpoint.enabled}
                                    onChange={(event) =>
                                      updateEndpoint(endpoint.key, (current) => ({
                                        ...current,
                                        enabled: event.target.checked,
                                      }))
                                    }
                                  />
                                </td>
                                <td>{endpoint.fields.length}</td>
                                <td>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant={editingApiKey === endpoint.key ? 'primary' : 'outline-primary'}
                                    onClick={() =>
                                      setEditingApiKey((current) => (current === endpoint.key ? '' : endpoint.key))
                                    }
                                  >
                                    {editingApiKey === endpoint.key ? 'Κλείσιμο' : 'Edit'}
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-muted">
                                Δεν υπάρχουν endpoints.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                    {editingApiKey ? (
                      <div className="border rounded p-3 mt-3">
                        {(() => {
                          const editingEndpoint = apiEndpoints.find((endpoint) => endpoint.key === editingApiKey);
                          if (!editingEndpoint) {
                            return <div className="text-muted">Επίλεξε API για επεξεργασία.</div>;
                          }
                          return (
                            <>
                              <div className="d-flex flex-column gap-2">
                                <div className="fw-semibold">Επεξεργασία API: {editingEndpoint.label || editingEndpoint.key}</div>
                                <Row className="g-2">
                                  <Col md={4}>
                                    <Form.Group>
                                      <Form.Label>Ετικέτα</Form.Label>
                                      <Form.Control
                                        value={editingEndpoint.label}
                                        onChange={(event) =>
                                          updateEndpoint(editingEndpoint.key, (current) => ({
                                            ...current,
                                            label: event.target.value,
                                          }))
                                        }
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col md={4}>
                                    <Form.Group>
                                      <Form.Label>Διαδρομή</Form.Label>
                                      <Form.Control
                                        value={editingEndpoint.path}
                                        readOnly
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col md={4}>
                                    <Form.Group>
                                      <Form.Label>Πρόσβαση</Form.Label>
                                      <Form.Select
                                        value={editingEndpoint.public_only ? 'public' : 'internal'}
                                        onChange={(event) =>
                                          updateEndpoint(editingEndpoint.key, (current) => ({
                                            ...current,
                                            public_only: event.target.value === 'public',
                                          }))
                                        }
                                      >
                                        <option value="public">Μόνο δημόσια</option>
                                        <option value="internal">Εσωτερικά + ανενεργά</option>
                                      </Form.Select>
                                    </Form.Group>
                                  </Col>
                                </Row>
                                <Row className="g-2">
                                  <Col md={6}>
                                    <Form.Check
                                      type="switch"
                                      id={`api-endpoint-internal-${editingEndpoint.key}`}
                                      label="Συμπερίληψη εσωτερικών fields (Site, Product_Link, κ.λπ.)"
                                      checked={editingEndpoint.include_internal_fields}
                                      onChange={(event) =>
                                        updateEndpoint(editingEndpoint.key, (current) => ({
                                          ...current,
                                          include_internal_fields: event.target.checked,
                                        }))
                                      }
                                    />
                                  </Col>
                                  <Col md={6}>
                                    <Form.Check
                                      type="switch"
                                      id={`api-endpoint-external-images-${editingEndpoint.key}`}
                                      label="Επιτρέπονται εξωτερικά image URLs"
                                      checked={editingEndpoint.allow_external_image_urls}
                                      onChange={(event) =>
                                        updateEndpoint(editingEndpoint.key, (current) => ({
                                          ...current,
                                          allow_external_image_urls: event.target.checked,
                                        }))
                                      }
                                    />
                                  </Col>
                                </Row>
                              </div>
                              <div className="table-responsive mt-3">
                                <Table className="table table-sm mb-0">
                                  <thead>
                                    <tr>
                                      <th>Διαθέσιμο field</th>
                                      <th>Ενεργό</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sortedApiFields.length ? (
                                      sortedApiFields.map((field) => (
                                        <tr key={`${editingEndpoint.key}-${field}`}>
                                          <td className="fw-semibold">{apiFieldLabels[field] ?? field}</td>
                                          <td>
                                            <Form.Check
                                              type="switch"
                                              id={`api-field-${editingEndpoint.key}-${field}`}
                                              checked={editingEndpoint.fields.includes(field)}
                                              onChange={() => toggleApiField(editingEndpoint.key, field)}
                                            />
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan={2} className="text-muted">
                                          Δεν υπάρχουν διαθέσιμα fields.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </Table>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : null}
                  </div>
                  <div className="text-muted fs-12">
                    Οι αλλαγές εφαρμόζονται άμεσα. Οι διακόπτες clients μπλοκάρουν μεμονωμένους clients ακόμη και όταν το endpoint είναι ενεργό.
                  </div>
                  <div>
                    <Button type="submit" disabled={isApiSaving}>
                      {isApiSaving ? <Spinner animation="border" size="sm" /> : 'Αποθήκευση ρυθμίσεων API'}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title>API Clients</Card.Title>
            </Card.Header>
            <Card.Body>
              {isSettingsLoading ? (
                <div className="py-4 text-center">
                  <Spinner animation="border" />
                </div>
              ) : settings?.api_clients.length ? (
                <div className="table-responsive">
                  <Table className="table text-nowrap text-md-nowrap mb-0">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Username</th>
                        <th>Κατάσταση</th>
                        <th>Αιτήματα</th>
                        <th>Τελευταία πρόσβαση</th>
                        <th>Endpoint</th>
                        <th>Host / IP</th>
                        <th>Ενέργειες</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settings.api_clients.map((client) => (
                        <tr key={client.id}>
                          <td>
                            <div className="fw-semibold">{apiClientLabel(client)}</div>
                            <div className="text-muted fs-12">{client.api_client_key || '-'}</div>
                          </td>
                          <td>{client.api_username || '-'}</td>
                          <td>
                            <Badge bg={client.is_active ? 'success' : 'secondary'}>
                              {client.is_active ? 'ενεργός' : 'ανενεργός'}
                            </Badge>
                          </td>
                          <td>{client.api_request_count}</td>
                          <td>{formatDateTime(client.last_api_access_at)}</td>
                          <td>{client.last_api_endpoint || '-'}</td>
                          <td>
                            <div>{client.last_api_host || '-'}</div>
                            <div className="text-muted fs-12">{client.last_api_ip || '-'}</div>
                          </td>
                          <td>
                            <Button
                              variant={client.is_active ? 'outline-danger' : 'outline-success'}
                              size="sm"
                              disabled={isApiClientUpdating === client.id}
                              onClick={() => void onApiClientToggle(client)}
                            >
                              {isApiClientUpdating === client.id ? (
                                <Spinner animation="border" size="sm" />
                              ) : client.is_active ? (
                                'Disable'
                              ) : (
                                'Enable'
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert variant="light" className="mb-0">
                  No API clients have been synced yet.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title>Mail Account</Card.Title>
            </Card.Header>
            <Card.Body>
              {isSettingsLoading ? (
                <div className="py-4 text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Form onSubmit={onMailSubmit} className="d-flex flex-column gap-3">
                  <Row className="g-3">
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Configured</div>
                        <div className="fw-semibold">{settings?.mail.configured ? 'Yes' : 'No'}</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Password</div>
                        <div className="fw-semibold">{settings?.mail.password_configured ? 'Stored' : 'Not set'}</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Updated At</div>
                        <div className="fw-semibold">{settings?.mail.updated_at ? formatDateTime(settings.mail.updated_at) : '-'}</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Updated By</div>
                        <div className="fw-semibold">{settings?.mail.updated_by || '-'}</div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>SMTP Host</Form.Label>
                        <Form.Control value={mailHost} onChange={(event) => setMailHost(event.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Port</Form.Label>
                        <Form.Control value={mailPort} onChange={(event) => setMailPort(event.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control value={mailUser} onChange={(event) => setMailUser(event.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>From Email</Form.Label>
                        <Form.Control value={mailFrom} onChange={(event) => setMailFrom(event.target.value)} />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          value={mailPassword}
                          onChange={(event) => setMailPassword(event.target.value)}
                          placeholder={settings?.mail.password_configured ? 'Leave blank to keep current' : ''}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="d-flex align-items-end">
                      <Form.Check
                        type="switch"
                        id="cms-mail-starttls"
                        label="Use STARTTLS"
                        checked={mailStartTls}
                        onChange={(event) => setMailStartTls(event.target.checked)}
                      />
                    </Col>
                  </Row>
                  <div className="text-muted fs-12">
                    These settings are used for automatic API credential emails. Leave password blank to keep the stored value.
                  </div>
                  <div>
                    <Button type="submit" disabled={isMailSaving}>
                      {isMailSaving ? <Spinner animation="border" size="sm" /> : 'Save mail settings'}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title>Image Processing</Card.Title>
            </Card.Header>
            <Card.Body>
              {isSettingsLoading ? (
                <div className="py-4 text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Form onSubmit={onImageProcessingSubmit} className="d-flex flex-column gap-3">
                  <Row className="g-3">
                    <Col md={4}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Watermark Cleanup</div>
                        <div className="fw-semibold">
                          {settings?.image_processing.effective_watermark_cleanup_enabled ? 'Enabled' : 'Disabled'}
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Updated At</div>
                        <div className="fw-semibold">
                          {settings?.image_processing.updated_at ? formatDateTime(settings.image_processing.updated_at) : '-'}
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Updated By</div>
                        <div className="fw-semibold">{settings?.image_processing.updated_by || '-'}</div>
                      </div>
                    </Col>
                  </Row>
                  <Form.Check
                    type="switch"
                    id="cms-watermark-cleanup-enabled"
                    label="Enable legacy watermark cleanup for Ofarmakopoiosmou images"
                    checked={watermarkCleanupEnabled}
                    onChange={(event) => setWatermarkCleanupEnabled(event.target.checked)}
                  />
                  <div className="text-muted fs-12">
                    Keep this disabled when image intake relies on clean sources such as pharmacy295 or vita4you. Enable it only when you intentionally accept Ofarmakopoiosmou image downloads and need legacy cleanup.
                  </div>
                  <div>
                    <Button type="submit" disabled={isImageProcessingSaving}>
                      {isImageProcessingSaving ? <Spinner animation="border" size="sm" /> : 'Save image processing settings'}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title>XML Service</Card.Title>
            </Card.Header>
            <Card.Body>
              {isSettingsLoading ? (
                <div className="py-4 text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Form onSubmit={onXmlSubmit} className="d-flex flex-column gap-3">
                  <Row className="g-3">
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Enabled</div>
                        <div className="fw-semibold">{settings?.xml.enabled ? 'Yes' : 'No'}</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Service Reachable</div>
                        <div className="fw-semibold">{settings?.xml.service_reachable ? 'Yes' : 'No'}</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Running</div>
                        <div className="fw-semibold">{settings?.xml.service_running ? 'Yes' : 'No'}</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="border rounded p-3 h-100">
                        <div className="text-muted fs-12 mb-1">Configured Domains</div>
                        <div className="fw-semibold">{settings?.xml.configured_clients.length ?? 0}</div>
                      </div>
                    </Col>
                  </Row>
                  {settings?.xml.service_error ? <Alert variant="warning" className="mb-0">{settings.xml.service_error}</Alert> : null}
                  <Form.Check
                    type="switch"
                    id="cms-xml-enabled"
                    label="Enable XML generation and XML serving through the image server"
                    checked={xmlEnabled}
                    onChange={(event) => setXmlEnabled(event.target.checked)}
                  />
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Internal Service URL</Form.Label>
                        <Form.Control
                          value={xmlServiceUrl}
                          onChange={(event) => setXmlServiceUrl(event.target.value)}
                          placeholder="http://xml_generator"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Public Base URL</Form.Label>
                        <Form.Control
                          value={xmlPublicBaseUrl}
                          onChange={(event) => setXmlPublicBaseUrl(event.target.value)}
                          placeholder="/api/xml_generator"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-muted fs-12">
                    The image server talks to the XML generator through the internal service URL. The public base URL is used for operator links and client-facing XML paths.
                  </div>
                  <div className="text-muted fs-12">
                    XML client subscriptions and site / no-site configuration are managed from the Clients module.
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <Button type="submit" disabled={isXmlSaving || !canUpdateSettings}>
                      {isXmlSaving ? <Spinner animation="border" size="sm" /> : 'Save XML settings'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline-primary"
                      disabled={isXmlRunning || !xmlEnabled || !canUpdateSettings || !hasEnabledXmlClients}
                      onClick={() => void onXmlRun()}
                    >
                      {isXmlRunning && !xmlRunTarget ? <Spinner animation="border" size="sm" /> : 'Run full XML generation'}
                    </Button>
                  </div>
                  <Row className="g-3">
                    <Col xl={6}>
                      <div className="border rounded p-3 h-100">
                        <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                          <div className="fw-semibold">Configured Domains</div>
                          <Badge bg="light" text="dark">{settings?.xml.configured_clients.length ?? 0}</Badge>
                        </div>
                        {settings?.xml.configured_clients.length ? (
                          <div className="d-flex flex-column gap-2">
                            {settings.xml.configured_clients.map((client) => (
                              <div key={client.domain} className="border rounded p-2 d-flex justify-content-between align-items-start gap-3 flex-wrap">
                                <div>
                                  <div className="fw-semibold">{client.domain}</div>
                                  <div className="text-muted fs-12">
                                    {describeXmlClientSolution(client)}
                                    {client.function_name ? ` · ${client.function_name}` : ''}
                                    {client.company ? ` · company ${client.company}` : ''}
                                  </div>
                                  <div className="text-muted fs-12">
                                    {client.updated_at ? `Updated ${formatDateTime(client.updated_at)}` : 'Using default service state'}
                                    {client.updated_by ? ` · ${client.updated_by}` : ''}
                                  </div>
                                </div>
                                <div className="d-flex flex-column align-items-start align-items-md-end gap-2">
                                  <Badge bg={client.enabled ? 'success' : 'secondary'}>{client.enabled ? 'Enabled' : 'Disabled'}</Badge>
                                  <Form.Check
                                    type="switch"
                                    id={`xml-client-${client.domain}`}
                                    label={isXmlClientUpdating === client.domain ? 'Updating...' : client.enabled ? 'Active' : 'Inactive'}
                                    checked={client.enabled}
                                    disabled={isXmlClientUpdating === client.domain || !canUpdateSettings}
                                    onChange={() => void onXmlClientToggle(client)}
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline-primary"
                                    disabled={isXmlRunning || !xmlEnabled || !client.enabled || !canUpdateSettings}
                                    onClick={() => void onXmlRun(client.domain)}
                                  >
                                    {isXmlRunning && xmlRunTarget === client.domain ? <Spinner animation="border" size="sm" /> : 'Run'}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted fs-12">No XML domains are configured in the XML service.</div>
                        )}
                      </div>
                    </Col>
                    <Col xl={6}>
                      <div className="border rounded p-3 h-100">
                        <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                          <div className="fw-semibold">Published XML Files</div>
                          <Badge bg="light" text="dark">{settings?.xml.outputs.length ?? 0}</Badge>
                        </div>
                        {settings?.xml.outputs.length ? (
                          <div className="d-flex flex-column gap-2">
                            {settings.xml.outputs.map((group) => (
                              <div key={group.domain} className="border rounded p-3">
                                <div className="fw-semibold mb-2">{group.domain}</div>
                                {(() => {
                                  const currentFiles = group.files.filter((file) => !isArchivedXmlFile(file.name));
                                  const archivedFiles = group.files.filter((file) => isArchivedXmlFile(file.name));
                                  const downloadFiles = currentFiles.length ? currentFiles : group.files;

                                  return (
                                    <div className="d-flex flex-column gap-3">
                                      <div>
                                        <div className="text-muted fs-12 mb-2">
                                          {currentFiles.length ? 'Current published files' : 'Published files'}
                                        </div>
                                        <div className="d-flex flex-wrap gap-2">
                                          {downloadFiles.map((file) => (
                                            <a
                                              key={`${group.domain}-${file.name}`}
                                              href={file.url}
                                              download={file.name}
                                              className="btn btn-outline-primary btn-sm"
                                            >
                                              Download {file.name}
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                      {archivedFiles.length ? (
                                        <div>
                                          <div className="text-muted fs-12 mb-2">Archived files</div>
                                          <div className="d-flex flex-wrap gap-2">
                                            {archivedFiles.map((file) => (
                                              <a
                                                key={`${group.domain}-archive-${file.name}`}
                                                href={file.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="fs-12"
                                              >
                                                {file.name}
                                              </a>
                                            ))}
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>
                                  );
                                })()}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted fs-12">No XML files have been published yet.</div>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-3">
                    <Col xl={12}>
                      <div className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                          <div className="fw-semibold">Last Run</div>
                          <Badge
                            bg={
                              settings?.xml.last_run.status === 'completed'
                                ? 'success'
                                : settings?.xml.last_run.status === 'completed_with_errors'
                                  ? 'warning'
                                  : settings?.xml.last_run.status === 'failed'
                                    ? 'danger'
                                    : settings?.xml.last_run.status === 'running'
                                      ? 'primary'
                                      : 'secondary'
                            }
                          >
                            {settings?.xml.last_run.status || 'idle'}
                          </Badge>
                        </div>
                        <Row className="g-3">
                          <Col md={3}>
                            <div className="text-muted fs-12 mb-1">Started</div>
                            <div className="fw-semibold">{settings?.xml.last_run.started_at ? formatDateTime(settings.xml.last_run.started_at) : '-'}</div>
                          </Col>
                          <Col md={3}>
                            <div className="text-muted fs-12 mb-1">Finished</div>
                            <div className="fw-semibold">{settings?.xml.last_run.finished_at ? formatDateTime(settings.xml.last_run.finished_at) : '-'}</div>
                          </Col>
                          <Col md={3}>
                            <div className="text-muted fs-12 mb-1">Mode</div>
                            <div className="fw-semibold">{settings?.xml.last_run.mode || '-'}</div>
                          </Col>
                          <Col md={3}>
                            <div className="text-muted fs-12 mb-1">Domain</div>
                            <div className="fw-semibold">{formatXmlRequestedDomain(settings)}</div>
                          </Col>
                        </Row>
                        <div className="text-muted fs-12 mt-3 mb-1">Message</div>
                        <div className="fw-semibold">{settings?.xml.last_run.message || 'No XML run has been recorded yet.'}</div>
                        {settings?.xml.last_run.results.length ? (
                          <div className="mt-3 d-flex flex-column gap-2">
                            {settings.xml.last_run.results.map((result) => (
                              <div
                                key={`${result.domain}-${result.file}-${(result.files || []).join(',')}`}
                                className="border rounded p-2"
                              >
                                <div className="fw-semibold">{result.domain}</div>
                                <div className="text-muted fs-12">
                                  {result.generated_products} updated products · {result.total_products} total products
                                </div>
                                {result.files?.length ? (
                                  <div className="text-muted fs-12">Files: {result.files.join(', ')}</div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : null}
                        {settings?.xml.last_run.errors.length ? (
                          <Alert variant="warning" className="mt-3 mb-0">
                            {settings.xml.last_run.errors.map((error) => (
                              <div key={`${error.domain}-${error.error}`}>{error.domain}: {error.error}</div>
                            ))}
                          </Alert>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title>Catalog Activation Policy</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <div className="border rounded p-3 h-100">
                    <div className="fw-semibold mb-2">Active Immediately</div>
                    <div className="text-muted fs-13">
                      Item is set to <strong>active</strong> when it has:
                    </div>
                    <ul className="mb-0 mt-2 text-muted fs-13 ps-3">
                      <li>text content</li>
                      <li>at least one category</li>
                      <li>at least one image source</li>
                    </ul>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="border rounded p-3 h-100">
                    <div className="fw-semibold mb-2">Public Image URL Rule</div>
                    <div className="text-muted fs-13">
                      Public <code>Image_url</code> is exposed only when the hosted image is under the CloudOn image path.
                    </div>
                    <div className="text-muted fs-13 mt-2">
                      External source images stay internal and are not published to clients.
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="border rounded p-3 h-100">
                    <div className="fw-semibold mb-2">Forced Inactive</div>
                    <div className="text-muted fs-13">
                      Item is set to <strong>inactive</strong> only when it is missing one of these:
                    </div>
                    <ul className="mb-0 mt-2 text-muted fs-13 ps-3">
                      <li>text content</li>
                      <li>category assignment</li>
                      <li>any image source URL</li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </ModulePage>
  );
}
