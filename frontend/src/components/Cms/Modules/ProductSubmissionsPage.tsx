import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import ModulePage from '../ModulePage';
import {
  approveSubmission,
  getSubmission,
  listSubmissions,
  rejectSubmission,
  rescanSubmission,
  type ProductSubmission,
  type SubmissionStatus,
} from '../../../services/cms-product-submissions';

function formatDate(value?: string) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function statusBadge(status: SubmissionStatus) {
  const variant: Record<SubmissionStatus, string> = {
    pending: 'secondary',
    searching: 'info',
    needs_review: 'warning',
    approved: 'success',
    rejected: 'dark',
    failed: 'danger',
  };
  const label: Record<SubmissionStatus, string> = {
    pending: 'Εκκρεμότητα',
    searching: 'Αναζήτηση',
    needs_review: 'Προς αξιολόγηση',
    approved: 'Εγκρίθηκε',
    rejected: 'Απορρίφθηκε',
    failed: 'Σφάλμα',
  };
  return <Badge bg={variant[status]}>{label[status]}</Badge>;
}

export default function ProductSubmissionsPage() {
  const [items, setItems] = useState<ProductSubmission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | ''>('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ProductSubmission | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionPending, setActionPending] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const loadList = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await listSubmissions({
        status: statusFilter || undefined,
        barcode: search.trim() || undefined,
        limit: 50,
      });
      setItems(response.data);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης υποβολών');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    setSelected(null);
    setAdminNotes('');
    try {
      const doc = await getSubmission(id);
      setSelected(doc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης λεπτομερειών');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRescan = async () => {
    if (!selected) return;
    setActionPending(true);
    try {
      const updated = await rescanSubmission(selected.id);
      setSelected(updated);
      await loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία rescan');
    } finally {
      setActionPending(false);
    }
  };

  const handleApprove = async (sourceKey: string) => {
    if (!selected) return;
    if (!window.confirm(`Έγκριση & εισαγωγή από ${sourceKey};`)) return;
    setActionPending(true);
    try {
      const updated = await approveSubmission(selected.id, { source_key: sourceKey, admin_notes: adminNotes });
      setSelected(updated);
      await loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία έγκρισης');
    } finally {
      setActionPending(false);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    if (!window.confirm('Απόρριψη υποβολής;')) return;
    setActionPending(true);
    try {
      const updated = await rejectSubmission(selected.id, adminNotes);
      setSelected(updated);
      await loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία απόρριψης');
    } finally {
      setActionPending(false);
    }
  };

  const metrics = [
    {
      label: 'Σύνολο υποβολών',
      value: total.toLocaleString(),
      helper: 'Στο τρέχον φίλτρο',
      tone: 'primary' as const,
    },
  ];

  return (
    <ModulePage
      title="Υποβολές Πελατών"
      description="Πελάτες υποβάλλουν barcode προϊόντων που δεν υπάρχουν στον κατάλογο. Το σύστημα ψάχνει αυτόματα σε όλες τις πηγές."
      metrics={metrics}
    >
      {error ? <Alert variant="danger">{error}</Alert> : null}

      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={3}>
              <Form.Label>Κατάσταση</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(event) => setStatusFilter((event.target.value as SubmissionStatus) || '')}
              >
                <option value="">Όλες</option>
                <option value="needs_review">Προς αξιολόγηση</option>
                <option value="searching">Αναζήτηση</option>
                <option value="pending">Εκκρεμότητα</option>
                <option value="approved">Εγκρίθηκε</option>
                <option value="rejected">Απορρίφθηκε</option>
                <option value="failed">Σφάλμα</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label>Barcode</Form.Label>
              <Form.Control
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Αναζήτηση κατά barcode"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void loadList();
                }}
              />
            </Col>
            <Col md={2}>
              <Button onClick={() => void loadList()} className="w-100">
                Φιλτράρισμα
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Λίστα υποβολών</Card.Title>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : items.length === 0 ? (
            <div className="text-muted">Δεν βρέθηκαν υποβολές.</div>
          ) : (
            <Table responsive className="align-middle">
              <thead>
                <tr>
                  <th>Barcode</th>
                  <th>Πελάτης</th>
                  <th>Τίτλος υποβολής</th>
                  <th>Hits</th>
                  <th>Κατάσταση</th>
                  <th>Υποβλήθηκε</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td><code>{item.Barcode}</code></td>
                    <td>
                      <div>{item.client_name || '-'}</div>
                      <div className="text-muted small">{item.client_email}</div>
                    </td>
                    <td>{item.submitted?.title || '-'}</td>
                    <td>
                      {item.auto_search_results?.hits?.length
                        ? item.auto_search_results.hits.join(', ')
                        : '-'}
                    </td>
                    <td>{statusBadge(item.status)}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>
                      <Button size="sm" variant="outline-primary" onClick={() => void openDetail(item.id)}>
                        Λεπτομέρειες
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={Boolean(selected) || detailLoading} onHide={() => setSelected(null)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Λεπτομέρειες υποβολής</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailLoading ? (
            <Spinner animation="border" size="sm" />
          ) : selected ? (
            <>
              <Row className="g-3 mb-3">
                <Col md={4}><strong>Barcode:</strong> <code>{selected.Barcode}</code></Col>
                <Col md={4}><strong>Πελάτης:</strong> {selected.client_name || '-'} ({selected.client_email})</Col>
                <Col md={4}><strong>Κατάσταση:</strong> {statusBadge(selected.status)}</Col>
                <Col md={6}><strong>Τίτλος (από πελάτη):</strong> {selected.submitted?.title || '-'}</Col>
                <Col md={6}><strong>Brand (από πελάτη):</strong> {selected.submitted?.brand || '-'}</Col>
                <Col xs={12}><strong>Σημείωση πελάτη:</strong> {selected.submitted?.notes || '-'}</Col>
              </Row>

              <hr />
              <h6>Αποτελέσματα αυτόματης αναζήτησης</h6>
              {selected.auto_search_results ? (
                <Table responsive size="sm" className="align-middle">
                  <thead>
                    <tr><th>Πηγή</th><th>Status</th><th>Τίτλος</th><th>Brand</th><th>Κατηγορίες</th><th>Εικόνα</th><th></th></tr>
                  </thead>
                  <tbody>
                    {selected.auto_search_results.sources.map((entry) => {
                      const d = entry.data;
                      return (
                        <tr key={entry.source_key}>
                          <td><strong>{entry.source_key}</strong></td>
                          <td>{entry.status}</td>
                          <td>{d.title || '-'}</td>
                          <td>{d.brand || '-'}</td>
                          <td>{[d.category_1, d.category_2, d.category_3].filter(Boolean).join(' › ') || '-'}</td>
                          <td>
                            {d.image_url ? <img src={d.image_url} alt="" style={{ maxWidth: 50, maxHeight: 50 }} /> : '-'}
                          </td>
                          <td>
                            {entry.status === 'hit' && selected.status !== 'approved' && selected.status !== 'rejected' ? (
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => void handleApprove(entry.source_key)}
                                disabled={actionPending}
                              >
                                Εισαγωγή
                              </Button>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">Δεν έχει ολοκληρωθεί ακόμη η αυτόματη αναζήτηση.</Alert>
              )}

              <hr />
              <Form.Group className="mb-3">
                <Form.Label>Σημειώσεις admin</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={adminNotes}
                  onChange={(event) => setAdminNotes(event.target.value)}
                  placeholder="Προαιρετικές σημειώσεις"
                />
              </Form.Group>
            </>
          ) : (
            <div className="text-muted">Δεν έχει επιλεγεί υποβολή.</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selected && selected.status !== 'approved' && selected.status !== 'rejected' ? (
            <>
              <Button variant="outline-secondary" onClick={() => void handleRescan()} disabled={actionPending}>
                Επανάληψη scan
              </Button>
              <Button variant="outline-danger" onClick={() => void handleReject()} disabled={actionPending}>
                Απόρριψη
              </Button>
            </>
          ) : null}
          <Button variant="light" onClick={() => setSelected(null)}>Κλείσιμο</Button>
        </Modal.Footer>
      </Modal>
    </ModulePage>
  );
}
