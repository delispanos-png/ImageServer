import { useEffect, useState } from 'react';
import { Alert, Badge, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { PortalComment } from '../../types';
import { fetchPortalComments } from '../../services/portal';
import PortalScopeNotice from '../components/PortalScopeNotice';
import { usePortalLanguage } from '../i18n/PortalLanguageProvider';

function badgeVariant(status: PortalComment['status']) {
  return status === 'resolved' ? 'success' : status === 'under_review' ? 'warning' : 'info';
}

export default function PortalRemarksPage() {
  const { t, locale } = usePortalLanguage();
  const [remarks, setRemarks] = useState<PortalComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'under_review' | 'resolved'>('all');

  const formatDate = (value: string) => {
    if (!value) return '-';
    return new Date(value).toLocaleString(locale);
  };

  const statusLabel = (status: PortalComment['status']) => t(`portal.status.${status}`);
  const activeFilterCount = statusFilter === 'all' ? 0 : 1;
  const moduleMetrics = [
    {
      label: t('portal.metrics.filteredRecords'),
      value: remarks.length.toLocaleString(),
      helper: t('portal.nav.remarks'),
      tone: 'primary' as const,
    },
    {
      label: t('portal.metrics.activeFilters'),
      value: activeFilterCount.toLocaleString(),
      helper: t('portal.table.status'),
      tone: 'info' as const,
    },
    {
      label: t('portal.metrics.currentStatus'),
      value: t(`portal.remarks.status.${statusFilter}`),
      helper: t('portal.table.status'),
      tone: 'warning' as const,
    },
  ];

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const data = await fetchPortalComments({ status_filter: statusFilter });
        if (active) {
          setRemarks(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : t('portal.error.remarks'));
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
  }, [statusFilter, t]);

  return (
    <div className="p-4">
      <div className="cloudon-page-banner mb-4">
        <div className="cloudon-page-banner__content">
          <span className="cloudon-page-banner__eyebrow">{t('portal.nav.remarks')}</span>
          <h1 className="cloudon-page-banner__title">{t('portal.remarks.title')}</h1>
          <p className="cloudon-page-banner__subtitle">{t('portal.remarks.subtitle')}</p>
        </div>
        <div className="cloudon-page-hero__summary">
          <div className="cloudon-page-hero__metrics">
            {moduleMetrics.map((metric) => (
              <div
                key={`${metric.label}-${metric.value}`}
                className={`cloudon-page-hero__metric cloudon-page-hero__metric--${metric.tone}`}
              >
                <span className="cloudon-page-hero__metric-label">{metric.label}</span>
                <strong className="cloudon-page-hero__metric-value">{metric.value}</strong>
                <span className="cloudon-page-hero__metric-helper">{metric.helper}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <PortalScopeNotice />
      <Row className="mb-4">
        <Col xl={3}>
          <Form.Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}>
            <option value="all">{t('portal.remarks.status.all')}</option>
            <option value="new">{t('portal.remarks.status.new')}</option>
            <option value="under_review">{t('portal.remarks.status.under_review')}</option>
            <option value="resolved">{t('portal.remarks.status.resolved')}</option>
          </Form.Select>
        </Col>
      </Row>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : remarks.length ? (
            <Table responsive className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>{t('portal.items.title')}</th>
                  <th>{t('portal.table.type')}</th>
                  <th>{t('portal.table.status')}</th>
                  <th>{t('portal.table.comment')}</th>
                  <th>{t('portal.table.adminResponse')}</th>
                  <th>{t('portal.table.updated')}</th>
                </tr>
              </thead>
              <tbody>
                {remarks.map((remark) => (
                  <tr key={remark.id}>
                    <td>
                      <Link to={`/items/${remark.item_id}`} className="fw-semibold">{remark.item_title_snapshot || remark.item_barcode}</Link>
                      <div className="text-muted fs-12">{remark.item_barcode}</div>
                    </td>
                    <td>{remark.comment_type || '-'}</td>
                    <td><Badge bg={badgeVariant(remark.status)}>{statusLabel(remark.status)}</Badge></td>
                    <td>{remark.comment_text || '-'}</td>
                    <td>{remark.admin_response || remark.resolution_note || '-'}</td>
                    <td>{formatDate(remark.updated_at || remark.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-muted">{t('portal.remarks.noRows')}</div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
