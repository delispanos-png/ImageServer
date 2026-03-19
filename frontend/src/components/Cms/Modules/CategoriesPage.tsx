import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Modal, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import ModulePage from '../ModulePage';
import { createCategory, fetchCategories, fetchCategoriesPage, updateCategory } from '../../../services/cms-catalog';
import type { CmsCategory, CmsCategoryPayload } from '../../../types';

interface CategoryFormState {
  name: string;
  slug: string;
  description: string;
  parent_id: string;
  is_active: boolean;
}

const initialFormState: CategoryFormState = {
  name: '',
  slug: '',
  description: '',
  parent_id: '',
  is_active: true,
};

function formatDate(value: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function toPayload(state: CategoryFormState): CmsCategoryPayload {
  return {
    name: state.name.trim(),
    slug: state.slug.trim() || undefined,
    description: state.description.trim(),
    parent_id: state.parent_id || null,
    is_active: state.is_active,
  };
}

function buildCategoryMap(categories: CmsCategory[]) {
  return new Map(categories.map((category) => [category.id, category]));
}

function resolveCategoryPath(category: CmsCategory | null | undefined, categoryMap: Map<string, CmsCategory>) {
  const path: CmsCategory[] = [];
  const visited = new Set<string>();
  let current = category;
  while (current && !visited.has(current.id)) {
    path.unshift(current);
    visited.add(current.id);
    current = current.parent_id ? categoryMap.get(current.parent_id) ?? null : null;
  }
  return path;
}

function categoryLevel(category: CmsCategory | null | undefined, categoryMap: Map<string, CmsCategory>) {
  return resolveCategoryPath(category, categoryMap).length;
}

function categoryPathLabels(category: CmsCategory | null | undefined, categoryMap: Map<string, CmsCategory>) {
  return resolveCategoryPath(category, categoryMap).map((entry) => entry.name);
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CmsCategory[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CmsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [category1Filter, setCategory1Filter] = useState('');
  const [category2Filter, setCategory2Filter] = useState('');
  const [category3Filter, setCategory3Filter] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 1,
  });
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CmsCategory | null>(null);
  const [formState, setFormState] = useState<CategoryFormState>(initialFormState);

  const loadCategoryOptions = async () => {
    try {
      const data = await fetchCategories();
      setCategoryOptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης επιλογών κατηγορίας.');
    }
  };

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchCategoriesPage({
        search,
        is_active: statusFilter === 'all' ? undefined : statusFilter,
        category_1: category1Filter || undefined,
        category_2: category2Filter || undefined,
        category_3: category3Filter || undefined,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setCategories(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης κατηγοριών.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategoryOptions();
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [search, statusFilter, category1Filter, category2Filter, category3Filter, page, perPage, sortBy, sortOrder]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, category1Filter, category2Filter, category3Filter, perPage, sortBy, sortOrder]);

  const categoryMap = useMemo(() => buildCategoryMap(categoryOptions), [categoryOptions]);
  const categoryLookup = useMemo(() => {
    return new Map(categoryOptions.map((category) => [category.id, category.name]));
  }, [categoryOptions]);

  const parentOptions = useMemo(() => {
    return categoryOptions
      .filter((category) => category.id !== editingCategory?.id)
      .filter((category) => categoryLevel(category, categoryMap) < 3);
  }, [categoryOptions, editingCategory, categoryMap]);
  const category1Options = useMemo(
    () =>
      Array.from(
        new Set(
          categoryOptions
            .map((category) => (category.category_1 || '').trim())
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [categoryOptions],
  );
  const category2Options = useMemo(
    () =>
      Array.from(
        new Set(
          categoryOptions
            .filter((category) => !category1Filter || category.category_1 === category1Filter)
            .map((category) => (category.category_2 || '').trim())
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [categoryOptions, category1Filter],
  );
  const category3Options = useMemo(
    () =>
      Array.from(
        new Set(
          categoryOptions
            .filter((category) => (!category1Filter || category.category_1 === category1Filter) && (!category2Filter || category.category_2 === category2Filter))
            .map((category) => (category.category_3 || '').trim())
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [categoryOptions, category1Filter, category2Filter],
  );

  const selectedParent = useMemo(
    () => (formState.parent_id ? categoryMap.get(formState.parent_id) ?? null : null),
    [formState.parent_id, categoryMap],
  );
  const selectedParentPath = useMemo(
    () => categoryPathLabels(selectedParent, categoryMap),
    [selectedParent, categoryMap],
  );
  const nextCategoryLevel = useMemo(
    () => selectedParentPath.length + 1,
    [selectedParentPath],
  );
  const categoryPreviewLevels = useMemo(() => {
    const preview = ['', '', ''];
    selectedParentPath.slice(0, 3).forEach((value, index) => {
      preview[index] = value;
    });
    if (formState.name.trim()) {
      preview[Math.min(selectedParentPath.length, 2)] = formState.name.trim();
    }
    return preview;
  }, [formState.name, selectedParentPath]);

  const activeFilterCount = [
    Boolean(search.trim()),
    statusFilter !== 'all',
    Boolean(category1Filter),
    Boolean(category2Filter),
    Boolean(category3Filter),
  ].filter(Boolean).length;

  const moduleMetrics = [
    {
      label: 'Φιλτραρισμένες εγγραφές',
      value: pagination.total.toLocaleString(),
      helper: 'Κατηγορίες που ταιριάζουν στα φίλτρα ιεραρχίας',
      tone: 'primary' as const,
    },
    {
      label: 'Ενεργά φίλτρα',
      value: activeFilterCount,
      helper: activeFilterCount ? 'Έχουν εφαρμοστεί φίλτρα αναζήτησης/κατάστασης/διαδρομής' : 'Προβολή όλων των κατηγοριών',
      tone: activeFilterCount ? ('warning' as const) : ('info' as const),
    },
    {
      label: 'Σελίδα',
      value: `${pagination.page}/${Math.max(pagination.total_pages, 1)}`,
      helper: `${perPage} ανά σελίδα`,
      tone: 'success' as const,
    },
  ];

  const openCreate = () => {
    setEditingCategory(null);
    setFormState(initialFormState);
    setShowModal(true);
  };

  const openEdit = (category: CmsCategory) => {
    setEditingCategory(category);
    setFormState({
      name: category.name,
      slug: category.slug,
      description: category.description,
      parent_id: category.parent_id ?? '',
      is_active: category.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (nextCategoryLevel > 3) {
        throw new Error('Μπορείς να δημιουργήσεις μόνο μέχρι Κατηγορία 3.');
      }
      if (editingCategory) {
        await updateCategory(editingCategory.id, toPayload(formState));
      } else {
        await createCategory(toPayload(formState));
      }
      setShowModal(false);
      await loadCategoryOptions();
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία αποθήκευσης κατηγορίας.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModulePage
      title="Κατηγορίες"
      description="Διαχείριση ταξινομίας με ιεραρχία, κατάσταση ενεργοποίησης, πλήθος ειδών και επεξεργάσιμα μεταδεδομένα."
      metrics={moduleMetrics}
    >
      {error ? <Alert variant="danger">{error}</Alert> : null}

      <Row className="mb-4 g-3 align-items-end">
        <Col xl={4} md={6}>
          <Form.Label>Αναζήτηση</Form.Label>
          <Form.Control value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Αναζήτηση κατηγοριών" />
        </Col>
        <Col xl={3} md={4}>
          <Form.Label>Κατάσταση</Form.Label>
          <Form.Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Όλες</option>
            <option value="true">Ενεργές</option>
            <option value="false">Ανενεργές</option>
          </Form.Select>
        </Col>
        <Col xl={3} md={4}>
          <Form.Label>Κατηγορία 1</Form.Label>
          <Form.Select value={category1Filter} onChange={(event) => { setCategory1Filter(event.target.value); setCategory2Filter(''); setCategory3Filter(''); }}>
            <option value="">Όλες οι κατηγορίες 1</option>
            {category1Options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xl={3} md={4}>
          <Form.Label>Κατηγορία 2</Form.Label>
          <Form.Select value={category2Filter} onChange={(event) => { setCategory2Filter(event.target.value); setCategory3Filter(''); }}>
            <option value="">Όλες οι κατηγορίες 2</option>
            {category2Options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xl={3} md={4}>
          <Form.Label>Κατηγορία 3</Form.Label>
          <Form.Select value={category3Filter} onChange={(event) => setCategory3Filter(event.target.value)}>
            <option value="">Όλες οι κατηγορίες 3</option>
            {category3Options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xl={3} md={4} className="text-md-end">
          <Button onClick={openCreate}>Νέα κατηγορία</Button>
        </Col>
      </Row>

      <Row className="mb-4 g-3 align-items-end">
        <Col xl={3} md={4}>
          <Form.Label>Ταξινόμηση</Form.Label>
          <Form.Select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="updated_at">Ενημερώθηκε</option>
            <option value="created_at">Δημιουργήθηκε</option>
            <option value="name">Όνομα</option>
            <option value="slug">Slug</option>
            <option value="status">Κατάσταση</option>
            <option value="items_count">Πλήθος ειδών</option>
          </Form.Select>
        </Col>
        <Col xl={3} md={4}>
          <Form.Label>Σειρά</Form.Label>
          <Form.Select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as 'asc' | 'desc')}>
            <option value="desc">Φθίνουσα</option>
            <option value="asc">Αύξουσα</option>
          </Form.Select>
        </Col>
        <Col xl={3} md={4}>
          <Form.Label>Ανά σελίδα</Form.Label>
          <Form.Select value={perPage} onChange={(event) => setPerPage(Number(event.target.value))}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Form.Select>
        </Col>
        <Col xl={3} md={12} className="text-md-end">
          <div className="text-muted fs-12">
            Σύνολο αποτελεσμάτων: <span className="fw-semibold">{pagination.total}</span>
          </div>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <Card.Title>Λίστα κατηγοριών</Card.Title>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="py-4 text-center">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            <>
              <Table responsive className="table table-striped mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Όνομα</th>
                    <th>Επίπεδο</th>
                    <th>Κατηγορία 1</th>
                    <th>Κατηγορία 2</th>
                    <th>Κατηγορία 3</th>
                    <th>Πλήθος ειδών</th>
                    <th>Κατάσταση</th>
                    <th>Ενημερώθηκε</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length ? (
                    categories.map((category) => {
                      const path = categoryPathLabels(category, categoryMap);
                      return (
                      <tr key={category.id}>
                        <td>
                          <div className="fw-semibold">{category.name}</div>
                          <div className="text-muted fs-12">{category.description || 'Δεν υπάρχει περιγραφή'}</div>
                        </td>
                        <td>{path.length || 1}</td>
                        <td>{path[0] || '-'}</td>
                        <td>{path[1] || '-'}</td>
                        <td>{path[2] || '-'}</td>
                        <td>{category.items_count}</td>
                        <td>
                          <Badge bg={category.is_active ? 'success' : 'secondary'}>
                            {category.is_active ? 'Ενεργή' : 'Ανενεργή'}
                          </Badge>
                        </td>
                        <td>{formatDate(category.updated_at)}</td>
                        <td>
                          <Button size="sm" variant="outline-primary" onClick={() => openEdit(category)}>
                            Επεξεργασία
                          </Button>
                        </td>
                      </tr>
                    )})
                    ) : (
                    <tr>
                      <td colSpan={9} className="text-center text-muted py-4">
                        Δεν βρέθηκαν κατηγορίες.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {pagination.total_pages > 1 ? (
                <div className="d-flex justify-content-end mt-3">
                  <Pagination className="mb-0">
                    <Pagination.First onClick={() => setPage(1)} disabled={pagination.page === 1} />
                    <Pagination.Prev onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={pagination.page === 1} />
                    <Pagination.Item active>{pagination.page}</Pagination.Item>
                    <Pagination.Next
                      onClick={() => setPage((prev) => Math.min(pagination.total_pages, prev + 1))}
                      disabled={pagination.page >= pagination.total_pages}
                    />
                    <Pagination.Last
                      onClick={() => setPage(pagination.total_pages)}
                      disabled={pagination.page >= pagination.total_pages}
                    />
                  </Pagination>
                </div>
              ) : null}
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingCategory ? 'Επεξεργασία κατηγορίας' : 'Νέα κατηγορία'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="mb-3">
              <Form.Label>Όνομα</Form.Label>
              <Form.Control
                required
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div className="mb-3">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                value={formState.slug}
                onChange={(event) => setFormState((prev) => ({ ...prev, slug: event.target.value }))}
                placeholder="Προαιρετικό"
              />
            </div>
            <div className="mb-3">
              <Form.Label>Γονική κατηγορία</Form.Label>
              <Form.Select
                value={formState.parent_id}
                onChange={(event) => setFormState((prev) => ({ ...prev, parent_id: event.target.value }))}
              >
                <option value="">Χωρίς γονική</option>
                {parentOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {categoryPathLabels(category, categoryMap).join(' / ')}
                  </option>
                ))}
              </Form.Select>
            </div>
            <Row className="g-3 mb-3">
              <Col md={3}>
                <div className="border rounded p-3 h-100">
                  <div className="text-muted fs-12 mb-1">Επίπεδο</div>
                  <div className="fw-semibold">Κατηγορία {Math.min(nextCategoryLevel, 3)}</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="border rounded p-3 h-100">
                  <div className="text-muted fs-12 mb-1">Κατηγορία 1</div>
                  <div className="fw-semibold">{categoryPreviewLevels[0] || '-'}</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="border rounded p-3 h-100">
                  <div className="text-muted fs-12 mb-1">Κατηγορία 2</div>
                  <div className="fw-semibold">{categoryPreviewLevels[1] || '-'}</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="border rounded p-3 h-100">
                  <div className="text-muted fs-12 mb-1">Κατηγορία 3</div>
                  <div className="fw-semibold">{categoryPreviewLevels[2] || '-'}</div>
                </div>
              </Col>
            </Row>
            <div className="mb-3">
              <Form.Label>Περιγραφή</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formState.description}
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
            <Form.Check
              type="switch"
              id="category-active-toggle"
              label="Η κατηγορία είναι ενεργή"
              checked={formState.is_active}
              onChange={(event) => setFormState((prev) => ({ ...prev, is_active: event.target.checked }))}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowModal(false)}>
              Ακύρωση
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Αποθήκευση...' : editingCategory ? 'Αποθήκευση αλλαγών' : 'Δημιουργία κατηγορίας'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </ModulePage>
  );
}
