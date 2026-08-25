import { useState, type FormEvent } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Image, Row, Spinner, Table } from 'react-bootstrap';
import ModulePage from '../ModulePage';
import {
  scanBarcode,
  ingestFromSource,
  type ScannerResponse,
  type ScannerSourceResult,
} from '../../../services/cms-source-scanner';

function statusBadge(status: ScannerSourceResult['status']) {
  const variant =
    status === 'hit' ? 'success' : status === 'miss' ? 'secondary' : status === 'timeout' ? 'warning' : 'danger';
  const label =
    status === 'hit' ? 'Βρέθηκε' : status === 'miss' ? 'Δεν βρέθηκε' : status === 'timeout' ? 'Timeout' : 'Σφάλμα';
  return <Badge bg={variant}>{label}</Badge>;
}

function truncate(value: string, max = 90) {
  if (!value) return '';
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

export default function SourceScannerPage() {
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [scan, setScan] = useState<ScannerResponse | null>(null);
  const [importingSource, setImportingSource] = useState<string | null>(null);

  const handleScan = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = barcode.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setInfo('');
    setScan(null);
    try {
      const data = await scanBarcode(trimmed);
      setScan(data);
      if (!data.hits.length) {
        setInfo('Καμία πηγή δεν επέστρεψε στοιχεία για αυτό το barcode.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία scan');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (sourceKey: string) => {
    if (!scan) return;
    if (!window.confirm(`Εισαγωγή των στοιχείων από ${sourceKey} στον κατάλογο;`)) return;
    setImportingSource(sourceKey);
    setError('');
    setInfo('');
    try {
      const result = await ingestFromSource(scan.barcode, sourceKey);
      setInfo(`Επιτυχής εισαγωγή από ${sourceKey}: ${result.title || 'χωρίς τίτλο'}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία εισαγωγής');
    } finally {
      setImportingSource(null);
    }
  };

  const metrics = scan
    ? [
        {
          label: 'Πηγές με δεδομένα',
          value: `${scan.hits.length}/${scan.sources.length}`,
          helper: scan.hits.length ? scan.hits.join(', ') : 'Καμία πηγή δεν βρήκε το προϊόν',
          tone: (scan.hits.length ? 'success' : 'warning') as 'success' | 'warning',
        },
        {
          label: 'Συνολικός χρόνος scan',
          value: `${(scan.elapsed_ms / 1000).toFixed(1)}s`,
          helper: 'Παράλληλη αναζήτηση σε όλες τις ενεργές πηγές',
          tone: 'info' as const,
        },
      ]
    : [];

  return (
    <ModulePage
      title="Σαρωτής Πηγών"
      description="Δώσε ένα barcode και ψάξε ταυτόχρονα σε όλες τις ενεργές πηγές. Σύγκρινε ποια έχει τι και κάνε εισαγωγή από αυτή που προτιμάς."
      metrics={metrics}
    >
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {info ? <Alert variant="success">{info}</Alert> : null}

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleScan}>
            <Row className="g-3 align-items-end">
              <Col md={6}>
                <Form.Label>Barcode</Form.Label>
                <Form.Control
                  value={barcode}
                  onChange={(event) => setBarcode(event.target.value)}
                  placeholder="π.χ. 5203069090653"
                  autoFocus
                  disabled={loading}
                />
              </Col>
              <Col md={3}>
                <Button type="submit" className="w-100" disabled={loading || !barcode.trim()}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Σάρωση πηγών'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {scan ? (
        <Card>
          <Card.Header>
            <Card.Title>Αποτελέσματα για {scan.barcode}</Card.Title>
          </Card.Header>
          <Card.Body>
            <Table responsive className="align-middle">
              <thead>
                <tr>
                  <th>Πηγή</th>
                  <th>Κατάσταση</th>
                  <th>Τίτλος</th>
                  <th>Brand</th>
                  <th>Κατηγορίες</th>
                  <th>Εικόνα</th>
                  <th>Χρόνος</th>
                  <th>Ενέργειες</th>
                </tr>
              </thead>
              <tbody>
                {scan.sources.map((entry) => {
                  const d = entry.data;
                  const cats = [d.category_1, d.category_2, d.category_3].filter(Boolean).join(' › ');
                  return (
                    <tr key={entry.source_key}>
                      <td>
                        <strong>{entry.source_key}</strong>
                        {d.product_link ? (
                          <div className="text-muted small">
                            <a href={d.product_link} target="_blank" rel="noreferrer">
                              link
                            </a>
                          </div>
                        ) : null}
                      </td>
                      <td>{statusBadge(entry.status)}</td>
                      <td>{truncate(d.title || '', 80) || '-'}</td>
                      <td>{d.brand || '-'}</td>
                      <td>{cats || '-'}</td>
                      <td>
                        {d.image_url ? (
                          <Image src={d.image_url} alt="thumb" thumbnail style={{ maxWidth: 64, maxHeight: 64 }} />
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>{(entry.elapsed_ms / 1000).toFixed(1)}s</td>
                      <td>
                        {entry.status === 'hit' ? (
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => void handleImport(entry.source_key)}
                            disabled={importingSource === entry.source_key}
                          >
                            {importingSource === entry.source_key ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              'Εισαγωγή'
                            )}
                          </Button>
                        ) : entry.error ? (
                          <span className="text-danger small">{entry.error}</span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ) : null}
    </ModulePage>
  );
}
