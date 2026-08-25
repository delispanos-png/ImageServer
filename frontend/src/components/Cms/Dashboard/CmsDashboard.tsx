import { Fragment, type ReactNode, useEffect, useMemo, useState } from 'react';
import { Alert, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHeader from '../../../layout/Header/pageheader';
import { useAdminLanguage } from '../../../app/i18n/AdminLanguageProvider';
import { fetchDashboardOverview } from '../../../services/cms-dashboard';
import type { CmsDashboardOverview, DashboardRecentItem } from '../../../types';

type MetricTone = 'violet' | 'emerald' | 'amber' | 'sky' | 'rose' | 'indigo';

function formatDate(value: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function renderStatus(status: string, language: 'en' | 'el') {
  const normalized = status === 'inactive' ? 'danger' : 'success';
  const label = status === 'inactive'
    ? (language === 'el' ? 'ανενεργό' : 'inactive')
    : (language === 'el' ? 'ενεργό' : 'active');
  return <span className={`badge bg-${normalized}-transparent`}>{label}</span>;
}

function PanelEmptyState({ label, language }: { label: string; language: 'en' | 'el' }) {
  return <div className="cloudon-panel-empty">{language === 'el' ? `Δεν υπάρχουν διαθέσιμα ${label}.` : `No ${label} available.`}</div>;
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
  href,
}: {
  label: string;
  value: number;
  note: string;
  tone: MetricTone;
  icon: ReactNode;
  loading: boolean;
  href?: string;
}) {
  const body = (
    <Card.Body>
      <div className="cloudon-metric-card__icon">{icon}</div>
      <div className="cloudon-metric-card__label">{label}</div>
      <div className="cloudon-metric-card__value">
        {loading ? <Spinner animation="border" size="sm" /> : value.toLocaleString()}
      </div>
      <div className="cloudon-metric-card__note">{note}</div>
    </Card.Body>
  );
  if (href) {
    return (
      <Link to={href} className="cloudon-metric-card__link text-decoration-none">
        <Card className={`cloudon-metric-card cloudon-metric-card--${tone} cloudon-metric-card--clickable h-100`}>
          {body}
        </Card>
      </Link>
    );
  }
  return (
    <Card className={`cloudon-metric-card cloudon-metric-card--${tone}`}>
      {body}
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

function RecentItemsTable({ items, language }: { items: DashboardRecentItem[]; language: 'en' | 'el' }) {
  if (!items.length) return <PanelEmptyState label={language === 'el' ? 'πρόσφατα είδη' : 'recent items'} language={language} />;
  return (
    <Table responsive className="table table-striped mb-0 align-middle">
      <thead>
        <tr>
          <th>{language === 'el' ? 'Τίτλος' : 'Title'}</th>
          <th>{language === 'el' ? 'Κωδικός' : 'Code'}</th>
          <th>{language === 'el' ? 'Γραμμωτός κώδικας' : 'Barcode'}</th>
          <th>{language === 'el' ? 'Κατάσταση' : 'Status'}</th>
          <th>{language === 'el' ? 'Ημερομηνία Δημιουργίας' : 'Created At'}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.title || '-'}</td>
            <td>{item.code || '-'}</td>
            <td>{item.barcode || '-'}</td>
            <td>{renderStatus(item.status, language)}</td>
            <td>{formatDate(item.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default function CmsDashboard() {
  const { language } = useAdminLanguage();
  const tx = (en: string, el: string) => (language === 'el' ? el : en);
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
          setError(err instanceof Error ? err.message : tx('Failed to load dashboard.', 'Αποτυχία φόρτωσης dashboard.'));
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
        label: tx('Catalog Records', 'Εγγραφές Καταλόγου'),
        value: overview?.metrics.total_items ?? 0,
        note: tx('Items tracked inside the CMS', 'Είδη που παρακολουθούνται στο CMS'),
        tone: 'violet' as const,
        href: '/items',
      },
      {
        label: tx('Published Items', 'Δημοσιευμένα Είδη'),
        value: overview?.metrics.active_items ?? 0,
        note: tx('Active items visible to clients', 'Ενεργά είδη ορατά στους πελάτες'),
        tone: 'emerald' as const,
        href: '/items?status=active',
      },
      {
        label: tx('Hidden Items', 'Κρυφά Είδη'),
        value: overview?.metrics.inactive_items ?? 0,
        note: tx('Items outside operational visibility', 'Είδη εκτός λειτουργικής προβολής'),
        tone: 'amber' as const,
        href: '/items?status=inactive',
      },
      {
        label: tx('Taxonomy Nodes', 'Κόμβοι Κατηγοριοποίησης'),
        value: overview?.metrics.total_categories ?? 0,
        note: tx('Available category branches and leaves', 'Διαθέσιμα branches και leaves κατηγοριών'),
        tone: 'sky' as const,
        href: '/categories',
      },
      {
        label: tx('Active Clients', 'Ενεργοί Πελάτες'),
        value: overview?.metrics.active_clients ?? 0,
        note: tx('Client accounts with active access', 'Λογαριασμοί πελατών με ενεργή πρόσβαση'),
        tone: 'rose' as const,
        href: '/clients',
      },
      {
        label: tx('Queued Events', 'Συμβάντα σε Ουρά'),
        value: overview?.metrics.pending_notifications ?? 0,
        note: tx('Notifications waiting in the queue', 'Ειδοποιήσεις σε αναμονή'),
        tone: 'indigo' as const,
        href: '/notifications',
      },
      {
        label: tx('Brand Queue', 'Ουρά Brand Catalog'),
        value: overview?.metrics.pending_brand_queue ?? 0,
        note: tx('Pending manufacturer items awaiting review', 'Προϊόντα κατασκευαστών σε αναμονή έγκρισης'),
        tone: 'violet' as const,
        href: '/brand-queue',
      },
      {
        label: tx('Missing Barcodes', 'Barcodes που Ζητήθηκαν'),
        value: overview?.metrics.pending_missing_barcodes ?? 0,
        note: tx('Customer-requested barcodes not yet in DB', 'Barcodes πελατών που λείπουν από τη βάση'),
        tone: 'amber' as const,
        href: '/missing-barcodes',
      },
      {
        label: tx('Broken Images', 'Σπασμένες Εικόνες'),
        value: overview?.metrics.missing_hosted_image ?? 0,
        note: tx('Inactive items without a hosted image file', 'Ανενεργά είδη χωρίς τοπική εικόνα'),
        tone: 'rose' as const,
        href: '/items?missing=missing_any_image&quality=needs_fix',
      },
      {
        label: tx('Watermark Dead-ends', 'Watermark Αδιέξοδα'),
        value: overview?.metrics.watermark_dead_ends ?? 0,
        note: tx('Watermarked items with no clean replacement found', 'Watermarked είδη χωρίς εναλλακτική πηγή'),
        tone: 'sky' as const,
        href: '/fix-queue',
      },
      {
        label: tx('Duplicate Groups', 'Διπλά Barcodes'),
        value: overview?.metrics.pending_duplicates ?? 0,
        note: tx('Probable duplicate products awaiting merge review', 'Πιθανά διπλά προϊόντα για έλεγχο'),
        tone: 'indigo' as const,
        href: '/duplicates',
      },
    ],
    [overview, language],
  );

  return (
    <Fragment>
      <PageHeader
        title={tx('Control Room', 'Κέντρο Ελέγχου')}
        subtitle={tx('Operational snapshot of catalog volume, recent changes, and user activity.', 'Σύνοψη όγκου καταλόγου, πρόσφατων αλλαγών και δραστηριότητας χρηστών.')}
        eyebrow={tx('CMS Overview', 'Επισκόπηση CMS')}
        actions={<span className="cloudon-meta-pill">{tx('Live catalog state', 'Ζωντανή κατάσταση καταλόγου')}</span>}
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
              href={metric.href}
            />
          </Col>
        ))}
      </Row>

      <Row className="g-4 mt-1">
        <Col xl={8}>
          <SectionPanel title={tx('Recent Item Changes', 'Πρόσφατες Αλλαγές Ειδών')} eyebrow={tx('Audit Stream', 'Ροή Ελέγχου')}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : overview?.recent_item_changes.length ? (
              <Table responsive className="table table-striped mb-0 align-middle">
                <thead>
                  <tr>
                    <th>{tx('Field', 'Πεδίο')}</th>
                    <th>{tx('Change Type', 'Τύπος Αλλαγής')}</th>
                    <th>{tx('By', 'Από')}</th>
                    <th>{tx('Preview', 'Προεπισκόπηση')}</th>
                    <th>{tx('Time', 'Χρόνος')}</th>
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
              <PanelEmptyState label={tx('recent changes', 'πρόσφατες αλλαγές')} language={language} />
            )}
          </SectionPanel>
        </Col>
        <Col xl={4}>
          <SectionPanel title={tx('Items by Category', 'Είδη ανά Κατηγορία')} eyebrow={tx('Distribution', 'Κατανομή')}>
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
              <PanelEmptyState label={tx('category distribution', 'κατανομή κατηγοριών')} language={language} />
            )}
          </SectionPanel>
        </Col>
      </Row>

      <Row className="g-4 mt-1">
        <Col xl={6}>
          <SectionPanel title={tx('Recent User Activity', 'Πρόσφατη Δραστηριότητα Χρηστών')} eyebrow={tx('Operator Actions', 'Ενέργειες Χειριστών')}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : overview?.recent_user_activity.length ? (
              <Table responsive className="table table-striped mb-0 align-middle">
                <thead>
                  <tr>
                    <th>{tx('User', 'Χρήστης')}</th>
                    <th>{tx('Action', 'Ενέργεια')}</th>
                    <th>{tx('Entity', 'Οντότητα')}</th>
                    <th>{tx('Time', 'Χρόνος')}</th>
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
              <PanelEmptyState label={tx('user activity', 'δραστηριότητα χρηστών')} language={language} />
            )}
          </SectionPanel>
        </Col>
        <Col xl={6}>
          <SectionPanel title={tx('Recently Added Items', 'Πρόσφατα Προστιθέμενα Είδη')} eyebrow={tx('New Entries', 'Νέες Καταχωρίσεις')}>
            {loading ? <Spinner animation="border" size="sm" /> : <RecentItemsTable items={overview?.recent_added_items ?? []} language={language} />}
          </SectionPanel>
        </Col>
      </Row>

      <Row className="g-4 mt-1">
        <Col xl={12}>
          <SectionPanel title={tx('Items Added in the Last 30 Days', 'Είδη που Προστέθηκαν τις Τελευταίες 30 Ημέρες')} eyebrow={tx('Flow', 'Ροή')}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : overview?.items_added_last_30_days.length ? (
              <Table responsive className="table table-striped mb-0 align-middle">
                <thead>
                  <tr>
                    <th>{tx('Date', 'Ημερομηνία')}</th>
                    <th>{tx('Items Added', 'Είδη που Προστέθηκαν')}</th>
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
              <PanelEmptyState label={tx('time series', 'χρονοσειρά')} language={language} />
            )}
          </SectionPanel>
        </Col>
      </Row>
    </Fragment>
  );
}
