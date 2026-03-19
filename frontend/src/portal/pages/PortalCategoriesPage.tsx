import { useEffect, useMemo, useState } from 'react';
import { Alert, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { PortalCategorySummary } from '../../types';
import { fetchPortalCategories } from '../../services/portal';
import PortalScopeNotice from '../components/PortalScopeNotice';
import { usePortalLanguage } from '../i18n/PortalLanguageProvider';

export default function PortalCategoriesPage() {
  const navigate = useNavigate();
  const { t } = usePortalLanguage();
  const [rows, setRows] = useState<PortalCategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchPortalCategories();
        if (active) {
          setRows(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : t('portal.error.categories'));
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

  const filteredRows = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) => row.label.toLowerCase().includes(normalized));
  }, [rows, search]);
  const activeFilterCount = search.trim() ? 1 : 0;
  const moduleMetrics = [
    {
      label: t('portal.metrics.filteredRecords'),
      value: filteredRows.length.toLocaleString(),
      helper: t('portal.categories.searchPlaceholder'),
      tone: 'primary' as const,
    },
    {
      label: t('portal.metrics.activeFilters'),
      value: activeFilterCount.toLocaleString(),
      helper: t('portal.actions.search'),
      tone: 'info' as const,
    },
    {
      label: t('portal.metrics.totalRecords'),
      value: rows.length.toLocaleString(),
      helper: t('portal.nav.categories'),
      tone: 'success' as const,
    },
  ];

  const openCategoryItems = (row: PortalCategorySummary) => {
    const query = new URLSearchParams();
    if (row.category_1) query.set('category_1', row.category_1);
    if (row.category_2) query.set('category_2', row.category_2);
    if (row.category_3) query.set('category_3', row.category_3);
    navigate(`/items?${query.toString()}`);
  };

  return (
    <div className="p-4">
      <div className="cloudon-page-banner mb-4">
        <div className="cloudon-page-banner__content">
          <span className="cloudon-page-banner__eyebrow">{t('portal.nav.categories')}</span>
          <h1 className="cloudon-page-banner__title">{t('portal.categories.title')}</h1>
          <p className="cloudon-page-banner__subtitle">{t('portal.categories.subtitle')}</p>
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
        <Col xl={5}>
          <Form.Control value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('portal.categories.searchPlaceholder')} />
        </Col>
      </Row>
      <Card className="border-0 shadow-sm">
        <Card.Body>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : filteredRows.length ? (
            <Table responsive hover className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>{t('portal.table.level')}</th>
                  <th>{t('portal.items.category1')}</th>
                  <th>{t('portal.items.category2')}</th>
                  <th>{t('portal.items.category3')}</th>
                  <th>{t('portal.table.items')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={`${row.label}-${row.level}`} role="button" onClick={() => openCategoryItems(row)}>
                    <td>{row.level}</td>
                    <td>{row.category_1 || '-'}</td>
                    <td>{row.category_2 || '-'}</td>
                    <td>{row.category_3 || '-'}</td>
                    <td>{row.items_count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-muted">{t('portal.categories.noRows')}</div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
