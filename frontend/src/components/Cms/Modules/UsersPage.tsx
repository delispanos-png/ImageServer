import { type ReactNode, useEffect, useMemo, useState, type FormEvent } from 'react';
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
import { createUser, fetchUser, fetchUsers, updateUser } from '../../../services/cms-users';
import type { CmsAdminUser, CmsRole } from '../../../types';

function formatDate(value?: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function statusBadge(isActive: boolean) {
  return <Badge bg={isActive ? 'success' : 'secondary'}>{isActive ? 'Ενεργό' : 'Ανενεργό'}</Badge>;
}

function roleBadge(role: CmsRole) {
  const variant =
    role === 'super_admin' ? 'danger' : role === 'admin' ? 'primary' : role === 'editor' ? 'info' : 'secondary';
  return <Badge bg={variant}>{role}</Badge>;
}

export default function UsersPage() {
  const [users, setUsers] = useState<CmsAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'updated_at' | 'created_at' | 'name' | 'email' | 'role' | 'status' | 'last_login_at'>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [pagination, setPagination] = useState({ total: 0, page: 1, per_page: 15, total_pages: 1 });
  const [selectedUser, setSelectedUser] = useState<CmsAdminUser | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<CmsAdminUser | null>(null);
  const [createForm, setCreateForm] = useState({
    full_name: '',
    email: '',
    role: 'editor' as CmsRole,
    password: '',
    is_active: true,
  });

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchUsers({
        search,
        status_filter: statusFilter,
        role_filter: roleFilter === 'all' ? '' : roleFilter,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης χρηστών.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, [search, statusFilter, roleFilter, page, perPage, sortBy, sortOrder]);

  const pages = useMemo(() => {
    const items: ReactNode[] = [];
    for (let index = 1; index <= pagination.total_pages; index += 1) {
      items.push(
        <Pagination.Item key={index} active={index === pagination.page} onClick={() => setPage(index)}>
          {index}
        </Pagination.Item>,
      );
    }
    return items;
  }, [pagination.page, pagination.total_pages]);

  const activeFilterCount = [
    Boolean(search.trim()),
    statusFilter !== 'all',
    roleFilter !== 'all',
  ].filter(Boolean).length;

  const moduleMetrics = [
    {
      label: 'Φιλτραρισμένες εγγραφές',
      value: pagination.total.toLocaleString(),
      helper: 'Χρήστες που ταιριάζουν στα φίλτρα',
      tone: 'primary' as const,
    },
    {
      label: 'Ενεργά φίλτρα',
      value: activeFilterCount,
      helper: activeFilterCount ? 'Έχουν εφαρμοστεί φίλτρα αναζήτησης/κατάστασης/ρόλου' : 'Προβολή όλων των χρηστών',
      tone: activeFilterCount ? ('warning' as const) : ('info' as const),
    },
    {
      label: 'Σελίδα',
      value: `${pagination.page}/${Math.max(pagination.total_pages, 1)}`,
      helper: `${perPage} ανά σελίδα`,
      tone: 'success' as const,
    },
  ];

  const openDetails = async (userId: string) => {
    setDetailsLoading(true);
    setSelectedUser(null);
    try {
      setSelectedUser(await fetchUser(userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης στοιχείων χρήστη.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const openCreate = () => {
    setEditingUser(null);
    setCreateForm({
      full_name: '',
      email: '',
      role: 'editor',
      password: '',
      is_active: true,
    });
    setError('');
    setShowCreateModal(true);
  };

  const openEdit = (user: CmsAdminUser) => {
    setEditingUser(user);
    setCreateForm({
      full_name: user.full_name || '',
      email: user.email || '',
      role: user.role,
      password: '',
      is_active: user.is_active,
    });
    setError('');
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setCreateSubmitting(true);
    setError('');
    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          full_name: createForm.full_name,
          email: createForm.email,
          role: createForm.role,
          password: createForm.password,
          is_active: createForm.is_active,
        });
      } else {
        await createUser(createForm);
      }
      setShowCreateModal(false);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία αποθήκευσης χρήστη.');
    } finally {
      setCreateSubmitting(false);
    }
  };

  return (
    <ModulePage
      title="Χρήστες"
      description="Εσωτερικοί χρήστες CMS με ρόλους, κατάσταση και στοιχεία δραστηριότητας."
      metrics={moduleMetrics}
    >
      {error ? <Alert variant="danger">{error}</Alert> : null}

      <Row className="mb-4 g-3 align-items-end">
        <Col xl={3} md={6}>
          <Form.Label>Αναζήτηση</Form.Label>
          <Form.Control
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            placeholder="Όνομα, email, ρόλος"
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
        <Col xl={2} md={6}>
          <Form.Label>Ρόλος</Form.Label>
          <Form.Select
            value={roleFilter}
            onChange={(event) => {
              setPage(1);
              setRoleFilter(event.target.value);
            }}
          >
            <option value="all">Όλοι οι ρόλοι</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="client">Client</option>
          </Form.Select>
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>Ταξινόμηση</Form.Label>
          <Form.Select
            value={sortBy}
            onChange={(event) => {
              setPage(1);
              setSortBy(event.target.value as typeof sortBy);
            }}
          >
            <option value="updated_at">Ενημερώθηκε</option>
            <option value="created_at">Δημιουργήθηκε</option>
            <option value="name">Όνομα</option>
            <option value="email">Email</option>
            <option value="role">Ρόλος</option>
            <option value="status">Κατάσταση</option>
            <option value="last_login_at">Τελευταία σύνδεση</option>
          </Form.Select>
        </Col>
        <Col xl={1} md={6}>
          <Form.Label>Σειρά</Form.Label>
          <Form.Select
            value={sortOrder}
            onChange={(event) => {
              setPage(1);
              setSortOrder(event.target.value as 'asc' | 'desc');
            }}
          >
            <option value="desc">Φθίνουσα</option>
            <option value="asc">Αύξουσα</option>
          </Form.Select>
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>Ανά σελίδα</Form.Label>
          <Form.Select
            value={perPage}
            onChange={(event) => {
              setPage(1);
              setPerPage(Number(event.target.value));
            }}
          >
            {[15, 30, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xl={2} md={6} className="d-flex justify-content-xl-end">
          <Button className="w-100" onClick={openCreate}>
            Νέος χρήστης
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <Card.Title>Λίστα χρηστών</Card.Title>
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
                    <th>Email</th>
                    <th>Ρόλος</th>
                    <th>Κατάσταση</th>
                    <th>Τελευταία σύνδεση</th>
                    <th>Ενημερώθηκε</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.full_name || '-'}</td>
                        <td>{user.email || '-'}</td>
                        <td>{roleBadge(user.role)}</td>
                        <td>{statusBadge(user.is_active)}</td>
                        <td>{formatDate(user.last_login_at)}</td>
                        <td>{formatDate(user.updated_at)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button size="sm" variant="outline-info" onClick={() => void openDetails(user.id)}>
                              Λεπτομέρειες
                            </Button>
                            <Button size="sm" variant="outline-primary" onClick={() => openEdit(user)}>
                              Επεξεργασία
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">
                        Δεν βρέθηκαν χρήστες.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span className="text-muted fs-13">
                  Σελίδα {pagination.page} από {pagination.total_pages} | Σύνολο {pagination.total} εγγραφές
                </span>
                <Pagination className="mb-0">{pages}</Pagination>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={Boolean(selectedUser) || detailsLoading} onHide={() => setSelectedUser(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Λεπτομέρειες χρήστη</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailsLoading ? (
            <Spinner animation="border" size="sm" />
          ) : selectedUser ? (
            <div className="d-flex flex-column gap-2">
              <div><strong>Όνομα:</strong> {selectedUser.full_name || '-'}</div>
              <div><strong>Email:</strong> {selectedUser.email || '-'}</div>
              <div><strong>Ρόλος:</strong> {roleBadge(selectedUser.role)}</div>
              <div><strong>Κατάσταση:</strong> {statusBadge(selectedUser.is_active)}</div>
              <div><strong>Τελευταία σύνδεση:</strong> {formatDate(selectedUser.last_login_at)}</div>
              <div><strong>Δημιουργήθηκε:</strong> {formatDate(selectedUser.created_at)}</div>
              <div><strong>Ενημερώθηκε:</strong> {formatDate(selectedUser.updated_at)}</div>
              <div><strong>Απαίτηση αλλαγής κωδικού:</strong> {selectedUser.password_reset_required ? 'Ναι' : 'Όχι'}</div>
            </div>
          ) : (
            <div className="text-muted">Δεν έχει επιλεγεί χρήστης.</div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Επεξεργασία χρήστη' : 'Νέος χρήστης'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateSubmit}>
          <Modal.Body className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Label>Ονοματεπώνυμο</Form.Label>
              <Form.Control
                value={createForm.full_name}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, full_name: event.target.value }))}
                placeholder="Ονοματεπώνυμο χρήστη"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={createForm.email}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="name@example.com"
              />
            </Form.Group>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ρόλος</Form.Label>
                  <Form.Select
                    value={createForm.role}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, role: event.target.value as CmsRole }))}
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="client">Client</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Κατάσταση</Form.Label>
                  <Form.Select
                    value={createForm.is_active ? 'active' : 'inactive'}
                    onChange={(event) =>
                      setCreateForm((prev) => ({ ...prev, is_active: event.target.value === 'active' }))
                    }
                  >
                    <option value="active">Ενεργό</option>
                    <option value="inactive">Ανενεργό</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Προσωρινός κωδικός</Form.Label>
              <Form.Control
                type="text"
                value={createForm.password}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder={editingUser ? 'Άφησε κενό για να διατηρηθεί ο τρέχων κωδικός' : 'Τουλάχιστον 10 χαρακτήρες'}
              />
              <Form.Text className="text-muted">
                {editingUser
                  ? 'Αν ορίσεις νέο κωδικό, ο χρήστης θα υποχρεωθεί να τον αλλάξει μετά την επόμενη σύνδεση.'
                  : 'Ο χρήστης θα υποχρεωθεί να αλλάξει τον κωδικό μετά την πρώτη σύνδεση.'}
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowCreateModal(false)}>
              Ακύρωση
            </Button>
            <Button type="submit" disabled={createSubmitting}>
              {createSubmitting ? <Spinner animation="border" size="sm" /> : editingUser ? 'Αποθήκευση αλλαγών' : 'Δημιουργία χρήστη'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </ModulePage>
  );
}
