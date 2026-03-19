import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Alert, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { PortalDashboardOverview } from '../../types';
import { fetchPortalDashboardOverview } from '../../services/portal';
import PortalScopeNotice from '../components/PortalScopeNotice';
import { usePortalLanguage } from '../i18n/PortalLanguageProvider';

type MetricTone = 'violet' | 'emerald' | 'amber' | 'sky';

function PortalMetricCard({
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

function PortalDashboardIcon({ type }: { type: MetricTone }) {
  switch (type) {
    case 'emerald':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 4v16" />
          <path d="M7 9l5-5 5 5" />
        </svg>
      );
    case 'amber':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l8 4v10l-8 4-8-4V7z" />
          <path d="M12 12l8-5" />
          <path d="M12 12v9" />
        </svg>
      );
    case 'sky':
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
        </svg>
      );
  }
}

function Panel({
  title,
  eyebrow,
  children,
  action,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card className="cloudon-data-panel h-100">
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

export default function PortalDashboardPage() {
  const { t, locale } = usePortalLanguage();
  const [overview, setOverview] = useState<PortalDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDate = (value: string) => {
    if (!value) return '-';
    return new Date(value).toLocaleString(locale);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchPortalDashboardOverview();
        if (active) {
          setOverview(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : t('portal.error.dashboard'));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [t]);

  const metrics = useMemo(
    () => [
      {
        label: t('portal.dashboard.metric.activeProducts'),
        value: overview?.metrics.active_items ?? 0,
        note: t('portal.dashboard.metric.activeProductsNote'),
        tone: 'violet' as const,
      },
      {
        label: t('portal.dashboard.metric.newProducts'),
        value: overview?.metrics.new_items_last_30_days ?? 0,
        note: t('portal.dashboard.metric.newProductsNote'),
        tone: 'emerald' as const,
      },
      {
        label: t('portal.dashboard.metric.myRemarks'),
        value: overview?.metrics.items_with_my_remarks ?? 0,
        note: t('portal.dashboard.metric.myRemarksNote'),
        tone: 'amber' as const,
      },
      {
        label: t('portal.dashboard.metric.openRemarks'),
        value: overview?.metrics.open_remarks ?? 0,
        note: t('portal.dashboard.metric.openRemarksNote'),
        tone: 'sky' as const,
      },
    ],
    [overview, t],
  );

  return (
    <div className="p-4">
      <div className="cloudon-page-banner mb-4">
        <div className="cloudon-page-banner__content">
          <span className="cloudon-page-banner__eyebrow">{t('portal.title')}</span>
          <h1 className="cloudon-page-banner__title">{t('portal.dashboard.title')}</h1>
          <p className="cloudon-page-banner__subtitle">{t('portal.dashboard.subtitle')}</p>
        </div>
        <div className="cloudon-page-banner__actions">
          <Link to="/items" className="btn btn-outline-primary">
            {t('portal.actions.allItems')}
          </Link>
          <Link to="/my-remarks" className="btn btn-primary">
            {t('portal.actions.myRemarks')}
          </Link>
        </div>
      </div>

      {error ? <Alert variant="danger">{error}</Alert> : null}
      <PortalScopeNotice />

      <Row className="g-4 mb-1">
        {metrics.map((metric) => (
          <Col xl={3} md={6} key={metric.label}>
            <PortalMetricCard
              label={metric.label}
              value={metric.value}
              note={metric.note}
              tone={metric.tone}
              icon={<PortalDashboardIcon type={metric.tone} />}
              loading={loading}
            />
          </Col>
        ))}
      </Row>

      <Row className="g-4 mt-1">
        <Col xl={7}>
          <Panel title={t('portal.dashboard.recentlyUpdated')} eyebrow={t('portal.actions.allItems')}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : overview?.recently_updated_items.length ? (
              <Table responsive className="table table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>{t('portal.table.title')}</th>
                    <th>{t('portal.table.code')}</th>
                    <th>{t('portal.table.barcode')}</th>
                    <th>{t('portal.table.updated')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recently_updated_items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title || '-'}</td>
                      <td>{item.code || '-'}</td>
                      <td>{item.barcode || '-'}</td>
                      <td>{formatDate(item.updated_at)}</td>
                      <td className="text-end">
                        <Link to={`/items/${item.id}`} className="cloudon-portal-view-action">
                          <span>{t('portal.actions.view')}</span>
                          <i className="fe fe-arrow-right" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="cloudon-panel-empty">{t('portal.dashboard.noRecent')}</div>
            )}
          </Panel>
        </Col>
        <Col xl={5}>
          <Panel
            title={t('portal.dashboard.byCategory')}
            eyebrow={t('portal.nav.categories')}
            action={
              <Link to="/categories" className="btn btn-sm btn-light">
                {t('portal.actions.viewAll')}
              </Link>
            }
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : overview?.items_by_category.length ? (
              <div className="d-flex flex-column gap-3">
                {overview.items_by_category.map((entry) => (
                  <div key={entry.category} className="cloudon-progress-row">
                    <div className="d-flex justify-content-between mb-2 fs-13 gap-3">
                      <span className="text-truncate">{entry.category}</span>
                      <strong>{entry.count}</strong>
                    </div>
                    <div className="progress progress-xs cloudon-progress-track">
                      <div
                        className="progress-bar"
                        style={{ width: `${Math.min(100, (entry.count / Math.max(1, overview.items_by_category[0]?.count || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cloudon-panel-empty">{t('portal.dashboard.noCategoryDistribution')}</div>
            )}
          </Panel>
        </Col>
      </Row>
    </div>
  );
}
