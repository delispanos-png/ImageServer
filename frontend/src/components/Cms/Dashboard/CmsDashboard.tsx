import { Fragment, type ReactNode, useEffect, useMemo, useState } from 'react';
import { Alert, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';
import { fetchDashboardOverview } from '../../../services/cms-dashboard';
import type { CmsDashboardOverview, DashboardRecentItem } from '../../../types';

type MetricTone = 'violet' | 'emerald' | 'amber' | 'sky' | 'rose' | 'indigo';

function formatDate(value: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function renderStatus(status: string) {
  const normalized = status === 'inactive' ? 'danger' : 'success';
  const label = status === 'inactive' ? 'ανενεργό' : 'ενεργό';
  return <span className={`badge bg-${normalized}-transparent`}>{label}</span>;
}

function PanelEmptyState({ label }: { label: string }) {
  return <div className="cloudon-panel-empty">Δεν υπάρχουν διαθέσιμα {label}.</div>;
}

function SectionPanel({
  title,
  eyebrow,
  children,
  action,
  className = '',
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`cloudon-data-panel h-100 ${className}`.trim()}>
      <Card.Header className="cloudon-data-panel__header">
        <div>
          <span className="cloudon-data-panel__eyebrow">{eyebrow}</span>
          <Card.Title className="mb-0">{title}</Card.Title>
        </div>
        {action ? <div>{action}</div> : null}
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}

function MetricCard({
  label,
  value,
  note,
  tone,
  icon,
  loading,
}: {
  label: string;
  value: number;
  note: string;
  tone: MetricTone;
  icon: ReactNode;
  loading: boolean;
}) {
  return (
    <Card className={`cloudon-metric-card cloudon-metric-card--${tone}`}>
      <Card.Body>
        <div className="cloudon-metric-card__icon">{icon}</div>
        <div className="cloudon-metric-card__label">{label}</div>
        <div className="cloudon-metric-card__value">
          {loading ? <Spinner animation="border" size="sm" /> : value.toLocaleString()}
        </div>
        <div className="cloudon-metric-card__note">{note}</div>
      </Card.Body>
    </Card>
  );
}

function DashboardIcon({ type }: { type: MetricTone }) {
  switch (type) {
    case 'emerald':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20V10" />
          <path d="M18 20V4" />
          <path d="M6 20v-6" />
        </svg>
      );
    case 'amber':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 3" />
        </svg>
      );
    case 'sky':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16" />
          <path d="M4 12h10" />
          <path d="M4 17h7" />
        </svg>
      );
    case 'rose':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21s-6-4.35-8.5-8A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 20.5 13c-2.5 3.65-8.5 8-8.5 8z" />
        </svg>
      );
    case 'indigo':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      );
    case 'violet':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19h16" />
          <path d="M7 15l4-4 3 3 4-6" />
          <path d="M17 8h1v1" />
        </svg>
      );
  }
}

function RecentItemsTable({ items }: { items: DashboardRecentItem[] }) {
  if (!items.length) return <PanelEmptyState label="πρόσφατα είδη" />;
  return (
    <Table responsive className="table table-striped mb-0 align-middle">
      <thead>
        <tr>
          <th>Τίτλος</th>
          <th>Κωδικός</th>
          <th>Γραμμωτός κώδικας</th>
          <th>Κατάσταση</th>
          <th>Ημερομηνία Δημιουργίας</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.title || '-'}</td>
            <td>{item.code || '-'}</td>
            <td>{item.barcode || '-'}</td>
            <td>{renderStatus(item.status)}</td>
            <td>{formatDate(item.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default function CmsDashboard() {
  const [overview, setOverview] = useState<CmsDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchDashboardOverview();
        if (active) {
          setOverview(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const metrics = useMemo(
    () => [
      {
        label: 'Εγγραφές Καταλόγου',
        value: overview?.metrics.total_items ?? 0,
        note: 'Είδη που παρακολουθούνται στο CMS',
        tone: 'violet' as const,
      },
      {
        label: 'Δημοσιευμένα Είδη',
        value: overview?.metrics.active_items ?? 0,
        note: 'Ενεργά είδη ορατά στους πελάτες',
        tone: 'emerald' as const,
      },
      {
        label: 'Κρυφά Είδη',
        value: overview?.metrics.inactive_items ?? 0,
        note: 'Είδη εκτός λειτουργικής προβολής',
        tone: 'amber' as const,
      },
      {
        label: 'Κόμβοι Κατηγοριοποίησης',
        value: overview?.metrics.total_categories ?? 0,
        note: 'Διαθέσιμα branches και leaves κατηγοριών',
        tone: 'sky' as const,
      },
      {
        label: 'Ενεργοί Πελάτες',
        value: overview?.metrics.active_clients ?? 0,
        note: 'Λογαριασμοί πελατών με ενεργή πρόσβαση',
        tone: 'rose' as const,
      },
      {
        label: 'Συμβάντα σε Ουρά',
        value: overview?.metrics.pending_notifications ?? 0,
        note: 'Ειδοποιήσεις σε αναμονή',
        tone: 'indigo' as const,
      },
    ],
    [overview],
  );

  return (
    <Fragment>
      <PageHeader
        title="Κέντρο Ελέγχου"
        subtitle="Σύνοψη όγκου καταλόγου, πρόσφατων αλλαγών και δραστηριότητας χρηστών."
        eyebrow="Επισκόπηση CMS"
        actions={<span className="cloudon-meta-pill">Ζωντανή κατάσταση καταλόγου</span>}
      />

      {error ? (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      ) : null}

      <Row className="g-4 mb-1">
        {metrics.map((metric) => (
          <Col xl={4} md={6} key={metric.label}>
            <MetricCard
              label={metric.label}
              value={metric.value}
              note={metric.note}
              tone={metric.tone}
              icon={<DashboardIcon type={metric.tone} />}
              loading={loading}
            />
          </Col>
        ))}
      </Row>

      <Row className="g-4 mt-1">
        <Col xl={8}>
          <SectionPanel title="Πρόσφατες Αλλαγές Ειδών" eyebrow="Ροή Ελέγχου">
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : overview?.recent_item_changes.length ? (
              <Table responsive className="table table-striped mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Πεδίο</th>
                    <th>Τύπος Αλλαγής</th>
                    <th>Από</th>
                    <th>Προεπισκόπηση</th>
                    <th>Χρόνος</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recent_item_changes.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.field_name || '-'}</td>
                      <td>{entry.change_type || '-'}</td>
                      <td>{entry.changed_by || '-'}</td>
                      <td>{entry.new_value_preview || '-'}</td>
                      <td>{formatDate(entry.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <PanelEmptyState label="πρόσφατες αλλαγές" />
            )}
          </SectionPanel>
        </Col>
        <Col xl={4}>
          <SectionPanel title="Είδη ανά Κατηγορία" eyebrow="Κατανομή">
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : overview?.items_by_category.length ? (
              <div className="d-flex flex-column gap-3">
                {overview.items_by_category.map((entry) => (
                  <div key={entry.category} className="cloudon-progress-row">
                    <div className="d-flex justify-content-between fs-13 mb-2 gap-3">
                      <span className="text-truncate">{entry.category}</span>
                      <strong>{entry.count}</strong>
                    </div>
                    <div className="progress progress-xs cloudon-progress-track">
                      <div
                        className="progress-bar"
                        style={{ width: `${Math.min(100, (entry.count / Math.max(1, overview.items_by_category[0]?.count ?? 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <PanelEmptyState label="κατανομή κατηγοριών" />
            )}
          </SectionPanel>
        </Col>
      </Row>

      <Row className="g-4 mt-1">
        <Col xl={6}>
          <SectionPanel title="Πρόσφατη Δραστηριότητα Χρηστών" eyebrow="Ενέργειες Χειριστών">
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : overview?.recent_user_activity.length ? (
              <Table responsive className="table table-striped mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Χρήστης</th>
                    <th>Ενέργεια</th>
                    <th>Οντότητα</th>
                    <th>Χρόνος</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recent_user_activity.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.user_email || entry.user_name || entry.user_id || '-'}</td>
                      <td>{entry.action || '-'}</td>
                      <td>{[entry.entity_type, entry.entity_id].filter(Boolean).join(' / ') || '-'}</td>
                      <td>{formatDate(entry.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <PanelEmptyState label="δραστηριότητα χρηστών" />
            )}
          </SectionPanel>
        </Col>
        <Col xl={6}>
          <SectionPanel title="Πρόσφατα Προστιθέμενα Είδη" eyebrow="Νέες Καταχωρίσεις">
            {loading ? <Spinner animation="border" size="sm" /> : <RecentItemsTable items={overview?.recent_added_items ?? []} />}
          </SectionPanel>
        </Col>
      </Row>

      <Row className="g-4 mt-1">
        <Col xl={12}>
          <SectionPanel title="Είδη που Προστέθηκαν τις Τελευταίες 30 Ημέρες" eyebrow="Ροή">
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : overview?.items_added_last_30_days.length ? (
              <Table responsive className="table table-striped mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Ημερομηνία</th>
                    <th>Είδη που Προστέθηκαν</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.items_added_last_30_days.map((point) => (
                    <tr key={point.date}>
                      <td>{point.date}</td>
                      <td>{point.count}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <PanelEmptyState label="χρονοσειρά" />
            )}
          </SectionPanel>
        </Col>
      </Row>
    </Fragment>
  );
}
