import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Modal, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import ModulePage from '../ModulePage';
import type { CmsCustomerRemark } from '../../../types';
import { fetchCustomerRemarks, updateCustomerRemark } from '../../../services/cms-customer-remarks';

function formatDate(value: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function statusBadge(status: CmsCustomerRemark['status']) {
  if (status === 'resolved') return <Badge bg="success">Επιλύθηκε</Badge>;
  if (status === 'under_review') return <Badge bg="warning">Σε έλεγχο</Badge>;
  return <Badge bg="info">Νέο</Badge>;
}

export default function CustomerRemarksPage() {
  const [rows, setRows] = useState<CmsCustomerRemark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'under_review' | 'resolved'>('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [pagination, setPagination] = useState({ total: 0, page: 1, per_page: 15, total_pages: 1 });
  const [selectedRemark, setSelectedRemark] = useState<CmsCustomerRemark | null>(null);
  const [saving, setSaving] = useState(false);
  const [formStatus, setFormStatus] = useState<CmsCustomerRemark['status']>('new');
  const [adminResponse, setAdminResponse] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchCustomerRemarks({
        search: search || undefined,
        status_filter: statusFilter,
        page,
        per_page: perPage,
      });
      setRows(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης παρατηρήσεων πελατών.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [search, statusFilter, page, perPage]);

  useEffect(() => {
    if (!selectedRemark) {
      setFormStatus('new');
      setAdminResponse('');
      setResolutionNote('');
      return;
    }
    setFormStatus(selectedRemark.status);
    setAdminResponse(selectedRemark.admin_response || '');
    setResolutionNote(selectedRemark.resolution_note || '');
  }, [selectedRemark]);

  const pages = useMemo(() => {
    const items: ReactNode[] = [];
    for (let current = 1; current <= pagination.total_pages; current += 1) {
      items.push(
        <Pagination.Item key={current} active={current === pagination.page} onClick={() => setPage(current)}>
          {current}
        </Pagination.Item>,
      );
    }
    return items;
  }, [pagination.page, pagination.total_pages]);

  const activeFilterCount = [
    Boolean(search.trim()),
    statusFilter !== 'all',
  ].filter(Boolean).length;

  const moduleMetrics = [
    {
      label: 'Φιλτραρισμένες εγγραφές',
      value: pagination.total.toLocaleString(),
      helper: 'Παρατηρήσεις πελατών που ταιριάζουν στα φίλτρα',
      tone: 'primary' as const,
    },
    {
      label: 'Ενεργά φίλτρα',
      value: activeFilterCount,
      helper: activeFilterCount ? 'Έχουν εφαρμοστεί φίλτρα αναζήτησης/κατάστασης' : 'Προβολή όλων των παρατηρήσεων',
      tone: activeFilterCount ? ('warning' as const) : ('info' as const),
    },
    {
      label: 'Σελίδα',
      value: `${pagination.page}/${Math.max(pagination.total_pages, 1)}`,
      helper: `${perPage} ανά σελίδα`,
      tone: 'success' as const,
    },
  ];

  const submitUpdate = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedRemark) return;
    setSaving(true);
    setError('');
    try {
      await updateCustomerRemark(selectedRemark.id, {
        status: formStatus,
        admin_response: adminResponse,
        resolution_note: resolutionNote,
      });
      setSelectedRemark(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία ενημέρωσης παρατήρησης.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModulePage
      title="Παρατηρήσεις πελατών"
      description="Σχόλια πελατών σε εκκρεμότητα και ροή ελέγχου για την ομάδα καταλόγου."
      metrics={moduleMetrics}
    >
      {error ? <Alert variant="danger">{error}</Alert> : null}

      <Card className="custom-card mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col xl={5} md={6}>
              <Form.Label>Αναζήτηση</Form.Label>
              <Form.Control
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Είδος, barcode, πελάτης, σχόλιο"
              />
            </Col>
            <Col xl={3} md={3}>
              <Form.Label>Κατάσταση</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(event) => {
                  setPage(1);
                  setStatusFilter(event.target.value as typeof statusFilter);
                }}
              >
                <option value="all">Όλες οι καταστάσεις</option>
                <option value="new">Νέα</option>
                <option value="under_review">Σε έλεγχο</option>
                <option value="resolved">Επιλύθηκαν</option>
              </Form.Select>
            </Col>
            <Col xl={2} md={3}>
              <Form.Label>Ανά σελίδα</Form.Label>
              <Form.Select
                value={perPage}
                onChange={(event) => {
                  setPage(1);
                  setPerPage(Number(event.target.value));
                }}
              >
                {[15, 30, 50, 100].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="custom-card">
        <Card.Header className="border-bottom-0">
          <Card.Title>Ουρά παρατηρήσεων πελατών</Card.Title>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Φόρτωση παρατηρήσεων...</span>
            </div>
          ) : rows.length ? (
            <>
              <div className="table-responsive">
                <Table className="table text-nowrap text-md-nowrap mb-0">
                  <thead>
                    <tr>
                      <th>Είδος</th>
                      <th>Πελάτης</th>
                      <th>Τύπος</th>
                      <th>Κατάσταση</th>
                      <th>Σχόλιο</th>
                      <th>Ενημερώθηκε</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <div className="fw-semibold">{row.item_title_snapshot || '-'}</div>
                          <div className="text-muted fs-12">{row.item_barcode || '-'}</div>
                        </td>
                        <td>
                          <div>{row.client_name_snapshot || '-'}</div>
                          <div className="text-muted fs-12">{row.client_email_snapshot || '-'}</div>
                        </td>
                        <td>{row.comment_type || '-'}</td>
                        <td>{statusBadge(row.status)}</td>
                        <td style={{ whiteSpace: 'normal', minWidth: '280px' }}>{row.comment_text || '-'}</td>
                        <td>{formatDate(row.updated_at || row.created_at)}</td>
                        <td className="text-end">
                          <Button size="sm" variant="outline-primary" onClick={() => setSelectedRemark(row)}>
                            Έλεγχος
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {pagination.total_pages > 1 ? (
                <div className="d-flex justify-content-end mt-3">
                  <Pagination className="mb-0">{pages}</Pagination>
                </div>
              ) : null}
            </>
          ) : (
            <div className="text-muted">Δεν βρέθηκαν παρατηρήσεις πελατών.</div>
          )}
        </Card.Body>
      </Card>

      <Modal show={Boolean(selectedRemark)} onHide={() => setSelectedRemark(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Έλεγχος παρατήρησης πελάτη</Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitUpdate}>
          <Modal.Body className="d-flex flex-column gap-3">
            {selectedRemark ? (
              <>
                <div className="border rounded p-3 bg-light">
                  <div className="fw-semibold">{selectedRemark.item_title_snapshot || '-'}</div>
                  <div className="text-muted fs-12">
                    {selectedRemark.item_barcode || '-'} • {selectedRemark.client_name_snapshot || '-'} • {selectedRemark.client_email_snapshot || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-muted fs-12 mb-1">Σχόλιο πελάτη</div>
                  <div>{selectedRemark.comment_text || '-'}</div>
                </div>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Label>Κατάσταση</Form.Label>
                    <Form.Select value={formStatus} onChange={(event) => setFormStatus(event.target.value as CmsCustomerRemark['status'])}>
                      <option value="new">Νέο</option>
                      <option value="under_review">Σε έλεγχο</option>
                      <option value="resolved">Επιλύθηκε</option>
                    </Form.Select>
                  </Col>
                  <Col md={8}>
                    <Form.Label>Απάντηση admin</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={adminResponse}
                      onChange={(event) => setAdminResponse(event.target.value)}
                      placeholder="Τι πρέπει να γνωρίζει ο πελάτης για αυτή την παρατήρηση;"
                    />
                  </Col>
                  <Col md={12}>
                    <Form.Label>Σημείωση επίλυσης</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={resolutionNote}
                      onChange={(event) => setResolutionNote(event.target.value)}
                      placeholder="Εσωτερική σημείωση για την ενέργεια που έγινε."
                    />
                  </Col>
                </Row>
              </>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setSelectedRemark(null)}>
              Ακύρωση
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Αποθήκευση...' : 'Αποθήκευση ελέγχου'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </ModulePage>
  );
}
