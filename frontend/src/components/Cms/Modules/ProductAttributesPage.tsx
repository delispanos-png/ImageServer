import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import ModulePage from '../ModulePage';
import {
  fetchProductAttributes,
  fetchSiteReadyExport,
  updateProductAttributes,
} from '../../../services/cms-attributes';
import type { AttributesResponse, AttributesUpdatePayload, ProductAttributes } from '../../../services/cms-attributes';

function confidenceBadge(conf?: string) {
  if (conf === 'verified') return <Badge bg="success">verified</Badge>;
  if (conf === 'estimated') return <Badge bg="warning">estimated</Badge>;
  return <Badge bg="secondary">—</Badge>;
}

function sourceLabel(src?: string) {
  if (!src) return '—';
  return src;
}

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCsv(rows: Record<string, unknown>[], filename: string) {
  if (rows.length === 0) return;
  const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ProductAttributesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBarcode = searchParams.get('barcode') || '';
  const [barcodeInput, setBarcodeInput] = useState(initialBarcode);
  const [data, setData] = useState<AttributesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [exportBusy, setExportBusy] = useState(false);

  // Form fields (controlled inputs)
  const [form, setForm] = useState<AttributesUpdatePayload>({});

  const load = async (barcode: string) => {
    if (!barcode.trim()) return;
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const response = await fetchProductAttributes(barcode.trim());
      setData(response);
      const a = response.attributes;
      setForm({
        weight_kg: a.weight_kg,
        length_cm: a.length_cm,
        width_cm: a.width_cm,
        height_cm: a.height_cm,
        vat_rate: a.vat_rate,
        package_size_label: a.package_size_label,
        mpn: a.mpn,
        wholesale_price: a.wholesale_price,
        retail_price: a.retail_price,
        discount_percent: a.discount_percent,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialBarcode) void load(initialBarcode);
  }, []);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setSearchParams({ barcode: barcodeInput.trim() });
    void load(barcodeInput);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setError('');
    try {
      const cleaned: AttributesUpdatePayload = {};
      (Object.keys(form) as (keyof AttributesUpdatePayload)[]).forEach((k) => {
        const v = form[k];
        if (v === undefined || v === null || v === '') return;
        cleaned[k] = v as never;
      });
      const result = await updateProductAttributes(data.barcode, cleaned);
      setData(result);
      setInfo('Αποθηκεύτηκε.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία αποθήκευσης.');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    setExportBusy(true);
    setError('');
    try {
      const result = await fetchSiteReadyExport(5000);
      if (format === 'json') downloadJson(result, `cloudon-site-ready-${Date.now()}.json`);
      else downloadCsv(result.items as Record<string, unknown>[], `cloudon-site-ready-${Date.now()}.csv`);
      setInfo(`Εξήχθησαν ${result.count} προϊόντα.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία export.');
    } finally {
      setExportBusy(false);
    }
  };

  const attrs: ProductAttributes = data?.attributes || {};
  const pricing = data?.pricing_summary;

  const attributeRows = useMemo(() => ([
    { label: 'Βάρος (kg)', field: 'weight_kg', value: attrs.weight_kg, source: attrs.weight_kg_source, conf: attrs.weight_kg_confidence },
    { label: 'Μήκος (cm)', field: 'length_cm', value: attrs.length_cm, source: attrs.length_cm_source, conf: attrs.length_cm_confidence },
    { label: 'Πλάτος (cm)', field: 'width_cm', value: attrs.width_cm, source: attrs.width_cm_source, conf: attrs.width_cm_confidence },
    { label: 'Ύψος (cm)', field: 'height_cm', value: attrs.height_cm, source: attrs.height_cm_source, conf: attrs.height_cm_confidence },
    { label: 'Volumetric (kg)', field: 'volumetric_weight_kg', value: attrs.volumetric_weight_kg, source: '(computed)', conf: 'verified' as const },
    { label: 'ΦΠΑ %', field: 'vat_rate', value: attrs.vat_rate, source: attrs.vat_rate_source, conf: attrs.vat_rate_confidence },
    { label: 'Συσκευασία', field: 'package_size_label', value: attrs.package_size_label, source: attrs.package_size_source, conf: 'estimated' as const },
    { label: 'MPN', field: 'mpn', value: attrs.mpn, source: attrs.mpn_source, conf: 'verified' as const },
  ]), [attrs]);

  return (
    <ModulePage
      title="Στοιχεία προϊόντος (Attributes)"
      description="Βάρος, διαστάσεις, ΦΠΑ, τιμές και άλλα attributes για e-shop upload. Manual edits μαρκάρονται ως verified."
    >
      {error ? <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert> : null}
      {info ? <Alert variant="success" onClose={() => setInfo('')} dismissible>{info}</Alert> : null}

      <Card className="custom-card mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch} className="d-flex gap-2 align-items-end">
            <div style={{ flex: 1 }}>
              <Form.Label>Barcode</Form.Label>
              <Form.Control
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="5201263890642"
              />
            </div>
            <Button type="submit" disabled={loading || !barcodeInput.trim()}>
              {loading ? <Spinner size="sm" animation="border" /> : 'Φόρτωση'}
            </Button>
            <Button variant="outline-success" disabled={exportBusy} onClick={() => handleExport('csv')}>
              Export CSV
            </Button>
            <Button variant="outline-secondary" disabled={exportBusy} onClick={() => handleExport('json')}>
              Export JSON
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {data ? (
        <>
          <Card className="custom-card mb-4">
            <Card.Header className="border-bottom-0 d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>{data.title || data.barcode}</Card.Title>
                <div className="text-muted fs-12">Barcode: <code>{data.barcode}</code> • Κατηγορία: {data.category_1 || '-'}</div>
              </div>
              <div>
                {data.site_ready_for_export ? (
                  <Badge bg="success">Site-ready</Badge>
                ) : (
                  <Badge bg="warning">Λείπουν attributes</Badge>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              <div className="text-muted fs-12 mb-2">
                Required για site-ready: {data.site_ready_required.join(', ')}
              </div>
              <Table size="sm" className="mb-0">
                <thead>
                  <tr><th>Πεδίο</th><th>Τιμή</th><th>Πηγή</th><th>Confidence</th></tr>
                </thead>
                <tbody>
                  {attributeRows.map((row) => (
                    <tr key={row.field}>
                      <td>{row.label}</td>
                      <td><code>{row.value !== undefined && row.value !== null && row.value !== '' ? String(row.value) : '—'}</code></td>
                      <td className="text-muted fs-12">{sourceLabel(row.source)}</td>
                      <td>{confidenceBadge(row.conf)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="custom-card mb-4">
            <Card.Header className="border-bottom-0"><Card.Title>Επεξεργασία attributes</Card.Title></Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={3}>
                  <Form.Label>Βάρος (kg)</Form.Label>
                  <Form.Control type="number" step="0.001" value={form.weight_kg ?? ''}
                    onChange={(e) => setForm({ ...form, weight_kg: e.target.value === '' ? undefined : Number(e.target.value) })} />
                </Col>
                <Col md={3}>
                  <Form.Label>Μήκος (cm)</Form.Label>
                  <Form.Control type="number" step="0.1" value={form.length_cm ?? ''}
                    onChange={(e) => setForm({ ...form, length_cm: e.target.value === '' ? undefined : Number(e.target.value) })} />
                </Col>
                <Col md={3}>
                  <Form.Label>Πλάτος (cm)</Form.Label>
                  <Form.Control type="number" step="0.1" value={form.width_cm ?? ''}
                    onChange={(e) => setForm({ ...form, width_cm: e.target.value === '' ? undefined : Number(e.target.value) })} />
                </Col>
                <Col md={3}>
                  <Form.Label>Ύψος (cm)</Form.Label>
                  <Form.Control type="number" step="0.1" value={form.height_cm ?? ''}
                    onChange={(e) => setForm({ ...form, height_cm: e.target.value === '' ? undefined : Number(e.target.value) })} />
                </Col>
                <Col md={3}>
                  <Form.Label>ΦΠΑ %</Form.Label>
                  <Form.Select value={form.vat_rate ?? ''}
                    onChange={(e) => setForm({ ...form, vat_rate: e.target.value === '' ? undefined : Number(e.target.value) })}>
                    <option value="">—</option>
                    <option value="6">6% (Φάρμακα)</option>
                    <option value="13">13% (Παιδικά)</option>
                    <option value="24">24% (Καλλυντικά)</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label>Συσκευασία</Form.Label>
                  <Form.Control value={form.package_size_label ?? ''}
                    onChange={(e) => setForm({ ...form, package_size_label: e.target.value })} placeholder="50ml" />
                </Col>
                <Col md={6}>
                  <Form.Label>MPN (κωδικός κατασκευαστή)</Form.Label>
                  <Form.Control value={form.mpn ?? ''}
                    onChange={(e) => setForm({ ...form, mpn: e.target.value })} />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="custom-card mb-4">
            <Card.Header className="border-bottom-0"><Card.Title>Τιμολόγηση</Card.Title></Card.Header>
            <Card.Body>
              <Row className="g-3 align-items-end">
                <Col md={3}>
                  <Form.Label>Χονδρική (€)</Form.Label>
                  <Form.Control type="number" step="0.01" value={form.wholesale_price ?? ''}
                    onChange={(e) => setForm({ ...form, wholesale_price: e.target.value === '' ? undefined : Number(e.target.value) })} />
                </Col>
                <Col md={3}>
                  <Form.Label>Λιανική (€, χωρίς ΦΠΑ)</Form.Label>
                  <Form.Control type="number" step="0.01" value={form.retail_price ?? ''}
                    onChange={(e) => setForm({ ...form, retail_price: e.target.value === '' ? undefined : Number(e.target.value) })} />
                </Col>
                <Col md={3}>
                  <Form.Label>Έκπτωση %</Form.Label>
                  <Form.Control type="number" step="0.1" min={0} max={100} value={form.discount_percent ?? ''}
                    onChange={(e) => setForm({ ...form, discount_percent: e.target.value === '' ? undefined : Number(e.target.value) })} />
                </Col>
                {pricing && pricing.retail_price > 0 ? (
                  <Col md={3}>
                    <div className="text-muted fs-12">Τιμή Καταναλωτή (με ΦΠΑ)</div>
                    <div className="fs-3 fw-semibold text-success">€{pricing.consumer_price_with_vat.toFixed(2)}</div>
                    {pricing.margin_percent > 0 ? (
                      <div className="text-muted fs-12">Περιθώριο: {pricing.margin_percent}%</div>
                    ) : null}
                  </Col>
                ) : null}
              </Row>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-end mb-4">
            <Button size="lg" onClick={handleSave} disabled={saving}>
              {saving ? <Spinner size="sm" animation="border" /> : 'Αποθήκευση'}
            </Button>
          </div>
        </>
      ) : null}
    </ModulePage>
  );
}
