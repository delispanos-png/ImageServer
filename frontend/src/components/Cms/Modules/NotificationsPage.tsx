import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Nav,
  Pagination,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import ModulePage from '../ModulePage';
import {
  bulkDismissNotifications,
  bulkPublishNotifications,
  fetchNotificationEvents,
  fetchNotificationSummary,
  publishNotificationEvent,
  type NotificationChannel,
  type NotificationSummary,
} from '../../../services/cms-notifications';
import type { CmsNotificationEvent } from '../../../types';

type ChannelTab = 'all' | NotificationChannel;

const CHANNEL_TABS: { key: ChannelTab; label: string }[] = [
  { key: 'all', label: 'Όλα' },
  { key: 'catalog', label: 'Καταλόγου' },
  { key: 'operations', label: 'Λειτουργικά' },
  { key: 'security', label: 'Ασφάλειας' },
];

const EVENT_TYPES_BY_CHANNEL: Record<ChannelTab, string[]> = {
  all: [
    'item_created',
    'item_updated',
    'item_activated',
    'item_deactivated',
    'category_changed',
    'bulk_refresh_started',
    'bulk_refresh_completed',
    'brand_sync_completed',
    'account_locked',
    'watchdog_alert',
  ],
  catalog: ['item_created', 'item_updated', 'item_activated', 'item_deactivated', 'category_changed'],
  operations: ['bulk_refresh_started', 'bulk_refresh_completed', 'brand_sync_completed'],
  security: ['account_locked', 'watchdog_alert'],
};

function formatDate(value: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function statusBadge(status: string) {
  const label = status === 'published' ? 'Δημοσιευμένο' : status === 'pending' ? 'Σε αναμονή' : status;
  return <Badge bg={status === 'published' ? 'success' : 'warning'}>{label}</Badge>;
}

function channelBadge(channel?: string) {
  if (!channel) return null;
  const variant =
    channel === 'security' ? 'danger' : channel === 'operations' ? 'info' : 'secondary';
  return <Badge bg={variant} className="ms-2">{channel}</Badge>;
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
  const [channel, setChannel] = useState<ChannelTab>('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [pagination, setPagination] = useState({ total: 0, page: 1, per_page: 20, total_pages: 1 });
  const [selectedEvent, setSelectedEvent] = useState<CmsNotificationEvent | null>(null);
  const [publishingId, setPublishingId] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  const filtersPayload = useMemo(
    () => ({
      search,
      event_type: eventTypeFilter,
      channel: (channel === 'all' ? '' : channel) as NotificationChannel | '',
      status_filter: statusFilter,
      date_from: dateFrom,
      date_to: dateTo,
    }),
    [search, eventTypeFilter, channel, statusFilter, dateFrom, dateTo],
  );

  const loadEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchNotificationEvents({
        ...filtersPayload,
        page,
        per_page: perPage,
      });
      setEvents(response.data);
      setPagination(response.pagination);
      setSelectedIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης ειδοποιήσεων.');
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const data = await fetchNotificationSummary();
      setSummary(data);
    } catch {
      // summary is best-effort — don't block the page on it
    }
  };

  useEffect(() => {
    void loadEvents();
  }, [search, eventTypeFilter, channel, statusFilter, dateFrom, dateTo, page, perPage]);

  useEffect(() => {
    void loadSummary();
  }, []);

  const onPublish = async (event: CmsNotificationEvent) => {
    if (event.status === 'published') return;
    setPublishingId(event.id);
    setError('');
    setMessage('');
    try {
      await publishNotificationEvent(event.id);
      setMessage('Η ειδοποίηση δημοσιεύτηκε.');
      await Promise.all([loadEvents(), loadSummary()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία δημοσίευσης ειδοποίησης.');
    } finally {
      setPublishingId('');
    }
  };

  const runBulkPublish = async (scope: 'selected' | 'filtered') => {
    if (scope === 'selected' && selectedIds.size === 0) return;
    const humanScope = scope === 'selected'
      ? `${selectedIds.size} επιλεγμένες ειδοποιήσεις`
      : `ΟΛΕΣ τις ${pagination.total.toLocaleString()} pending ειδοποιήσεις που ταιριάζουν στα φίλτρα`;
    if (!window.confirm(`Δημοσίευση: ${humanScope};`)) return;
    setBulkBusy(true);
    setError('');
    setMessage('');
    try {
      const body = scope === 'selected'
        ? { ids: Array.from(selectedIds) }
        : { filter: filtersPayload };
      const { updated } = await bulkPublishNotifications(body);
      setMessage(`Δημοσιεύτηκαν ${updated} ειδοποιήσεις.`);
      await Promise.all([loadEvents(), loadSummary()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία bulk δημοσίευσης.');
    } finally {
      setBulkBusy(false);
    }
  };

  const runBulkDismiss = async (scope: 'selected' | 'filtered') => {
    if (scope === 'selected' && selectedIds.size === 0) return;
    const humanScope = scope === 'selected'
      ? `${selectedIds.size} επιλεγμένες ειδοποιήσεις`
      : `ΟΛΕΣ τις ${pagination.total.toLocaleString()} ειδοποιήσεις που ταιριάζουν στα φίλτρα`;
    if (!window.confirm(`Οριστική διαγραφή: ${humanScope}; Δεν αναιρείται.`)) return;
    setBulkBusy(true);
    setError('');
    setMessage('');
    try {
      const body = scope === 'selected'
        ? { ids: Array.from(selectedIds) }
        : { filter: filtersPayload };
      const { deleted } = await bulkDismissNotifications(body);
      setMessage(`Διαγράφηκαν ${deleted} ειδοποιήσεις.`);
      await Promise.all([loadEvents(), loadSummary()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία bulk διαγραφής.');
    } finally {
      setBulkBusy(false);
    }
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === events.length && events.length > 0) return new Set();
      return new Set(events.map((e) => e.id));
    });
  };

  const pages = useMemo(() => {
    const items: React.ReactNode[] = [];
    const total = pagination.total_pages;
    const current = pagination.page;
    const window = 2;
    const push = (i: number) =>
      items.push(
        <Pagination.Item key={i} active={i === current} onClick={() => setPage(i)}>
          {i}
        </Pagination.Item>,
      );
    if (total <= 1) return items;
    push(1);
    if (current - window > 2) items.push(<Pagination.Ellipsis key="lead-ellipsis" disabled />);
    for (let i = Math.max(2, current - window); i <= Math.min(total - 1, current + window); i += 1) push(i);
    if (current + window < total - 1) items.push(<Pagination.Ellipsis key="tail-ellipsis" disabled />);
    if (total > 1) push(total);
    return items;
  }, [pagination.page, pagination.total_pages]);

  const activeFilterCount = [
    Boolean(search.trim()),
    Boolean(eventTypeFilter),
    statusFilter !== 'all',
    Boolean(dateFrom),
    Boolean(dateTo),
    channel !== 'all',
  ].filter(Boolean).length;

  const channelStats = summary?.channels;
  const totalPending = channelStats
    ? (channelStats.catalog?.pending ?? 0) + (channelStats.operations?.pending ?? 0) + (channelStats.security?.pending ?? 0)
    : 0;

  const moduleMetrics = [
    {
      label: 'Φιλτραρισμένες',
      value: pagination.total.toLocaleString(),
      helper: `Σελίδα ${pagination.page}/${Math.max(pagination.total_pages, 1)}`,
      tone: 'primary' as const,
    },
    {
      label: 'Pending συνολικά',
      value: totalPending.toLocaleString(),
      helper: channelStats
        ? `Catalog ${channelStats.catalog?.pending ?? 0} · Ops ${channelStats.operations?.pending ?? 0} · Security ${channelStats.security?.pending ?? 0}`
        : '—',
      tone: totalPending > 0 ? ('warning' as const) : ('info' as const),
    },
    {
      label: 'Ενεργά φίλτρα',
      value: activeFilterCount,
      helper: activeFilterCount ? 'Έχουν εφαρμοστεί φίλτρα' : 'Προβολή όλων',
      tone: activeFilterCount ? ('warning' as const) : ('info' as const),
    },
  ];

  const availableEventTypes = EVENT_TYPES_BY_CHANNEL[channel];

  return (
    <ModulePage
      title="Ειδοποιήσεις"
      description="Καταγραφή γεγονότων καταλόγου, λειτουργιών και ασφάλειας με bulk δημοσίευση/διαγραφή."
      metrics={moduleMetrics}
    >
      {error ? <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert> : null}
      {message ? <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert> : null}

      <Nav
        variant="tabs"
        activeKey={channel}
        onSelect={(key) => {
          setPage(1);
          setEventTypeFilter('');
          setChannel((key as ChannelTab) || 'all');
        }}
        className="mb-3"
      >
        {CHANNEL_TABS.map((tab) => {
          const stats = tab.key === 'all' ? null : channelStats?.[tab.key];
          const pendingCount = stats?.pending ?? 0;
          return (
            <Nav.Item key={tab.key}>
              <Nav.Link eventKey={tab.key}>
                {tab.label}
                {pendingCount > 0 ? <Badge bg="warning" className="ms-2">{pendingCount}</Badge> : null}
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>

      <Row className="mb-3 g-3 align-items-end">
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
            {availableEventTypes.map((option) => (
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

      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <span className="text-muted fs-13">Επιλεγμένες: {selectedIds.size}</span>
        <Button
          size="sm"
          variant="outline-success"
          disabled={bulkBusy || selectedIds.size === 0}
          onClick={() => void runBulkPublish('selected')}
        >
          Δημοσίευση επιλεγμένων
        </Button>
        <Button
          size="sm"
          variant="outline-danger"
          disabled={bulkBusy || selectedIds.size === 0}
          onClick={() => void runBulkDismiss('selected')}
        >
          Διαγραφή επιλεγμένων
        </Button>
        <div className="vr d-none d-md-block" />
        <Button
          size="sm"
          variant="success"
          disabled={bulkBusy || pagination.total === 0}
          onClick={() => void runBulkPublish('filtered')}
        >
          Δημοσίευση όλων (φιλτραρισμένων)
        </Button>
        <Button
          size="sm"
          variant="danger"
          disabled={bulkBusy || pagination.total === 0 || activeFilterCount === 0}
          onClick={() => void runBulkDismiss('filtered')}
          title={activeFilterCount === 0 ? 'Απαιτείται τουλάχιστον ένα φίλτρο για διαγραφή όλων' : ''}
        >
          Διαγραφή όλων (φιλτραρισμένων)
        </Button>
        {bulkBusy ? <Spinner animation="border" size="sm" /> : null}
      </div>

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
                    <th style={{ width: 36 }}>
                      <Form.Check
                        type="checkbox"
                        checked={events.length > 0 && selectedIds.size === events.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
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
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedIds.has(event.id)}
                            onChange={() => toggleSelected(event.id)}
                          />
                        </td>
                        <td>
                          {event.event_type || '-'}
                          {channelBadge(event.channel)}
                        </td>
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
                              {publishingId === event.id ? '...' : event.status === 'published' ? 'Δημοσιευμένο' : 'Δημοσίευση'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center text-muted py-4">
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
              <div><strong>Τύπος συμβάντος:</strong> {selectedEvent.event_type || '-'} {channelBadge(selectedEvent.channel)}</div>
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
