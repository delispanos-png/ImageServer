import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Modal, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import ModulePage from '../ModulePage';
import {
  deleteDuplicateGroup,
  dismissDuplicateGroup,
  fetchDuplicateGroupDetail,
  fetchDuplicateGroups,
  mergeDuplicateGroup,
} from '../../../services/cms-duplicates';
import type { DuplicateGroup, DuplicateProduct, DuplicateStatus } from '../../../services/cms-duplicates';

type StatusFilter = 'all' | DuplicateStatus;

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function statusBadge(status: DuplicateStatus) {
  if (status === 'merged') return <Badge bg="success">Συγχωνεύτηκε</Badge>;
  if (status === 'dismissed') return <Badge bg="secondary">Απορρίφθηκε</Badge>;
  if (status === 'stale') return <Badge bg="light" text="dark">Stale</Badge>;
  return <Badge bg="info">Εκκρεμεί</Badge>;
}

export default function DuplicatesPage() {
  const [rows, setRows] = useState<DuplicateGroup[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [busy, setBusy] = useState<Set<string>>(new Set());

  const [reviewGroup, setReviewGroup] = useState<DuplicateGroup | null>(null);
  const [reviewProducts, setReviewProducts] = useState<DuplicateProduct[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [keeper, setKeeper] = useState('');
  const [merging, setMerging] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const setItemBusy = (id: string, v: boolean) => {
    setBusy((prev) => {
      const next = new Set(prev);
      if (v) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchDuplicateGroups({
        status: statusFilter === 'all' ? 'all' : statusFilter,
        skip: (page - 1) * perPage,
        limit: perPage,
        sort_field: 'barcode_count',
        sort_dir: -1,
      });
      setRows(response.items);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [statusFilter, page, perPage]);

  const openReview = async (group: DuplicateGroup) => {
    setReviewGroup(group);
    setReviewProducts([]);
    setKeeper(group.keeper_recommended || group.barcodes[0] || '');
    setReviewLoading(true);
    try {
      const detail = await fetchDuplicateGroupDetail(group._id);
      setReviewProducts(detail.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης λεπτομερειών.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleMerge = async () => {
    if (!reviewGroup || !keeper) return;
    const retire = reviewGroup.barcodes.filter((b) => b !== keeper);
    if (retire.length === 0) {
      setError('Πρέπει να υπάρχει τουλάχιστον ένα retire barcode.');
      return;
    }
    if (!window.confirm(`Συγχώνευση: keeper=${keeper}, retire=${retire.join(', ')}. Συνέχεια;`)) return;
    setMerging(true);
    setError('');
    try {
      const result = await mergeDuplicateGroup(reviewGroup._id, {
        keeper_barcode: keeper,
        retire_barcodes: retire,
      });
      setInfo(`Συγχωνεύτηκε ${result.keeper}, διαγράφηκαν ${result.retired_deleted}.`);
      setReviewGroup(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία merge.');
    } finally {
      setMerging(false);
    }
  };

  const handleDismiss = async (group: DuplicateGroup) => {
    setItemBusy(group._id, true);
    setError('');
    try {
      await dismissDuplicateGroup(group._id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία dismiss.');
    } finally {
      setItemBusy(group._id, false);
    }
  };

  const handleDelete = async (group: DuplicateGroup) => {
    if (!window.confirm('Διαγραφή εγγραφής (όχι των προϊόντων);')) return;
    setItemBusy(group._id, true);
    try {
      await deleteDuplicateGroup(group._id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία διαγραφής.');
    } finally {
      setItemBusy(group._id, false);
    }
  };

  const pages = useMemo(() => {
    const items: JSX.Element[] = [];
    const maxButtons = 7;
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, Math.min(start, end - maxButtons + 1));
    for (let i = start; i <= end; i += 1) {
      items.push(
        <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>{i}</Pagination.Item>,
      );
    }
    return items;
  }, [page, totalPages]);

  const moduleMetrics = [
    { label: 'Σύνολο φίλτρου', value: total.toLocaleString(), helper: 'Groups που ταιριάζουν', tone: 'primary' as const },
    { label: 'Σελίδα', value: `${page}/${totalPages}`, helper: `${perPage} ανά σελίδα`, tone: 'info' as const },
  ];

  return (
    <ModulePage
      title="Διπλά Barcodes"
      description="Ομάδες προϊόντων με ίδιο τίτλο αλλά διαφορετικά barcodes — υποψήφια για συγχώνευση."
      metrics={moduleMetrics}
    >
      {error ? <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert> : null}
      {info ? <Alert variant="success" onClose={() => setInfo('')} dismissible>{info}</Alert> : null}

      <Card className="custom-card mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col xl={3} md={4}>
              <Form.Label>Κατάσταση</Form.Label>
              <Form.Select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value as StatusFilter); }}>
                <option value="all">Όλες</option>
                <option value="pending">Εκκρεμεί</option>
                <option value="merged">Συγχωνεύθηκαν</option>
                <option value="dismissed">Απορρίφθηκαν</option>
                <option value="stale">Stale</option>
              </Form.Select>
            </Col>
            <Col xl={2} md={2}>
              <Form.Label>Ανά σελίδα</Form.Label>
              <Form.Select value={perPage} onChange={(e) => { setPage(1); setPerPage(Number(e.target.value)); }}>
                {[15, 25, 50, 100].map((v) => <option key={v} value={v}>{v}</option>)}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="custom-card">
        <Card.Body>
          {loading ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" /><span>Φόρτωση...</span>
            </div>
          ) : rows.length ? (
            <>
              <div className="table-responsive">
                <Table className="table table-sm mb-0 fs-12 align-middle">
                  <thead>
                    <tr className="text-muted text-uppercase fs-11">
                      <th style={{ minWidth: 220 }}>Δείγμα τίτλου</th>
                      <th style={{ width: 90 }} className="text-center">Barcodes</th>
                      <th style={{ width: 70 }} className="text-center">Active</th>
                      <th style={{ width: 90 }} className="text-center">With Image</th>
                      <th style={{ width: 140 }}>Keeper</th>
                      <th style={{ minWidth: 160 }}>Tokens</th>
                      <th style={{ width: 110 }}>Κατάσταση</th>
                      <th style={{ width: 110 }}>Τελευταίο scan</th>
                      <th style={{ width: 220 }} className="text-end">Ενέργειες</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const isBusy = busy.has(row._id);
                      return (
                        <tr key={row._id}>
                          <td style={{ maxWidth: 320, whiteSpace: 'normal' }}>
                            <div className="fw-semibold lh-sm">{row.sample_title || '-'}</div>
                          </td>
                          <td className="text-center"><Badge bg="warning">{row.barcode_count}</Badge></td>
                          <td className="text-center">{row.items_active_count}</td>
                          <td className="text-center">{row.items_with_image}</td>
                          <td><code className="fs-12">{row.keeper_recommended || '-'}</code></td>
                          <td className="text-muted" style={{ maxWidth: 220, whiteSpace: 'normal' }}>
                            {(row.shared_tokens || []).slice(0, 5).join(', ')}
                          </td>
                          <td>{statusBadge(row.status)}</td>
                          <td className="text-muted">{formatDate(row.last_scanned_at)}</td>
                          <td className="text-end text-nowrap">
                            {row.status === 'pending' ? (
                              <>
                                <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openReview(row)}>
                                  Έλεγχος
                                </Button>
                                <Button size="sm" variant="outline-secondary" className="me-1" disabled={isBusy} onClick={() => handleDismiss(row)}>
                                  Διαφορετικά
                                </Button>
                              </>
                            ) : null}
                            <Button size="sm" variant="outline-danger" disabled={isBusy} onClick={() => handleDelete(row)}>
                              {isBusy ? <Spinner animation="border" size="sm" /> : 'Διαγραφή'}
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
            <div className="text-muted">Δεν υπάρχουν duplicates για τα φίλτρα.</div>
          )}
        </Card.Body>
      </Card>

      <Modal show={Boolean(reviewGroup)} onHide={() => setReviewGroup(null)} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Έλεγχος duplicates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviewLoading ? (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" /><span>Φόρτωση...</span>
            </div>
          ) : (
            <>
              <div className="mb-3 fw-semibold fs-14">{reviewGroup?.sample_title}</div>
              <div className="table-responsive">
                <Table className="table-sm fs-12 align-middle mb-2" style={{ tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: 48 }} />
                    <col style={{ width: 120 }} />
                    <col />
                    <col style={{ width: 80 }} />
                    <col style={{ width: 60 }} />
                    <col style={{ width: 200 }} />
                  </colgroup>
                  <thead>
                    <tr className="text-muted text-uppercase fs-11">
                      <th className="text-center">Keep</th>
                      <th>Barcode</th>
                      <th>Τίτλος</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Image</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewProducts.map((p) => {
                      const desc = String(p.cms_description || '').trim();
                      return (
                        <tr key={p.Barcode} className={p.Barcode === keeper ? 'table-success' : ''}>
                          <td className="text-center">
                            <Form.Check
                              type="radio"
                              name="keeper"
                              checked={keeper === p.Barcode}
                              onChange={() => setKeeper(p.Barcode)}
                            />
                          </td>
                          <td className="text-break"><code className="fs-12">{p.Barcode}</code></td>
                          <td style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                            <div className="fw-semibold lh-sm">{p.cms_title || p.Title || '-'}</div>
                          </td>
                          <td className="text-center">
                            {p.cms_status === 'active'
                              ? <Badge bg="success" className="fs-11">active</Badge>
                              : <Badge bg="secondary" className="fs-11">inactive</Badge>}
                          </td>
                          <td className="text-center">{p.Img_src ? '✓' : '—'}</td>
                          <td className="text-muted" style={{ whiteSpace: 'normal', wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '3.6em', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }} title={desc}>
                            {desc ? (desc.length > 140 ? desc.slice(0, 140) + '…' : desc) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              <Alert variant="warning" className="mb-0 fs-12">
                Η συγχώνευση κρατάει το επιλεγμένο barcode και διαγράφει τα υπόλοιπα από το <code>db.products</code>.
                Τα διαγραφέντα μένουν στο <code>cms_retired_products</code> για audit.
                Τα barcodes τους αποθηκεύονται στο <code>barcode_aliases</code> του keeper.
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setReviewGroup(null)}>Ακύρωση</Button>
          <Button variant="danger" disabled={merging || !keeper} onClick={handleMerge}>
            {merging ? <Spinner animation="border" size="sm" /> : `Συγχώνευση (-${reviewProducts.length - 1})`}
          </Button>
        </Modal.Footer>
      </Modal>
    </ModulePage>
  );
}
