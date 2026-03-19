import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Alert, Badge, Card, Col, Form, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import type { PortalCategorySummary, PortalItem } from '../../types';
import { fetchPortalCategories, fetchPortalItems, type PortalItemListParams } from '../../services/portal';
import PortalScopeNotice from '../components/PortalScopeNotice';
import { usePortalLanguage } from '../i18n/PortalLanguageProvider';

interface PortalItemsPageProps {
  title?: string;
  description?: string;
  recentOnlyDays?: number;
}

function itemCategoryLabel(item: PortalItem) {
  return item.category_path?.length ? item.category_path.join(' / ') : '-';
}

export default function PortalItemsPage({
  title,
  description,
  recentOnlyDays,
}: PortalItemsPageProps) {
  const { t, locale } = usePortalLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<PortalItem[]>([]);
  const [categories, setCategories] = useState<PortalCategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, per_page: 20, total_pages: 1 });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category1, setCategory1] = useState(searchParams.get('category_1') || '');
  const [category2, setCategory2] = useState(searchParams.get('category_2') || '');
  const [category3, setCategory3] = useState(searchParams.get('category_3') || '');
  const [sortBy, setSortBy] = useState<PortalItemListParams['sort_by']>('updated_at');
  const [sortOrder, setSortOrder] = useState<PortalItemListParams['sort_order']>('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const pageTitle = title || t('portal.items.title');
  const pageDescription = description || t('portal.items.subtitle');
  const activeFilterCount = [search, category1, category2, category3].filter(Boolean).length + (recentOnlyDays ? 1 : 0);
  const moduleMetrics = [
    {
      label: t('portal.metrics.filteredRecords'),
      value: pagination.total.toLocaleString(),
      helper: t('portal.items.searchLabel'),
      tone: 'primary' as const,
    },
    {
      label: t('portal.metrics.activeFilters'),
      value: activeFilterCount.toLocaleString(),
      helper: recentOnlyDays ? t('portal.items.lastDays', { days: recentOnlyDays }) : t('portal.actions.search'),
      tone: 'info' as const,
    },
    {
      label: t('portal.metrics.page'),
      value: `${pagination.page}/${pagination.total_pages || 1}`,
      helper: `${perPage} ${t('portal.items.perPage').toLowerCase()}`,
      tone: 'success' as const,
    },
  ];

  const formatDate = (value: string) => {
    if (!value) return '-';
    return new Date(value).toLocaleString(locale);
  };

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory1(searchParams.get('category_1') || '');
    setCategory2(searchParams.get('category_2') || '');
    setCategory3(searchParams.get('category_3') || '');
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchPortalCategories();
        if (active) {
          setCategories(data);
        }
      } catch {
        if (active) {
          setCategories([]);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const params: PortalItemListParams = {
      search: search || undefined,
      category_1: category1 || undefined,
      category_2: category2 || undefined,
      category_3: category3 || undefined,
      created_since_days: recentOnlyDays,
      page,
      per_page: perPage,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
    (async () => {
      try {
        const response = await fetchPortalItems(params);
        if (active) {
          setItems(response.data);
          setPagination(response.pagination);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : t('portal.error.items'));
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
  }, [search, category1, category2, category3, recentOnlyDays, page, perPage, sortBy, sortOrder, t]);

  const category1Options = useMemo(() => Array.from(new Set(categories.map((row) => row.category_1).filter(Boolean))).sort(), [categories]);

  const category2Options = useMemo(() => {
    return Array.from(
      new Set(
        categories
          .filter((row) => (!category1 || row.category_1 === category1) && row.category_2)
          .map((row) => row.category_2),
      ),
    ).sort();
  }, [categories, category1]);

  const category3Options = useMemo(() => {
    return Array.from(
      new Set(
        categories
          .filter(
            (row) =>
              (!category1 || row.category_1 === category1) &&
              (!category2 || row.category_2 === category2) &&
              row.category_3,
          )
          .map((row) => row.category_3),
      ),
    ).sort();
  }, [categories, category1, category2]);

  const syncQuery = (next: { search?: string; category_1?: string; category_2?: string; category_3?: string }) => {
    const query = new URLSearchParams();
    const merged = {
      search,
      category_1: category1,
      category_2: category2,
      category_3: category3,
      ...next,
    };
    Object.entries(merged).forEach(([key, value]) => {
      if (value) {
        query.set(key, value);
      }
    });
    setSearchParams(query, { replace: true });
  };

  const pages = useMemo(() => {
    const rows: ReactNode[] = [];
    for (let index = 1; index <= pagination.total_pages; index += 1) {
      rows.push(
        <Pagination.Item key={index} active={index === pagination.page} onClick={() => setPage(index)}>
          {index}
        </Pagination.Item>,
      );
    }
    return rows;
  }, [pagination.page, pagination.total_pages]);

  return (
    <div className="p-4">
      <div className="cloudon-page-banner mb-4">
        <div className="cloudon-page-banner__content">
          <span className="cloudon-page-banner__eyebrow">{t('portal.nav.items')}</span>
          <h1 className="cloudon-page-banner__title">{pageTitle}</h1>
          <p className="cloudon-page-banner__subtitle">{pageDescription}</p>
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
          <div className="cloudon-page-hero__toolbar">
          {recentOnlyDays ? (
            <Badge bg="primary" className="fs-12">
              {t('portal.items.lastDays', { days: recentOnlyDays })}
            </Badge>
          ) : null}
          </div>
        </div>
      </div>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <PortalScopeNotice />

      <Card className="border-0 shadow-sm mb-4 cloudon-filter-card">
        <Card.Body>
          <div className="cloudon-section-heading mb-3">
            <div>
              <span className="cloudon-section-heading__eyebrow">Filters</span>
              <h3 className="cloudon-section-heading__title mb-0">{t('portal.items.searchLabel')}</h3>
            </div>
            <div className="cloudon-section-heading__note">
              Narrow the catalog without leaving the page.
            </div>
          </div>
          <Row className="g-3 align-items-end">
            <Col xl={3} md={6}>
              <Form.Label>{t('portal.items.searchLabel')}</Form.Label>
              <Form.Control value={search} onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
                syncQuery({ search: event.target.value });
              }} placeholder={t('portal.items.searchPlaceholder')} />
            </Col>
            <Col xl={2} md={6}>
              <Form.Label>{t('portal.items.category1')}</Form.Label>
              <Form.Select value={category1} onChange={(event) => {
                setPage(1);
                setCategory1(event.target.value);
                setCategory2('');
                setCategory3('');
                syncQuery({ category_1: event.target.value, category_2: '', category_3: '' });
              }}>
                <option value="">{t('portal.items.allCategory1')}</option>
                {category1Options.map((value) => <option key={value} value={value}>{value}</option>)}
              </Form.Select>
            </Col>
            <Col xl={2} md={6}>
              <Form.Label>{t('portal.items.category2')}</Form.Label>
              <Form.Select value={category2} onChange={(event) => {
                setPage(1);
                setCategory2(event.target.value);
                setCategory3('');
                syncQuery({ category_2: event.target.value, category_3: '' });
              }}>
                <option value="">{t('portal.items.allCategory2')}</option>
                {category2Options.map((value) => <option key={value} value={value}>{value}</option>)}
              </Form.Select>
            </Col>
            <Col xl={2} md={6}>
              <Form.Label>{t('portal.items.category3')}</Form.Label>
              <Form.Select value={category3} onChange={(event) => {
                setPage(1);
                setCategory3(event.target.value);
                syncQuery({ category_3: event.target.value });
              }}>
                <option value="">{t('portal.items.allCategory3')}</option>
                {category3Options.map((value) => <option key={value} value={value}>{value}</option>)}
              </Form.Select>
            </Col>
            <Col xl={1} md={6}>
              <Form.Label>{t('portal.items.sort')}</Form.Label>
              <Form.Select value={sortBy} onChange={(event) => { setPage(1); setSortBy(event.target.value as PortalItemListParams['sort_by']); }}>
                <option value="updated_at">{t('portal.items.sort.updated')}</option>
                <option value="created_at">{t('portal.items.sort.created')}</option>
                <option value="title">{t('portal.items.sort.title')}</option>
                <option value="code">{t('portal.items.sort.code')}</option>
                <option value="barcode">{t('portal.items.sort.barcode')}</option>
              </Form.Select>
            </Col>
            <Col xl={1} md={6}>
              <Form.Label>{t('portal.items.order')}</Form.Label>
              <Form.Select value={sortOrder} onChange={(event) => { setPage(1); setSortOrder(event.target.value as PortalItemListParams['sort_order']); }}>
                <option value="desc">{t('portal.items.order.desc')}</option>
                <option value="asc">{t('portal.items.order.asc')}</option>
              </Form.Select>
            </Col>
            <Col xl={1} md={6}>
              <Form.Label>{t('portal.items.perPage')}</Form.Label>
              <Form.Select value={perPage} onChange={(event) => { setPage(1); setPerPage(Number(event.target.value)); }}>
                {[20, 50, 100].map((value) => <option key={value} value={value}>{value}</option>)}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm cloudon-data-panel">
        <Card.Body>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : items.length ? (
            <>
              <Table responsive className="table table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>{t('portal.table.title')}</th>
                    <th>{t('portal.table.code')}</th>
                    <th>{t('portal.table.category')}</th>
                    <th>{t('portal.table.created')}</th>
                    <th>{t('portal.table.updated')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="fw-semibold">{item.title || '-'}</div>
                        <div className="text-muted fs-12">{item.barcode || '-'}</div>
                      </td>
                      <td>{item.code || '-'}</td>
                      <td>{itemCategoryLabel(item)}</td>
                      <td>{formatDate(item.created_at)}</td>
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
              {pagination.total_pages > 1 ? <Pagination className="mt-4 mb-0">{pages}</Pagination> : null}
            </>
          ) : (
            <div className="text-muted">{t('portal.items.noItems')}</div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
