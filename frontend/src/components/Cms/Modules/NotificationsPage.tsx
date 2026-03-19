import { useEffect, useMemo, useState } from 'react';
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
import { fetchNotificationEvents, publishNotificationEvent } from '../../../services/cms-notifications';
import type { CmsNotificationEvent } from '../../../types';

const eventTypes = [
  'item_created',
  'item_updated',
  'item_activated',
  'item_deactivated',
  'category_changed',
] as const;

function formatDate(value: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function statusBadge(status: string) {
  const label = status === 'published' ? 'Δημοσιευμένο' : status === 'pending' ? 'Σε αναμονή' : status;
  return <Badge bg={status === 'published' ? 'success' : 'warning'}>{label}</Badge>;
}

export default function NotificationsPage() {
  const [events, setEvents] = useState<CmsNotificationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'published'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [pagination, setPagination] = useState({ total: 0, page: 1, per_page: 20, total_pages: 1 });
  const [selectedEvent, setSelectedEvent] = useState<CmsNotificationEvent | null>(null);
  const [publishingId, setPublishingId] = useState('');

  const loadEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchNotificationEvents({
        search,
        event_type: eventTypeFilter,
        status_filter: statusFilter,
        date_from: dateFrom,
        date_to: dateTo,
        page,
        per_page: perPage,
      });
      setEvents(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης ειδοποιήσεων.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEvents();
  }, [search, eventTypeFilter, statusFilter, dateFrom, dateTo, page, perPage]);

  const onPublish = async (event: CmsNotificationEvent) => {
    if (event.status === 'published') return;
    if (!window.confirm(`Δημοσίευση ειδοποίησης ${event.event_type} για ${event.item_title || event.item_barcode || event.id};`)) {
      return;
    }
    setPublishingId(event.id);
    setError('');
    setMessage('');
    try {
      await publishNotificationEvent(event.id);
      setMessage('Η ειδοποίηση δημοσιεύτηκε.');
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία δημοσίευσης ειδοποίησης.');
    } finally {
      setPublishingId('');
    }
  };

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
    Boolean(eventTypeFilter),
    statusFilter !== 'all',
    Boolean(dateFrom),
    Boolean(dateTo),
  ].filter(Boolean).length;

  const moduleMetrics = [
    {
      label: 'Φιλτραρισμένες εγγραφές',
      value: pagination.total.toLocaleString(),
      helper: 'Ειδοποιήσεις που ταιριάζουν στα φίλτρα',
      tone: 'primary' as const,
    },
    {
      label: 'Ενεργά φίλτρα',
      value: activeFilterCount,
      helper: activeFilterCount ? 'Έχουν εφαρμοστεί φίλτρα τύπου/κατάστασης/ημερομηνίας' : 'Προβολή όλων των ειδοποιήσεων',
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
      title="Ειδοποιήσεις"
      description="Καταγραφή αλλαγών προϊόντων για ενημερώσεις πελατών και έλεγχο δημοσίευσης."
      metrics={moduleMetrics}
    >
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {message ? <Alert variant="success">{message}</Alert> : null}

      <Row className="mb-4 g-3 align-items-end">
        <Col xl={3} md={6}>
          <Form.Label>Αναζήτηση</Form.Label>
          <Form.Control
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            placeholder="Είδος, barcode, κατηγορία"
          />
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>Τύπος συμβάντος</Form.Label>
          <Form.Select
            value={eventTypeFilter}
            onChange={(event) => {
              setPage(1);
              setEventTypeFilter(event.target.value);
            }}
          >
            <option value="">Όλα</option>
            {eventTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>Κατάσταση</Form.Label>
          <Form.Select
            value={statusFilter}
            onChange={(event) => {
              setPage(1);
              setStatusFilter(event.target.value as 'all' | 'pending' | 'published');
            }}
          >
            <option value="all">Όλα</option>
            <option value="pending">Σε αναμονή</option>
            <option value="published">Δημοσιευμένα</option>
          </Form.Select>
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
        <Col xl={1} md={6}>
          <Form.Label>Ανά σελίδα</Form.Label>
          <Form.Select
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
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <Card.Title>Ειδοποιήσεις</Card.Title>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <>
              <Table responsive className="table table-striped mb-3 align-middle">
                <thead>
                  <tr>
                    <th>Συμβάν</th>
                    <th>Είδος</th>
                    <th>Κατηγορία</th>
                    <th>Κατάσταση</th>
                    <th>Δημιουργήθηκε</th>
                    <th>Δημοσιεύτηκε</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length ? (
                    events.map((event) => (
                      <tr key={event.id}>
                        <td>{event.event_type || '-'}</td>
                        <td>
                          <div className="fw-semibold">{event.item_title || '-'}</div>
                          <div className="text-muted fs-12">
                            {[event.item_code, event.item_barcode].filter(Boolean).join(' / ') || '-'}
                          </div>
                        </td>
                        <td>{event.category_name || '-'}</td>
                        <td>{statusBadge(event.status)}</td>
                        <td>{formatDate(event.created_at)}</td>
                        <td>{formatDate(event.published_at)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button size="sm" variant="outline-info" onClick={() => setSelectedEvent(event)}>
                              Λεπτομέρειες
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => void onPublish(event)}
                              disabled={event.status === 'published' || publishingId === event.id}
                            >
                              {publishingId === event.id ? 'Δημοσίευση...' : event.status === 'published' ? 'Δημοσιευμένο' : 'Δημοσίευση'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">
                        Δεν βρέθηκαν ειδοποιήσεις.
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

      <Modal show={Boolean(selectedEvent)} onHide={() => setSelectedEvent(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Λεπτομέρειες ειδοποίησης</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent ? (
            <div className="d-flex flex-column gap-3">
              <div><strong>Τύπος συμβάντος:</strong> {selectedEvent.event_type || '-'}</div>
              <div><strong>Κατάσταση:</strong> {selectedEvent.status}</div>
              <div><strong>Είδος:</strong> {selectedEvent.item_title || '-'} ({selectedEvent.item_barcode || '-'})</div>
              <div><strong>Κατηγορία:</strong> {selectedEvent.category_name || '-'}</div>
              <div><strong>Δημιουργήθηκε:</strong> {formatDate(selectedEvent.created_at)}</div>
              <div><strong>Δημοσιεύτηκε:</strong> {formatDate(selectedEvent.published_at)}</div>
              <div>
                <strong>Payload:</strong>
                <pre className="mt-2 mb-0 p-3 bg-light rounded border" style={{ whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(selectedEvent.payload, null, 2)}
                </pre>
              </div>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>
    </ModulePage>
  );
}
