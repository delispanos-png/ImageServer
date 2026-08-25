import { useEffect, useState, type FormEvent } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import {
  listMySubmissions,
  submitProduct,
  type PortalSubmissionResult,
} from '../../services/portal-submissions';

function formatDate(value?: string) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function statusBadge(status: string) {
  const map: Record<string, { variant: string; label: string }> = {
    pending: { variant: 'secondary', label: 'Σε αναμονή' },
    searching: { variant: 'info', label: 'Αναζήτηση' },
    needs_review: { variant: 'warning', label: 'Σε αξιολόγηση' },
    approved: { variant: 'success', label: 'Εγκρίθηκε' },
    rejected: { variant: 'dark', label: 'Απορρίφθηκε' },
    failed: { variant: 'danger', label: 'Σφάλμα' },
  };
  const entry = map[status] || { variant: 'secondary', label: status };
  return <Badge bg={entry.variant}>{entry.label}</Badge>;
}

export default function PortalSubmitProductPage() {
  const [barcode, setBarcode] = useState('');
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [history, setHistory] = useState<PortalSubmissionResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await listMySubmissions({ limit: 20 });
      setHistory(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης ιστορικού');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, []);

  const resetForm = () => {
    setBarcode('');
    setTitle('');
    setBrand('');
    setDescription('');
    setImageUrl('');
    setNotes('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!barcode.trim()) {
      setError('Το barcode είναι υποχρεωτικό.');
      return;
    }
    setError('');
    setInfo('');
    setSubmitting(true);
    try {
      const result = await submitProduct({
        barcode: barcode.trim(),
        title: title.trim(),
        brand: brand.trim(),
        description: description.trim(),
        image_url: imageUrl.trim(),
        notes: notes.trim(),
      });
      setInfo(`Η υποβολή σου καταχωρήθηκε (${result.id}). Το σύστημα ψάχνει αυτόματα τις πηγές μας.`);
      resetForm();
      await loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία υποβολής');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-page">
      <div className="d-flex flex-column gap-3">
        <div>
          <h1 className="h3 mb-1">Υποβολή νέου προϊόντος</h1>
          <p className="text-muted mb-0">
            Στείλε ένα barcode μαζί με ό,τι πληροφορίες έχεις. Το σύστημα θα ψάξει αυτόματα στις πηγές μας και ο
            υπεύθυνος καταλόγου θα το ελέγξει.
          </p>
        </div>

        {error ? <Alert variant="danger">{error}</Alert> : null}
        {info ? <Alert variant="success">{info}</Alert> : null}

        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Barcode *</Form.Label>
                    <Form.Control
                      value={barcode}
                      onChange={(event) => setBarcode(event.target.value)}
                      placeholder="EAN/UPC"
                      required
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Τίτλος προϊόντος</Form.Label>
                    <Form.Control
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="π.χ. Vichy Dercos Energy+ 400ml"
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      value={brand}
                      onChange={(event) => setBrand(event.target.value)}
                      placeholder="π.χ. Vichy"
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Περιγραφή</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Σύντομη περιγραφή"
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>URL εικόνας (προαιρετικό)</Form.Label>
                    <Form.Control
                      value={imageUrl}
                      onChange={(event) => setImageUrl(event.target.value)}
                      placeholder="https://..."
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Σημειώσεις προς τον admin</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Οτιδήποτε χρήσιμο για τον έλεγχο"
                      disabled={submitting}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} className="d-flex justify-content-end">
                  <Button type="submit" disabled={submitting || !barcode.trim()}>
                    {submitting ? <Spinner animation="border" size="sm" /> : 'Υποβολή'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Οι υποβολές μου</Card.Title>
          </Card.Header>
          <Card.Body>
            {historyLoading ? (
              <Spinner animation="border" size="sm" />
            ) : history.length === 0 ? (
              <div className="text-muted">Δεν υπάρχουν προηγούμενες υποβολές.</div>
            ) : (
              <Table responsive size="sm" className="align-middle">
                <thead>
                  <tr>
                    <th>Barcode</th>
                    <th>Τίτλος υποβολής</th>
                    <th>Κατάσταση</th>
                    <th>Δημιουργήθηκε</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td><code>{item.Barcode}</code></td>
                      <td>{item.submitted?.title || '-'}</td>
                      <td>{statusBadge(item.status)}</td>
                      <td>{formatDate(item.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
