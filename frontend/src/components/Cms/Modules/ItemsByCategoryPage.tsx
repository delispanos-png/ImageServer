import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ModulePage from '../ModulePage';
import { fetchCategories, fetchItems } from '../../../services/cms-catalog';
import type { CmsCategory, CmsItem } from '../../../types';

function formatDate(value: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function statusBadge(status: string) {
  const label = status === 'inactive' ? 'Ανενεργό' : status === 'active' ? 'Ενεργό' : status || 'Ενεργό';
  return <Badge bg={status === 'inactive' ? 'danger' : 'success'}>{label}</Badge>;
}

type LevelFilter = 'all' | '1' | '2' | '3';

export default function ItemsByCategoryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CmsCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CmsCategory | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');

  const [items, setItems] = useState<CmsItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState('');
  const [itemsPage, setItemsPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [itemsPagination, setItemsPagination] = useState({
    total: 0,
    page: 1,
    per_page: 15,
    total_pages: 1,
  });

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      setCategoriesError('');
      try {
        const data = await fetchCategories({ is_active: 'true', sort_by: 'updated_at', sort_order: 'desc' });
        setCategories(data);
      } catch (error) {
        setCategoriesError(error instanceof Error ? error.message : 'Αποτυχία φόρτωσης κατηγοριών.');
      } finally {
        setLoadingCategories(false);
      }
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setItems([]);
      setItemsPagination((current) => ({ ...current, total: 0, total_pages: 1, page: 1 }));
      return;
    }

    const loadItems = async () => {
      setLoadingItems(true);
      setItemsError('');
      try {
        const response = await fetchItems({
          category_1: selectedCategory.category_1 || undefined,
          category_2: selectedCategory.category_2 || undefined,
          category_3: selectedCategory.category_3 || undefined,
          page: itemsPage,
          per_page: itemsPerPage,
          sort_by: 'updated_at',
          sort_order: 'desc',
        });
        setItems(response.data);
        setItemsPagination(response.pagination);
      } catch (error) {
        setItemsError(error instanceof Error ? error.message : 'Αποτυχία φόρτωσης ειδών για την επιλεγμένη κατηγορία.');
      } finally {
        setLoadingItems(false);
      }
    };

    void loadItems();
  }, [selectedCategory, itemsPage, itemsPerPage]);

  useEffect(() => {
    setItemsPage(1);
  }, [selectedCategory, itemsPerPage]);

  const filteredCategories = useMemo(() => {
    const search = categorySearch.trim().toLowerCase();
    return categories.filter((category) => {
      if (levelFilter !== 'all' && String(category.level || 1) !== levelFilter) {
        return false;
      }
      if (!search) {
        return true;
      }
      const haystack = [
        category.name,
        category.category_1,
        category.category_2,
        category.category_3,
        ...(category.path || []),
      ]
        .filter(Boolean)
        .join(' / ')
        .toLowerCase();
      return haystack.includes(search);
    });
  }, [categories, categorySearch, levelFilter]);

  const selectedPath = selectedCategory?.path?.length
    ? selectedCategory.path.join(' / ')
    : [selectedCategory?.category_1, selectedCategory?.category_2, selectedCategory?.category_3].filter(Boolean).join(' / ');

  const activeFilterCount = [
    Boolean(categorySearch.trim()),
    levelFilter !== 'all',
  ].filter(Boolean).length;

  const moduleMetrics = [
    {
      label: 'Εμφανείς κατηγορίες',
      value: filteredCategories.length.toLocaleString(),
      helper: 'Κατηγορίες που ταιριάζουν στα φίλτρα',
      tone: 'primary' as const,
    },
    {
      label: 'Είδη στην κατηγορία',
      value: selectedCategory ? itemsPagination.total.toLocaleString() : '—',
      helper: selectedCategory ? 'Είδη που ανήκουν στην επιλεγμένη κατηγορία' : 'Επίλεξε κατηγορία για να δεις τα είδη της',
      tone: selectedCategory ? ('success' as const) : ('info' as const),
    },
    {
      label: 'Ενεργά φίλτρα',
      value: activeFilterCount,
      helper: activeFilterCount ? 'Εφαρμοσμένα φίλτρα περιήγησης' : 'Προβολή όλων των διαθέσιμων κατηγοριών',
      tone: activeFilterCount ? ('warning' as const) : ('info' as const),
    },
  ];

  return (
    <ModulePage
      title="Είδη ανά κατηγορία"
      description="Περιήγηση στην ταξινομία και έλεγχος των ειδών που έχουν αντιστοιχιστεί σε κάθε κατηγορία."
      metrics={moduleMetrics}
    >
      <Row className="g-4">
        <Col xl={5}>
          <Card className="h-100">
            <Card.Header>
              <Card.Title>Περιήγηση κατηγοριών</Card.Title>
            </Card.Header>
            <Card.Body className="d-flex flex-column gap-3">
              {categoriesError ? <Alert variant="danger" className="mb-0">{categoriesError}</Alert> : null}
              <Row className="g-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Αναζήτηση κατηγοριών</Form.Label>
                    <Form.Control
                      value={categorySearch}
                      onChange={(event) => setCategorySearch(event.target.value)}
                      placeholder="Κατηγορία 1, Κατηγορία 2, Κατηγορία 3"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Επίπεδο</Form.Label>
                    <Form.Select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value as LevelFilter)}>
                      <option value="all">Όλα</option>
                      <option value="1">Επίπεδο 1</option>
                      <option value="2">Επίπεδο 2</option>
                      <option value="3">Επίπεδο 3</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-muted fs-12">
                Σύνολο κατηγοριών: <strong>{filteredCategories.length}</strong>
              </div>

              {loadingCategories ? (
                <div className="py-5 text-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <Table responsive hover className="table table-striped align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Επίπεδο</th>
                        <th>Είδη</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.length ? (
                        filteredCategories.map((category) => {
                          const isSelected = selectedCategory?.id === category.id;
                          return (
                            <tr
                              key={category.id}
                              className={isSelected ? 'table-primary' : ''}
                              style={{ cursor: 'pointer' }}
                              onClick={() => setSelectedCategory(category)}
                            >
                              <td>
                                <div className="fw-semibold">{category.name}</div>
                                <div className="text-muted fs-12">
                                  {[category.category_1, category.category_2, category.category_3].filter(Boolean).join(' / ') || '-'}
                                </div>
                              </td>
                              <td>{category.level || 1}</td>
                              <td>
                                <Badge bg="light" text="dark">
                                  {category.items_count ?? 0}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center text-muted py-4">
                            Δεν βρέθηκαν κατηγορίες.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xl={7}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">Είδη στην επιλεγμένη κατηγορία</Card.Title>
              {selectedCategory ? (
                <Button variant="outline-primary" size="sm" onClick={() => navigate('/items')}>
                  Άνοιγμα ενότητας ειδών
                </Button>
              ) : null}
            </Card.Header>
            <Card.Body className="d-flex flex-column gap-3">
              {!selectedCategory ? (
                <Alert variant="info" className="mb-0">
                  Επίλεξε κατηγορία από τη λίστα για να δεις τα είδη που ανήκουν σε αυτή.
                </Alert>
              ) : (
                <>
                  <div className="border rounded p-3 bg-light">
                    <div className="text-muted fs-12 mb-1">Διαδρομή κατηγορίας</div>
                    <div className="fw-semibold">{selectedPath || selectedCategory.name}</div>
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      <Badge bg="secondary">Επίπεδο {selectedCategory.level || 1}</Badge>
                      <Badge bg="primary">{selectedCategory.items_count ?? 0} είδη</Badge>
                      {selectedCategory.is_active ? <Badge bg="success">ενεργή</Badge> : <Badge bg="danger">ανενεργή</Badge>}
                    </div>
                  </div>

                  {itemsError ? <Alert variant="danger" className="mb-0">{itemsError}</Alert> : null}

                  {loadingItems ? (
                    <div className="py-5 text-center">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    <>
                      <Table responsive className="table table-striped align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Barcode</th>
                            <th>Κατάσταση</th>
                            <th>Ενημερώθηκε</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.length ? (
                            items.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  <div className="fw-semibold">{item.title || '-'}</div>
                                  <div className="text-muted fs-12">{[item.category_1, item.category_2, item.category_3].filter(Boolean).join(' / ') || '-'}</div>
                                </td>
                                <td>{item.barcode || '-'}</td>
                                <td>{statusBadge(item.status)}</td>
                                <td>{formatDate(item.updated_at)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center text-muted py-4">
                                No items found for this category.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>

                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div className="text-muted fs-12">
                          Σύνολο ειδών: <strong>{itemsPagination.total}</strong>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Form.Label className="mb-0 text-muted fs-12">Ανά σελίδα</Form.Label>
                          <Form.Select
                            size="sm"
                            style={{ width: 96 }}
                            value={itemsPerPage}
                            onChange={(event) => setItemsPerPage(Number(event.target.value))}
                          >
                            {[15, 25, 50, 100].map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </div>

                      {itemsPagination.total_pages > 1 ? (
                        <Pagination className="mb-0">
                          <Pagination.First disabled={itemsPage === 1} onClick={() => setItemsPage(1)} />
                          <Pagination.Prev disabled={itemsPage === 1} onClick={() => setItemsPage((current) => Math.max(1, current - 1))} />
                          <Pagination.Item active>{itemsPage}</Pagination.Item>
                          <Pagination.Next
                            disabled={itemsPage >= itemsPagination.total_pages}
                            onClick={() => setItemsPage((current) => Math.min(itemsPagination.total_pages, current + 1))}
                          />
                          <Pagination.Last
                            disabled={itemsPage >= itemsPagination.total_pages}
                            onClick={() => setItemsPage(itemsPagination.total_pages)}
                          />
                        </Pagination>
                      ) : null}
                    </>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </ModulePage>
  );
}
