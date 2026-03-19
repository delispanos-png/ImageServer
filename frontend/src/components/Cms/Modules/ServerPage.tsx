import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Card, Col, Row, Spinner, Table } from 'react-bootstrap';
import ModulePage from '../ModulePage';
import { fetchServerOverview } from '../../../services/cms-server';
import type { CmsServerDiskUsage, CmsServerJob, CmsServerOverview, CmsServerProcess } from '../../../types';

const POLL_INTERVAL_MS = 5000;
type MetricTone = 'violet' | 'emerald' | 'amber' | 'sky' | 'rose' | 'indigo';

function formatBytes(value: number) {
  if (!value) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = value;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 100 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function ServerMetricIcon({ type }: { type: MetricTone }) {
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
          <path d="M12 6v6l4 2" />
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
    case 'sky':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12h16" />
          <path d="M12 4v16" />
        </svg>
      );
    case 'rose':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 7L9 18l-5-5" />
        </svg>
      );
    case 'indigo':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
          <path d="M7 7h10" />
          <path d="M9 17h6" />
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

function metricCard(title: string, value: string, note: string, tone: MetricTone) {
  return (
    <Card className={`cloudon-metric-card cloudon-metric-card--${tone} h-100`}>
      <Card.Body>
        <div className="cloudon-metric-card__icon">
          <ServerMetricIcon type={tone} />
        </div>
        <div className="cloudon-metric-card__label">{title}</div>
        <div className="cloudon-metric-card__value">{value}</div>
        <div className="cloudon-metric-card__note">{note}</div>
      </Card.Body>
    </Card>
  );
}

function mongoBadge(overview: CmsServerOverview) {
  if (overview.mongo.ok) {
    return <Badge bg="success">Mongo OK</Badge>;
  }
  return <Badge bg="danger">Σφάλμα Mongo</Badge>;
}

function diskTable(disks: CmsServerDiskUsage[]) {
  return (
    <Table responsive className="table table-striped align-middle mb-0">
      <thead>
        <tr>
          <th>Διαδρομή</th>
          <th>Σύνολο</th>
          <th>Χρήση</th>
          <th>Ελεύθερο</th>
          <th>Χρήση %</th>
        </tr>
      </thead>
      <tbody>
        {disks.map((disk) => (
          <tr key={disk.path}>
            <td className="fw-semibold">{disk.path}</td>
            <td>{formatBytes(disk.total_bytes)}</td>
            <td>{formatBytes(disk.used_bytes)}</td>
            <td>{formatBytes(disk.free_bytes)}</td>
            <td>{disk.used_percent.toFixed(2)}%</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function jobsTable(jobs: CmsServerJob[]) {
  if (!jobs.length) {
    return <div className="text-muted">Δεν υπάρχουν ενεργές εργασίες στο παρασκήνιο.</div>;
  }

  return (
    <Table responsive className="table table-striped align-middle mb-0">
      <thead>
        <tr>
          <th>Job</th>
          <th>PID</th>
          <th>Διάρκεια</th>
          <th>CPU %</th>
          <th>Mem %</th>
          <th>Εντολή</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={`${job.pid}-${job.name}`}>
            <td className="fw-semibold">{job.name}</td>
            <td>{job.pid}</td>
            <td>{job.elapsed_human}</td>
            <td>{job.cpu_percent.toFixed(1)}</td>
            <td>{job.memory_percent.toFixed(1)}</td>
            <td className="text-break fs-12">{job.command}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function processesTable(processes: CmsServerProcess[]) {
  return (
    <Table responsive className="table table-striped align-middle mb-0">
      <thead>
        <tr>
          <th>PID</th>
          <th>CPU %</th>
          <th>Mem %</th>
          <th>Εντολή</th>
        </tr>
      </thead>
      <tbody>
        {processes.map((process) => (
          <tr key={`${process.pid}-${process.command}`}>
            <td>{process.pid}</td>
            <td>{process.cpu_percent.toFixed(1)}</td>
            <td>{process.memory_percent.toFixed(1)}</td>
            <td className="text-break fs-12">{process.command}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default function ServerPage() {
  const [overview, setOverview] = useState<CmsServerOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const nextOverview = await fetchServerOverview();
        if (!active) return;
        setOverview(nextOverview);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης στοιχείων server.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();
    const interval = window.setInterval(() => {
      void load();
    }, POLL_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const refreshedAt = useMemo(() => {
    if (!overview?.captured_at) return '-';
    return new Date(overview.captured_at).toLocaleString();
  }, [overview?.captured_at]);

  return (
    <ModulePage
      title="Διακομιστής"
      description="Ζωντανά στατιστικά για runtime, Mongo, χρήση δίσκου και εργασίες παρασκηνίου."
    >
      {error ? <Alert variant="danger">{error}</Alert> : null}

      {loading && !overview ? (
        <Card>
          <Card.Body className="py-5 d-flex justify-content-center">
            <Spinner animation="border" />
          </Card.Body>
        </Card>
      ) : null}

      {overview ? (
        <>
          <Alert variant={overview.mongo.ok ? 'success' : 'warning'} className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              {mongoBadge(overview)}
              <span className="ms-3">Host: <strong>{overview.hostname}</strong></span>
              <span className="ms-3">Python: <strong>{overview.python_version}</strong></span>
            </div>
            <div className="text-muted fs-12">Τελευταία ενημέρωση: {refreshedAt}</div>
          </Alert>

          <Row className="g-3 mb-4">
            <Col xl={3} md={6}>{metricCard('Uptime συστήματος', overview.uptime.system_human, `${overview.uptime.system_seconds.toLocaleString()} δευτερόλεπτα`, 'violet')}</Col>
            <Col xl={3} md={6}>{metricCard('Uptime εφαρμογής', overview.uptime.app_human, `${overview.uptime.app_seconds.toLocaleString()} δευτερόλεπτα`, 'emerald')}</Col>
            <Col xl={3} md={6}>{metricCard('CPU Load 1λ', overview.load_average.load_1.toFixed(2), `Ανά CPU: ${overview.load_average.per_cpu_1.toFixed(2)} / cores: ${overview.cpu_count}`, 'amber')}</Col>
            <Col xl={3} md={6}>{metricCard('Χρήση μνήμης', `${overview.memory.used_percent.toFixed(2)}%`, `${formatBytes(overview.memory.used_bytes)} από ${formatBytes(overview.memory.total_bytes)}`, 'sky')}</Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col xl={3} md={6}>{metricCard('Προϊόντα', overview.app_collections.products.toLocaleString(), 'Ενεργά προϊόντα στο Mongo', 'rose')}</Col>
            <Col xl={3} md={6}>{metricCard('CMS Κατηγορίες', overview.app_collections.cms_categories.toLocaleString(), 'Κόμβοι ταξινομίας διαθέσιμοι', 'indigo')}</Col>
            <Col xl={3} md={6}>{metricCard('CMS Πελάτες', overview.app_collections.cms_clients.toLocaleString(), 'Εμπορικοί λογαριασμοί', 'emerald')}</Col>
            <Col xl={3} md={6}>{metricCard('Audit Logs', overview.app_collections.cms_audit_logs.toLocaleString(), `Mongo latency ${overview.mongo.latency_ms.toFixed(2)} ms`, 'violet')}</Col>
          </Row>

          <Row className="g-3">
            <Col xl={7}>
              <Card className="custom-card">
                <Card.Header>
                  <Card.Title>Χρήση δίσκου</Card.Title>
                </Card.Header>
                <Card.Body>{diskTable(overview.disks)}</Card.Body>
              </Card>
            </Col>
            <Col xl={5}>
              <Card className="custom-card">
                <Card.Header>
                  <Card.Title>Load Average</Card.Title>
                </Card.Header>
                <Card.Body className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between"><span>1 λεπτό</span><strong>{overview.load_average.load_1.toFixed(2)}</strong></div>
                  <div className="d-flex justify-content-between"><span>5 λεπτά</span><strong>{overview.load_average.load_5.toFixed(2)}</strong></div>
                  <div className="d-flex justify-content-between"><span>15 λεπτά</span><strong>{overview.load_average.load_15.toFixed(2)}</strong></div>
                  {!overview.mongo.ok ? (
                    <Alert variant="danger" className="mb-0">
                      Σφάλμα Mongo: {overview.mongo.error || 'Άγνωστο σφάλμα'}
                    </Alert>
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-3 mt-1">
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header>
                  <Card.Title>Εργασίες παρασκηνίου</Card.Title>
                </Card.Header>
                <Card.Body>{jobsTable(overview.background_jobs)}</Card.Body>
              </Card>
            </Col>
            <Col xl={12}>
              <Card className="custom-card">
                <Card.Header>
                  <Card.Title>Κορυφαίες διεργασίες</Card.Title>
                </Card.Header>
                <Card.Body>{processesTable(overview.top_processes)}</Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : null}
    </ModulePage>
  );
}
