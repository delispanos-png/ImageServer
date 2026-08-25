import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Modal, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import ModulePage from '../ModulePage';
import {
  approveBrandQueueItem,
  bulkBrandQueueAction,
  deleteBrandQueueItem,
  dismissBrandQueueItem,
  fetchBrandQueue,
} from '../../../services/cms-brand-queue';
import { fetchCategories } from '../../../services/cms-catalog';
import type { BrandQueueItem, BrandQueueStatus } from '../../../services/cms-brand-queue';
import type { CmsCategory } from '../../../types';

type StatusFilter = 'all' | BrandQueueStatus;

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function statusBadge(status: BrandQueueStatus) {
  if (status === 'approved') return <Badge bg="success">Εγκρίθηκε</Badge>;
  if (status === 'dismissed') return <Badge bg="secondary">Απορρίφθηκε</Badge>;
  if (status === 'duplicate') return <Badge bg="warning">Διπλό</Badge>;
  return <Badge bg="info">Εκκρεμεί</Badge>;
}

export default function BrandQueuePage() {
  const [rows, setRows] = useState<BrandQueueItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [brand, setBrand] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [editing, setEditing] = useState<BrandQueueItem | null>(null);
  const [editBarcode, setEditBarcode] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editC1, setEditC1] = useState('');
  const [editC2, setEditC2] = useState('');
  const [editC3, setEditC3] = useState('');
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CmsCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadCats = async () => {
      setCategoriesLoading(true);
      try {
        const list = await fetchCategories();
        if (!cancelled) setCategories(list);
      } catch {
        // ignore — modal falls back to free-text if categories can't load
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    };
    void loadCats();
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryById = useMemo(() => {
    const map = new Map<string, CmsCategory>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const category1Options = useMemo(
    () =>
      categories
        .filter((c) => !c.parent_id && c.is_active)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, 'el')),
    [categories],
  );

  const findByName = (list: CmsCategory[], name: string) =>
    list.find((c) => c.name.trim().toLowerCase() === name.trim().toLowerCase());

  const selectedC1 = useMemo(() => findByName(category1Options, editC1), [category1Options, editC1]);
  const category2Options = useMemo(
    () =>
      selectedC1
        ? categories
            .filter((c) => c.parent_id === selectedC1.id && c.is_active)
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name, 'el'))
        : [],
    [categories, selectedC1],
  );
  const selectedC2 = useMemo(() => findByName(category2Options, editC2), [category2Options, editC2]);
  const category3Options = useMemo(
    () =>
      selectedC2
        ? categories
            .filter((c) => c.parent_id === selectedC2.id && c.is_active)
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name, 'el'))
        : [],
    [categories, selectedC2],
  );

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const setItemBusy = (id: string, value: boolean) => {
    setBusy((prev) => {
      const next = new Set(prev);
      if (value) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchBrandQueue({
        status: statusFilter === 'all' ? 'all' : statusFilter,
        brand: brand.trim() || undefined,
        skip: (page - 1) * perPage,
        limit: perPage,
        sort_field: 'seen_count',
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
    setSelected(new Set());
  }, [statusFilter, brand, page, perPage]);

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === rows.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rows.map((r) => r._id)));
    }
  };

  const runBulk = async (action: 'dismiss' | 'delete') => {
    if (selected.size === 0) return;
    if (action === 'delete' && !window.confirm(`Διαγραφή ${selected.size} επιλεγμένων;`)) return;
    setBulkBusy(true);
    setError('');
    setInfo('');
    try {
      const result = await bulkBrandQueueAction({
        queue_ids: Array.from(selected),
        action,
      });
      setInfo(
        action === 'dismiss'
          ? `Απορρίφθηκαν ${result.modified}/${result.matched}.`
          : `Διαγράφηκαν ${result.modified}.`,
      );
      setSelected(new Set());
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία bulk action.');
    } finally {
      setBulkBusy(false);
    }
  };

  const openEdit = (item: BrandQueueItem) => {
    setEditing(item);
    setEditBarcode('');
    setEditTitle(item.title || '');
    setEditDescription('');
    setEditC1(item.categories?.Category_1 || '');
    setEditC2(item.categories?.Category_2 || '');
    setEditC3(item.categories?.Category_3 || '');
  };

  const submitApprove = async (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    if (!editBarcode.trim() || !/^\d{4,}$/.test(editBarcode.trim())) {
      setError('Το barcode πρέπει να είναι αριθμός (4+ ψηφία).');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const result = await approveBrandQueueItem(editing._id, {
        barcode: editBarcode.trim(),
        title: editTitle.trim(),
        description: editDescription.trim(),
        category_1: editC1.trim(),
        category_2: editC2.trim(),
        category_3: editC3.trim(),
      });
      if (result.status === 'duplicate') {
        setInfo(`Το barcode ${result.barcode} υπάρχει ήδη στη βάση — η εγγραφή σημειώθηκε ως διπλή.`);
      } else {
        setInfo(`Δημιουργήθηκε προϊόν με barcode ${result.barcode}.`);
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία έγκρισης.');
    } finally {
      setSaving(false);
    }
  };

  const handleDismiss = async (item: BrandQueueItem) => {
    setItemBusy(item._id, true);
    setError('');
    try {
      await dismissBrandQueueItem(item._id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία απόρριψης.');
    } finally {
      setItemBusy(item._id, false);
    }
  };

  const handleDelete = async (item: BrandQueueItem) => {
    if (!window.confirm(`Διαγραφή εγγραφής "${item.title}";`)) return;
    setItemBusy(item._id, true);
    setError('');
    try {
      await deleteBrandQueueItem(item._id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία διαγραφής.');
    } finally {
      setItemBusy(item._id, false);
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
      title="Ουρά Brand Catalog"
      description="Προϊόντα από manufacturer catalogs που δεν έχουν barcode match στη βάση. Συμπλήρωσε barcode και έγκρινε για να προστεθούν."
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
                <option value="approved">Εγκρίθηκε</option>
                <option value="dismissed">Απορρίφθηκε</option>
                <option value="duplicate">Διπλό</option>
              </Form.Select>
            </Col>
            <Col xl={3} md={4}>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                value={brand}
                onChange={(event) => {
                  setPage(1);
                  setBrand(event.target.value);
                }}
                placeholder="π.χ. apivita"
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
                  <option key={v} value={v}>{v}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {selected.size > 0 ? (
        <Card className="custom-card mb-3 bg-light">
          <Card.Body className="d-flex align-items-center gap-3">
            <span className="fw-semibold">{selected.size} επιλεγμένα</span>
            <Button size="sm" variant="outline-secondary" disabled={bulkBusy} onClick={() => runBulk('dismiss')}>
              {bulkBusy ? <Spinner animation="border" size="sm" /> : 'Απόρριψη όλων'}
            </Button>
            <Button size="sm" variant="outline-danger" disabled={bulkBusy} onClick={() => runBulk('delete')}>
              Διαγραφή όλων
            </Button>
            <Button size="sm" variant="link" onClick={() => setSelected(new Set())}>Αποεπιλογή</Button>
          </Card.Body>
        </Card>
      ) : null}

      <Card className="custom-card">
        <Card.Header className="border-bottom-0">
          <Card.Title>Ουρά Brand Catalog</Card.Title>
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
                      <th style={{ width: 40 }}>
                        <Form.Check
                          type="checkbox"
                          checked={rows.length > 0 && selected.size === rows.length}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>Brand</th>
                      <th>Τίτλος</th>
                      <th>Κατηγορία</th>
                      <th>Εικόνα</th>
                      <th>Εμφανίσεις</th>
                      <th>Κατάσταση</th>
                      <th>Πρώτη</th>
                      <th>Τελευταία</th>
                      <th className="text-end">Ενέργειες</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const isBusy = busy.has(row._id);
                      const isSelected = selected.has(row._id);
                      return (
                        <tr key={row._id} className={isSelected ? 'table-active' : ''}>
                          <td>
                            <Form.Check
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelected(row._id)}
                            />
                          </td>
                          <td><Badge bg="dark">{row.brand}</Badge></td>
                          <td style={{ maxWidth: 280, whiteSpace: 'normal' }}>
                            <div className="fw-semibold">{row.title || '-'}</div>
                            {row.source_url ? (
                              <a href={row.source_url} target="_blank" rel="noreferrer" className="fs-12 text-muted">
                                {row.source_url.replace(/^https?:\/\//, '').slice(0, 60)}
                              </a>
                            ) : null}
                          </td>
                          <td className="text-muted fs-12">
                            {[row.categories?.Category_1, row.categories?.Category_2, row.categories?.Category_3].filter(Boolean).join(' › ') || '-'}
                          </td>
                          <td>
                            {row.image ? (
                              <img src={row.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                            ) : '—'}
                          </td>
                          <td>{row.seen_count}</td>
                          <td>
                            {statusBadge(row.status)}
                            {row.resolved_by ? (
                              <div className="text-muted fs-12 mt-1">
                                {row.resolved_by.startsWith('auto:') ? '🤖 ' : ''}
                                {row.resolved_by}
                                {row.resolved_to_barcode ? ` → ${row.resolved_to_barcode}` : ''}
                                {typeof row.match_score === 'number' ? ` (${row.match_score.toFixed(2)})` : ''}
                              </div>
                            ) : null}
                          </td>
                          <td className="text-muted fs-12">{formatDate(row.first_seen_at)}</td>
                          <td className="text-muted fs-12">{formatDate(row.last_seen_at)}</td>
                          <td className="text-end">
                            {row.status === 'pending' ? (
                              <>
                                <Button size="sm" variant="outline-primary" className="me-1" disabled={isBusy} onClick={() => openEdit(row)}>
                                  Έγκριση
                                </Button>
                                <Button size="sm" variant="outline-secondary" className="me-1" disabled={isBusy} onClick={() => handleDismiss(row)}>
                                  Απόρριψη
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
            <div className="text-muted">Δεν υπάρχουν εγγραφές για τα φίλτρα που επέλεξες.</div>
          )}
        </Card.Body>
      </Card>

      <Modal show={Boolean(editing)} onHide={() => setEditing(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Έγκριση brand item</Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitApprove}>
          <Modal.Body className="d-flex flex-column gap-3">
            {editing ? (
              <>
                <div className="border rounded p-3 bg-light">
                  <div className="fw-semibold">{editing.brand} • {editing.title || '-'}</div>
                  {editing.source_url ? (
                    <a href={editing.source_url} target="_blank" rel="noreferrer" className="fs-12 text-muted">
                      {editing.source_url}
                    </a>
                  ) : null}
                </div>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Barcode *</Form.Label>
                    <Form.Control
                      value={editBarcode}
                      onChange={(event) => setEditBarcode(event.target.value)}
                      placeholder="π.χ. 5203069139536"
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Τίτλος</Form.Label>
                    <Form.Control value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
                  </Col>
                  <Col md={12}>
                    <Form.Label>Περιγραφή</Form.Label>
                    <Form.Control as="textarea" rows={3} value={editDescription} onChange={(event) => setEditDescription(event.target.value)} />
                  </Col>
                  <Col md={4}>
                    <Form.Label>
                      Κατηγορία 1
                      {categoriesLoading ? <Spinner animation="border" size="sm" className="ms-2" /> : null}
                    </Form.Label>
                    <Form.Select
                      value={selectedC1 ? selectedC1.name : ''}
                      onChange={(event) => {
                        setEditC1(event.target.value);
                        setEditC2('');
                        setEditC3('');
                      }}
                    >
                      <option value="">— Επιλογή —</option>
                      {category1Options.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </Form.Select>
                    {editC1 && !selectedC1 ? (
                      <div className="fs-12 text-warning mt-1">
                        Το «{editC1}» δεν υπάρχει στις κατηγορίες. Επίλεξε υπάρχουσα.
                      </div>
                    ) : null}
                  </Col>
                  <Col md={4}>
                    <Form.Label>Κατηγορία 2</Form.Label>
                    <Form.Select
                      value={selectedC2 ? selectedC2.name : ''}
                      onChange={(event) => {
                        setEditC2(event.target.value);
                        setEditC3('');
                      }}
                      disabled={!selectedC1}
                    >
                      <option value="">
                        {selectedC1 ? '— Επιλογή —' : 'Επίλεξε πρώτα Κατηγορία 1'}
                      </option>
                      {category2Options.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </Form.Select>
                    {editC2 && selectedC1 && !selectedC2 ? (
                      <div className="fs-12 text-warning mt-1">
                        Το «{editC2}» δεν είναι υπο-κατηγορία της «{selectedC1.name}».
                      </div>
                    ) : null}
                  </Col>
                  <Col md={4}>
                    <Form.Label>Κατηγορία 3</Form.Label>
                    <Form.Select
                      value={editC3}
                      onChange={(event) => setEditC3(event.target.value)}
                      disabled={!selectedC2}
                    >
                      <option value="">
                        {selectedC2 ? '— Επιλογή —' : 'Επίλεξε πρώτα Κατηγορία 2'}
                      </option>
                      {category3Options.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
                <div className="text-muted fs-12">
                  Το προϊόν θα δημιουργηθεί ως inactive. Για ενεργοποίηση χρειάζεται hosted image
                  (κατεβαίνει αυτόματα αν υπάρχει image url στην ουρά).
                </div>
              </>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setEditing(null)}>Ακύρωση</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Αποθήκευση...' : 'Έγκριση & Δημιουργία'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </ModulePage>
  );
}
