import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import ModulePage from '../ModulePage';
import {
  bulkSearchMissingBarcodes,
  deleteMissingBarcode,
  dismissMissingBarcode,
  fetchMissingBarcodes,
  searchMissingBarcode,
} from '../../../services/cms-missing-barcodes';
import type { MissingBarcodeEntry, MissingBarcodeStatus } from '../../../services/cms-missing-barcodes';

type StatusFilter = 'all' | MissingBarcodeStatus;

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function statusBadge(status: MissingBarcodeStatus) {
  if (status === 'found') return <Badge bg="success">Βρέθηκε</Badge>;
  if (status === 'searching') return <Badge bg="warning">Αναζήτηση...</Badge>;
  if (status === 'not_found') return <Badge bg="danger">Δεν βρέθηκε</Badge>;
  if (status === 'dismissed') return <Badge bg="secondary">Απορρίφθηκε</Badge>;
  return <Badge bg="info">Εκκρεμεί</Badge>;
}

export default function MissingBarcodesPage() {
  const [rows, setRows] = useState<MissingBarcodeEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [clientDomain, setClientDomain] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [busyBarcodes, setBusyBarcodes] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkTopN, setBulkTopN] = useState(20);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const setBusy = (barcode: string, busy: boolean) => {
    setBusyBarcodes((prev) => {
      const next = new Set(prev);
      if (busy) {
        next.add(barcode);
      } else {
        next.delete(barcode);
      }
      return next;
    });
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchMissingBarcodes({
        status: statusFilter === 'all' ? undefined : statusFilter,
        client_domain: clientDomain.trim() || undefined,
        skip: (page - 1) * perPage,
        limit: perPage,
        sort_field: 'request_count',
        sort_dir: -1,
      });
      setRows(response.items);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης λίστας.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [statusFilter, clientDomain, page, perPage]);

  const handleSearchOne = async (barcode: string) => {
    setBusy(barcode, true);
    setError('');
    setInfo('');
    try {
      const result = await searchMissingBarcode(barcode);
      setInfo(
        result.status === 'found'
          ? `Βρέθηκε ${barcode}${result.source ? ` (${result.source})` : ''}.`
          : `Δεν βρέθηκε ${barcode}.`,
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Αποτυχία αναζήτησης για ${barcode}.`);
    } finally {
      setBusy(barcode, false);
    }
  };

  const handleDismiss = async (barcode: string) => {
    setBusy(barcode, true);
    setError('');
    try {
      await dismissMissingBarcode(barcode);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία απόρριψης.');
    } finally {
      setBusy(barcode, false);
    }
  };

  const handleDelete = async (barcode: string) => {
    if (!window.confirm(`Διαγραφή εγγραφής για ${barcode};`)) return;
    setBusy(barcode, true);
    setError('');
    try {
      await deleteMissingBarcode(barcode);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία διαγραφής.');
    } finally {
      setBusy(barcode, false);
    }
  };

  const handleBulkSearch = async () => {
    setBulkBusy(true);
    setError('');
    setInfo('');
    try {
      const result = await bulkSearchMissingBarcodes({ top_n: bulkTopN, status: 'pending' });
      setInfo(`Ψάχτηκαν ${result.started} barcodes — βρέθηκαν ${result.found ?? 0}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία bulk αναζήτησης.');
    } finally {
      setBulkBusy(false);
    }
  };

  const pages = useMemo(() => {
    const items = [] as JSX.Element[];
    const maxButtons = 7;
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, Math.min(start, end - maxButtons + 1));
    for (let i = start; i <= end; i += 1) {
      items.push(
        <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
          {i}
        </Pagination.Item>,
      );
    }
    return items;
  }, [page, totalPages]);

  const moduleMetrics = [
    {
      label: 'Σύνολο φίλτρου',
      value: total.toLocaleString(),
      helper: 'Εγγραφές που ταιριάζουν στα τρέχοντα φίλτρα',
      tone: 'primary' as const,
    },
    {
      label: 'Σελίδα',
      value: `${page}/${totalPages}`,
      helper: `${perPage} ανά σελίδα`,
      tone: 'info' as const,
    },
  ];

  return (
    <ModulePage
      title="Barcodes που ζητήθηκαν αλλά λείπουν"
      description="Προϊόντα που ζήτησαν πελάτες αλλά δεν υπάρχουν στη βάση. Αναζήτηση από εξωτερικές πηγές με ένα κλικ."
      metrics={moduleMetrics}
    >
      {error ? <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert> : null}
      {info ? <Alert variant="success" onClose={() => setInfo('')} dismissible>{info}</Alert> : null}

      <Card className="custom-card mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col xl={3} md={4}>
              <Form.Label>Κατάσταση</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(event) => {
                  setPage(1);
                  setStatusFilter(event.target.value as StatusFilter);
                }}
              >
                <option value="all">Όλες</option>
                <option value="pending">Εκκρεμεί</option>
                <option value="searching">Σε αναζήτηση</option>
                <option value="found">Βρέθηκε</option>
                <option value="not_found">Δεν βρέθηκε</option>
                <option value="dismissed">Απορρίφθηκε</option>
              </Form.Select>
            </Col>
            <Col xl={3} md={4}>
              <Form.Label>Domain πελάτη</Form.Label>
              <Form.Control
                value={clientDomain}
                onChange={(event) => {
                  setPage(1);
                  setClientDomain(event.target.value);
                }}
                placeholder="π.χ. client.example.com"
              />
            </Col>
            <Col xl={2} md={2}>
              <Form.Label>Ανά σελίδα</Form.Label>
              <Form.Select
                value={perPage}
                onChange={(event) => {
                  setPage(1);
                  setPerPage(Number(event.target.value));
                }}
              >
                {[15, 25, 50, 100].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xl={4} md={12}>
              <Form.Label>Bulk αναζήτηση top N pending</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  min={1}
                  max={200}
                  value={bulkTopN}
                  onChange={(event) => setBulkTopN(Math.max(1, Math.min(200, Number(event.target.value) || 1)))}
                  style={{ maxWidth: 120 }}
                />
                <Button onClick={handleBulkSearch} disabled={bulkBusy}>
                  {bulkBusy ? <Spinner animation="border" size="sm" /> : `Ψάξε top ${bulkTopN}`}
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="custom-card">
        <Card.Header className="border-bottom-0">
          <Card.Title>Ουρά missing barcodes</Card.Title>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Φόρτωση...</span>
            </div>
          ) : rows.length ? (
            <>
              <div className="table-responsive">
                <Table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Barcode</th>
                      <th>Αιτήσεις</th>
                      <th>Κατάσταση</th>
                      <th>Πελάτες</th>
                      <th>Πρώτη</th>
                      <th>Τελευταία</th>
                      <th>Endpoint</th>
                      <th>Σημείωση</th>
                      <th className="text-end">Ενέργειες</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const busy = busyBarcodes.has(row.Barcode);
                      return (
                        <tr key={row._id}>
                          <td className="fw-semibold">{row.Barcode}</td>
                          <td>{row.request_count}</td>
                          <td>{statusBadge(row.status)}</td>
                          <td>
                            {(row.client_domains || []).slice(0, 3).map((d) => (
                              <Badge key={d} bg="light" text="dark" className="me-1">
                                {d}
                              </Badge>
                            ))}
                            {(row.client_domains || []).length > 3 ? (
                              <span className="text-muted fs-12">+{(row.client_domains || []).length - 3}</span>
                            ) : null}
                          </td>
                          <td className="text-muted fs-12">{formatDate(row.first_requested_at)}</td>
                          <td className="text-muted fs-12">{formatDate(row.last_requested_at)}</td>
                          <td className="text-muted fs-12">{row.last_endpoint || '-'}</td>
                          <td className="text-muted fs-12" style={{ maxWidth: 200, whiteSpace: 'normal' }}>
                            {row.notes || '-'}
                          </td>
                          <td className="text-end">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="me-1"
                              disabled={busy}
                              onClick={() => handleSearchOne(row.Barcode)}
                            >
                              {busy ? <Spinner animation="border" size="sm" /> : 'Ψάξε'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              className="me-1"
                              disabled={busy || row.status === 'dismissed'}
                              onClick={() => handleDismiss(row.Barcode)}
                            >
                              Απόρριψη
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              disabled={busy}
                              onClick={() => handleDelete(row.Barcode)}
                            >
                              Διαγραφή
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              {totalPages > 1 ? (
                <div className="d-flex justify-content-end mt-3">
                  <Pagination className="mb-0">
                    <Pagination.First disabled={page === 1} onClick={() => setPage(1)} />
                    <Pagination.Prev disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} />
                    {pages}
                    <Pagination.Next disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
                    <Pagination.Last disabled={page === totalPages} onClick={() => setPage(totalPages)} />
                  </Pagination>
                </div>
              ) : null}
            </>
          ) : (
            <div className="text-muted">Δεν υπάρχουν εγγραφές για τα φίλτρα που επέλεξες.</div>
          )}
        </Card.Body>
      </Card>
    </ModulePage>
  );
}
