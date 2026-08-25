import { useEffect, useState } from 'react';
import { Alert, Badge, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import ModulePage from '../ModulePage';
import {
  fetchApiUsage,
  fetchTopClients,
  fetchTopMissingBarcodes,
} from '../../../services/cms-analytics';
import type {
  ApiUsageResponse,
  TopClientsResponse,
  TopMissingBarcodesResponse,
} from '../../../services/cms-analytics';

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function TimelineChart({ data }: { data: ApiUsageResponse['timeline'] }) {
  if (!data || data.length === 0) {
    return <div className="text-muted">Δεν υπάρχουν δεδομένα.</div>;
  }
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="d-flex align-items-end gap-1" style={{ height: 120 }}>
      {data.map((d) => {
        const height = Math.max(4, Math.round((d.count / max) * 100));
        return (
          <div key={d.date} className="d-flex flex-column align-items-center" style={{ flex: 1, minWidth: 0 }}>
            <div
              title={`${d.date}: ${d.count}`}
              style={{
                background: 'linear-gradient(180deg, #4e7cff 0%, #2348b3 100%)',
                width: '100%',
                height: `${height}%`,
                minHeight: 4,
                borderRadius: '3px 3px 0 0',
              }}
            />
            <div className="text-muted fs-12 mt-1" style={{ fontSize: 10, transform: 'rotate(-45deg)', transformOrigin: 'center top', whiteSpace: 'nowrap' }}>
              {d.date.slice(5)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const [days, setDays] = useState(7);
  const [usage, setUsage] = useState<ApiUsageResponse | null>(null);
  const [missing, setMissing] = useState<TopMissingBarcodesResponse | null>(null);
  const [clients, setClients] = useState<TopClientsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [u, m, c] = await Promise.all([
        fetchApiUsage(days),
        fetchTopMissingBarcodes(20),
        fetchTopClients(10),
      ]);
      setUsage(u);
      setMissing(m);
      setClients(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [days]);

  const moduleMetrics = [
    {
      label: 'Σύνολο events',
      value: (usage?.total_events ?? 0).toLocaleString(),
      helper: `Τελευταίες ${days} μέρες`,
      tone: 'primary' as const,
    },
    {
      label: 'Barcodes ζητήθηκαν',
      value: (usage?.total_barcodes_requested ?? 0).toLocaleString(),
      helper: 'Συνολικά από όλα τα requests',
      tone: 'info' as const,
    },
    {
      label: 'Ενεργοί πελάτες',
      value: (clients?.items.length ?? 0).toString(),
      helper: 'Με τουλάχιστον 1 request',
      tone: 'success' as const,
    },
  ];

  return (
    <ModulePage
      title="Business Analytics"
      description="API usage, top requested products, και ενεργοί πελάτες."
      metrics={moduleMetrics}
    >
      {error ? <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert> : null}

      <Card className="custom-card mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3}>
              <Form.Label>Περίοδος</Form.Label>
              <Form.Select value={days} onChange={(e) => setDays(Number(e.target.value))}>
                <option value={7}>Τελευταίες 7 μέρες</option>
                <option value={14}>14 μέρες</option>
                <option value={30}>30 μέρες</option>
                <option value={60}>60 μέρες</option>
                <option value={90}>90 μέρες</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="d-flex align-items-center gap-2 mb-4">
          <Spinner animation="border" size="sm" /><span>Φόρτωση...</span>
        </div>
      ) : null}

      <Row className="g-4 mb-4">
        <Col xl={8}>
          <Card className="custom-card h-100">
            <Card.Header className="border-bottom-0"><Card.Title>API Requests Timeline</Card.Title></Card.Header>
            <Card.Body>
              {usage ? <TimelineChart data={usage.timeline} /> : null}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4}>
          <Card className="custom-card h-100">
            <Card.Header className="border-bottom-0"><Card.Title>Top Endpoints</Card.Title></Card.Header>
            <Card.Body>
              {usage?.top_endpoints.length ? (
                <Table size="sm" className="mb-0">
                  <tbody>
                    {usage.top_endpoints.map((e) => (
                      <tr key={e.endpoint}>
                        <td><code>{e.endpoint}</code></td>
                        <td className="text-end"><Badge bg="primary">{e.count}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : <div className="text-muted">No data</div>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col xl={6}>
          <Card className="custom-card h-100">
            <Card.Header className="border-bottom-0"><Card.Title>Top Clients ({days} ημέρες)</Card.Title></Card.Header>
            <Card.Body>
              {usage?.top_clients.length ? (
                <Table size="sm" className="mb-0">
                  <tbody>
                    {usage.top_clients.map((c) => (
                      <tr key={c.client}>
                        <td>{c.client}</td>
                        <td className="text-end"><Badge bg="info">{c.count}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : <div className="text-muted">No data</div>}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card className="custom-card h-100">
            <Card.Header className="border-bottom-0"><Card.Title>Top Clients (lifetime)</Card.Title></Card.Header>
            <Card.Body>
              {clients?.items.length ? (
                <Table size="sm" className="mb-0">
                  <thead>
                    <tr><th>Client</th><th>Domain</th><th className="text-end">Requests</th><th>Τελευταία</th></tr>
                  </thead>
                  <tbody>
                    {clients.items.map((c) => (
                      <tr key={c.username + c.domain}>
                        <td>{c.name || c.username}</td>
                        <td className="text-muted fs-12">{c.domain}</td>
                        <td className="text-end"><Badge bg="success">{c.request_count.toLocaleString()}</Badge></td>
                        <td className="text-muted fs-12">{formatDate(c.last_access_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : <div className="text-muted">No data</div>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="custom-card">
        <Card.Header className="border-bottom-0"><Card.Title>Top Missing Barcodes (πιο ζητούμενα)</Card.Title></Card.Header>
        <Card.Body>
          {missing?.items.length ? (
            <Table size="sm" className="mb-0">
              <thead>
                <tr><th>Barcode</th><th className="text-end">Αιτήσεις</th><th>Πελάτες</th><th>Πρώτη</th><th>Τελευταία</th></tr>
              </thead>
              <tbody>
                {missing.items.map((m) => (
                  <tr key={m.barcode}>
                    <td><code>{m.barcode}</code></td>
                    <td className="text-end"><Badge bg="warning">{m.request_count}</Badge></td>
                    <td className="text-muted fs-12">{m.client_domains.join(', ') || '—'}</td>
                    <td className="text-muted fs-12">{formatDate(m.first_requested_at)}</td>
                    <td className="text-muted fs-12">{formatDate(m.last_requested_at)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : <div className="text-muted">No data</div>}
        </Card.Body>
      </Card>
    </ModulePage>
  );
}
