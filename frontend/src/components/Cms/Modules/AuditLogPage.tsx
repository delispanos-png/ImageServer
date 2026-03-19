import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
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
import { fetchAuditLogs } from '../../../services/cms-audit';
import type { CmsAuditLog } from '../../../types';

const actionOptions = [
  'login',
  'logout',
  'create_item',
  'update_item',
  'create_category',
  'update_category',
  'create_client',
  'update_client',
  'publish_notification',
] as const;

const entityOptions = ['session', 'item', 'category', 'client', 'notification_event'] as const;

function formatDate(value: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<CmsAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [pagination, setPagination] = useState({ total: 0, page: 1, per_page: 20, total_pages: 1 });
  const [selectedLog, setSelectedLog] = useState<CmsAuditLog | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchAuditLogs({
        search,
        user: userFilter,
        entity: entityFilter,
        action: actionFilter,
        date_from: dateFrom,
        date_to: dateTo,
        page,
        per_page: perPage,
      });
      setLogs(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLogs();
  }, [search, userFilter, entityFilter, actionFilter, dateFrom, dateTo, page, perPage]);

  const pages = useMemo(() => {
    const items: React.ReactNode[] = [];
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
    Boolean(userFilter.trim()),
    Boolean(entityFilter),
    Boolean(actionFilter),
    Boolean(dateFrom),
    Boolean(dateTo),
  ].filter(Boolean).length;

  const moduleMetrics = [
    {
      label: 'Φιλτραρισμένες εγγραφές',
      value: pagination.total.toLocaleString(),
      helper: 'Audit εγγραφές που ταιριάζουν στα φίλτρα',
      tone: 'primary' as const,
    },
    {
      label: 'Ενεργά φίλτρα',
      value: activeFilterCount,
      helper: activeFilterCount ? 'Έχουν εφαρμοστεί φίλτρα χρήστη/οντότητας/ενέργειας/ημερομηνίας' : 'Προβολή όλων των εγγραφών audit',
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
      title="Αρχείο ενεργειών"
      description="Ενέργειες χρηστών για σύνδεση, αλλαγές καταλόγου, διαχείριση πελατών και δημοσιεύσεις."
      metrics={moduleMetrics}
    >
      {error ? <Alert variant="danger">{error}</Alert> : null}

      <Row className="mb-4 g-3 align-items-end">
        <Col xl={2} md={6}>
          <Form.Label>Χρήστης</Form.Label>
          <Form.Control
            value={userFilter}
            onChange={(event) => {
              setPage(1);
              setUserFilter(event.target.value);
            }}
            placeholder="Email ή όνομα"
          />
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>Οντότητα</Form.Label>
          <Form.Select
            value={entityFilter}
            onChange={(event) => {
              setPage(1);
              setEntityFilter(event.target.value);
            }}
          >
            <option value="">Όλες οι οντότητες</option>
            {entityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>Ενέργεια</Form.Label>
          <Form.Select
            value={actionFilter}
            onChange={(event) => {
              setPage(1);
              setActionFilter(event.target.value);
            }}
          >
            <option value="">Όλες οι ενέργειες</option>
            {actionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>Αναζήτηση</Form.Label>
          <Form.Control
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            placeholder="Id οντότητας ή χρήστης"
          />
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>Από</Form.Label>
          <Form.Control
            type="date"
            value={dateFrom}
            onChange={(event) => {
              setPage(1);
              setDateFrom(event.target.value);
            }}
          />
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>Έως</Form.Label>
          <Form.Control
            type="date"
            value={dateTo}
            onChange={(event) => {
              setPage(1);
              setDateTo(event.target.value);
            }}
          />
        </Col>
      </Row>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Card.Title>Audit εγγραφές</Card.Title>
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
              {[20, 50, 100].map((option) => (
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
                    <th>Χρήστης</th>
                    <th>Οντότητα</th>
                    <th>Ενέργεια</th>
                    <th>Metadata</th>
                    <th>Ημερομηνία</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length ? (
                    logs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <div className="fw-semibold">{log.user_email || log.user_name || log.user_id || '-'}</div>
                          <div className="text-muted fs-12">{log.user_name || '-'}</div>
                        </td>
                        <td>
                          <div>{log.entity_type || '-'}</div>
                          <div className="text-muted fs-12">{log.entity_id || '-'}</div>
                        </td>
                        <td>{log.action || '-'}</td>
                        <td className="text-muted fs-12">{log.metadata_preview || '-'}</td>
                        <td>{formatDate(log.created_at)}</td>
                        <td>
                          <Button size="sm" variant="outline-info" onClick={() => setSelectedLog(log)}>
                            Λεπτομέρειες
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        Δεν βρέθηκαν audit εγγραφές.
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

      <Modal show={Boolean(selectedLog)} onHide={() => setSelectedLog(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Λεπτομέρειες audit εγγραφής</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog ? (
            <div className="d-flex flex-column gap-3">
              <div><strong>Χρήστης:</strong> {selectedLog.user_email || selectedLog.user_name || selectedLog.user_id || '-'}</div>
              <div><strong>Οντότητα:</strong> {selectedLog.entity_type || '-'} / {selectedLog.entity_id || '-'}</div>
              <div><strong>Ενέργεια:</strong> {selectedLog.action || '-'}</div>
              <div><strong>Ημερομηνία:</strong> {formatDate(selectedLog.created_at)}</div>
              <div>
                <strong>Metadata:</strong>
                <pre className="mt-2 mb-0 p-3 bg-light rounded border" style={{ whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>
    </ModulePage>
  );
}
