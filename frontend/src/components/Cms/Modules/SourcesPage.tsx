import { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import ModulePage from '../ModulePage';
import { fetchSourcesOverview, removeSource, restoreSource, runSourceJob, updateSourceSettings, uploadSourceJobFile } from '../../../services/cms-sources';
import type { CmsOtherDetectedSource, CmsSourceJob, CmsSourceOverview, CmsSourcesOverview } from '../../../types';
import { useAuth } from '../../../app/providers/AuthProvider';

type SourceTone = 'violet' | 'emerald' | 'amber' | 'sky' | 'rose' | 'indigo';

function statusBadge(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === 'removed') {
    return <Badge bg="dark">Αφαιρέθηκε</Badge>;
  }
  if (normalized === 'active' || normalized === 'proxy_ready') {
    return <Badge bg="success">{status}</Badge>;
  }
  if (normalized === 'proxy_required' || normalized === 'standby') {
    return (
      <Badge bg="warning" text="dark">
        {status}
      </Badge>
    );
  }
  if (normalized === 'feed_only') {
    return <Badge bg="info">Μόνο feed</Badge>;
  }
  return <Badge bg="secondary">{status}</Badge>;
}

function formatFileSize(sizeBytes: number) {
  if (!sizeBytes) {
    return '0 B';
  }
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }
  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function numberCell(value: number) {
  return <span className="fw-semibold">{value.toLocaleString()}</span>;
}

function renderCapabilities(source: CmsSourceOverview) {
  return (
    <div className="d-flex flex-wrap gap-2">
      {source.capabilities
        .filter((capability) => capability.enabled)
        .map((capability) => (
          <Badge key={capability.key} bg="light" text="dark">
            {capability.label}
          </Badge>
        ))}
    </div>
  );
}

function renderNotes(source: CmsSourceOverview) {
  if (!source.notes.length) {
    return <span className="text-muted">-</span>;
  }
  return (
    <div className="d-flex flex-column gap-1">
      {source.notes.map((note) => (
        <span key={note} className="text-muted fs-12">
          {note}
        </span>
      ))}
    </div>
  );
}

function renderFieldCoverage(source: CmsSourceOverview) {
  return (
    <div className="d-flex flex-column gap-1 fs-12">
      <div>Τίτλος: {source.field_coverage.title.toLocaleString()}</div>
      <div>Σύντομος: {source.field_coverage.short_title.toLocaleString()}</div>
      <div>Περιγραφή: {source.field_coverage.description.toLocaleString()}</div>
      <div>Μάρκα: {source.field_coverage.brand.toLocaleString()}</div>
      <div>Κατηγορίες: {source.field_coverage.category_tree.toLocaleString()}</div>
      <div>Πηγή εικόνας: {source.field_coverage.source_image.toLocaleString()}</div>
    </div>
  );
}

function renderImageStats(source: CmsSourceOverview) {
  return (
    <div className="d-flex flex-column gap-1 fs-12">
      <div>Προϊόντα: {source.products_in_db.toLocaleString()}</div>
      <div>Φιλοξενούμενες: {source.hosted_images_count.toLocaleString()}</div>
      <div>Πολλαπλές: {source.multiple_images_count.toLocaleString()}</div>
      <div>Υδατογράφημα: {source.watermark_cleaned_count.toLocaleString()}</div>
    </div>
  );
}

function renderSourceDetails(source: CmsSourceOverview) {
  return (
    <div className="d-flex flex-column gap-2">
      <div>
        <div className="fw-semibold fs-12 mb-1">Δυνατότητες</div>
        {renderCapabilities(source)}
      </div>
      <div>
        <div className="fw-semibold fs-12 mb-1">Μοτίβο αναζήτησης</div>
        <div className="text-muted fs-12 text-break">{source.search_pattern || '-'}</div>
      </div>
      <div>
        <div className="fw-semibold fs-12 mb-1">Σημειώσεις</div>
        {renderNotes(source)}
      </div>
    </div>
  );
}

function renderChainBadge(source: CmsSourceOverview) {
  if (source.removed) {
    return <Badge bg="dark">Αφαιρέθηκε</Badge>;
  }
  if (!source.enabled_in_chain) {
    return <Badge bg="secondary">Απενεργοποιημένη</Badge>;
  }
  if (source.priority === 1) {
    return <Badge bg="primary">Κύρια</Badge>;
  }
  return <Badge bg="info">Εφεδρική #{source.priority}</Badge>;
}

function renderPurposeBadges(source: CmsSourceOverview) {
  return (
    <div className="d-flex flex-wrap gap-2 cloudon-source-chip-group">
      {source.text_priority > 0 ? (
        <Badge bg="primary">Κείμενο #{source.text_priority}</Badge>
      ) : (
        <Badge bg="secondary">Χωρίς κείμενο</Badge>
      )}
      {source.image_priority > 0 ? (
        <Badge bg="success">Εικόνες #{source.image_priority}</Badge>
      ) : (
        <Badge bg="secondary">Χωρίς εικόνες</Badge>
      )}
    </div>
  );
}

function sourceTone(source: CmsSourceOverview): SourceTone {
  if (source.removed) {
    return 'indigo';
  }
  if (source.access_status === 'proxy_required' || source.access_status === 'standby') {
    return 'amber';
  }
  if (source.access_status === 'feed_only') {
    return 'sky';
  }
  if (source.access_status === 'unstable') {
    return 'rose';
  }
  if (source.enabled_in_chain) {
    return 'emerald';
  }
  return 'violet';
}

function sourceMetricIcon({ tone }: { tone: SourceTone }) {
  switch (tone) {
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
          <path d="M4 12h16" />
          <path d="M12 4v16" />
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

function getDetectedHostJobShortcut(
  detectedHostKey: string,
  managedSources: CmsSourceOverview[],
): { source: CmsSourceOverview; job: CmsSourceJob } | null {
  if (detectedHostKey === 'youpharmacy_xml') {
    const source = managedSources.find((row) => row.key === 'youpharmacy');
    const job = source?.jobs.find((row) => row.key === 'replace_photos_from_xml');
    if (source && job) {
      return { source, job };
    }
  }
  return null;
}

function renderDetectedSources(
  otherSources: CmsOtherDetectedSource[],
  managedSources: CmsSourceOverview[],
  canRunJobs: boolean,
  busyActions: Record<string, boolean>,
  jobUploadFiles: Record<string, File | null>,
  onSelectJobUpload: (sourceKey: string, jobKey: string, file: File | null) => void,
  onUploadJobFile: (source: CmsSourceOverview, job: CmsSourceJob) => Promise<void>,
  onRunJob: (source: CmsSourceOverview, job: CmsSourceJob) => Promise<void>,
) {
  if (!otherSources.length) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Άλλοι ανιχνευμένοι host</Card.Title>
        </Card.Header>
        <Card.Body className="text-muted">Δεν εντοπίστηκαν επιπλέον host πηγών στα προϊόντα.</Card.Body>
      </Card>
    );
  }

  return (
    <Card className="cloudon-data-panel">
      <Card.Header>
        <Card.Title>Άλλοι ανιχνευμένοι host</Card.Title>
      </Card.Header>
      <Card.Body>
        <Table responsive className="table table-striped mb-0 align-middle">
          <thead>
            <tr>
              <th>Host</th>
              <th>Προϊόντα</th>
              <th>Hosted εικόνες</th>
              <th>Πολλαπλές εικόνες</th>
              <th>Ενέργειες</th>
            </tr>
          </thead>
          <tbody>
            {otherSources.map((source) => {
              const shortcut = getDetectedHostJobShortcut(source.key, managedSources);
              const busyKey = shortcut ? `job:${shortcut.source.key}:${shortcut.job.key}` : '';
              const uploadKey = shortcut ? `upload:${shortcut.source.key}:${shortcut.job.key}` : '';
              const selectedFile = shortcut ? jobUploadFiles[uploadKey] : null;
              return (
                <tr key={source.key}>
                  <td>{source.label}</td>
                  <td>{numberCell(source.products_in_db)}</td>
                  <td>{numberCell(source.hosted_images_count)}</td>
                  <td>{numberCell(source.multiple_images_count)}</td>
                  <td style={{ minWidth: 320 }}>
                    {shortcut ? (
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <span className="fw-semibold fs-12">{shortcut.job.label}</span>
                          {jobBadge(shortcut.job)}
                        </div>
                        {shortcut.job.upload?.has_file ? (
                          <div className="text-muted fs-12">
                            <div>{shortcut.job.upload.file_name}</div>
                            <div>
                              Μεταφορτώθηκε: {shortcut.job.upload.uploaded_at ? formatTimestamp(shortcut.job.upload.uploaded_at) : '-'}
                              {shortcut.job.upload.size_bytes ? ` · ${formatFileSize(shortcut.job.upload.size_bytes)}` : ''}
                            </div>
                            <div>
                              Προϊόντα: {shortcut.job.upload.product_count.toLocaleString()} · Με εικόνα: {shortcut.job.upload.image_rows.toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted fs-12">Δεν έχει ανέβει XML.</div>
                        )}
                        {canRunJobs ? (
                          <>
                            <Form.Control
                              type="file"
                              size="sm"
                              accept={shortcut.job.upload?.accept || '.xml'}
                              disabled={shortcut.job.running || busyActions[uploadKey]}
                              onChange={(event) =>
                                onSelectJobUpload(
                                  shortcut.source.key,
                                  shortcut.job.key,
                                  (event.currentTarget as HTMLInputElement).files?.[0] ?? null,
                                )
                              }
                            />
                            <div className="d-flex gap-2">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                className="flex-fill"
                                disabled={shortcut.job.running || busyActions[uploadKey] || !selectedFile}
                                onClick={() => void onUploadJobFile(shortcut.source, shortcut.job)}
                              >
                                {busyActions[uploadKey] ? 'Μεταφόρτωση...' : 'Μεταφόρτωση XML'}
                              </Button>
                              <Button
                                size="sm"
                                variant="primary"
                                className="flex-fill"
                                disabled={busyActions[busyKey] || shortcut.job.running || Boolean(shortcut.job.upload?.required && !shortcut.job.upload.has_file)}
                                onClick={() => void onRunJob(shortcut.source, shortcut.job)}
                              >
                                {busyActions[busyKey] ? 'Εκκίνηση...' : shortcut.job.running ? 'Σε εξέλιξη' : 'Έναρξη εισαγωγής'}
                              </Button>
                            </div>
                          </>
                        ) : (
                          <span className="text-muted fs-12">Χωρίς δικαίωμα εκτέλεσης</span>
                        )}
                      </div>
                    ) : source.key === 'youpharmacy_xml' ? (
                      <span className="text-muted fs-12">
                        Η συντόμευση μεταφόρτωσης XML θα εμφανιστεί όταν το API service φορτώσει το νέο endpoint του youpharmacy.
                      </span>
                    ) : (
                      <span className="text-muted fs-12">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

function jobBadge(job: CmsSourceJob) {
  const normalized = (job.status || '').toLowerCase();
  if (job.running || normalized === 'running' || normalized === 'starting') {
    return <Badge bg="success">Σε εξέλιξη{job.pid ? ` #${job.pid}` : ''}</Badge>;
  }
  if (normalized === 'completed') {
    return <Badge bg="primary">Ολοκληρώθηκε</Badge>;
  }
  if (normalized === 'failed') {
    return <Badge bg="danger">Απέτυχε</Badge>;
  }
  return <Badge bg="secondary">Ανενεργό</Badge>;
}

function formatTimestamp(value: string) {
  if (!value) {
    return '';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString();
}

export default function SourcesPage() {
  const { hasPermission } = useAuth();
  const canUpdateSources = hasPermission('sources.update');
  const canRunJobs = hasPermission('sources.run');

  const [overview, setOverview] = useState<CmsSourcesOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyActions, setBusyActions] = useState<Record<string, boolean>>({});
  const [priorityDrafts, setPriorityDrafts] = useState<Record<string, { priority: number; text_priority: number; image_priority: number }>>({});
  const [jobUploadFiles, setJobUploadFiles] = useState<Record<string, File | null>>({});
  const [expandedSourceKey, setExpandedSourceKey] = useState<string | null>(null);

  const setBusy = useCallback((key: string, value: boolean) => {
    setBusyActions((current) => ({ ...current, [key]: value }));
  }, []);

  const load = useCallback(async () => {
    setError('');
    try {
      setOverview(await fetchSourcesOverview());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης συνοπτικών στοιχείων πηγών.');
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      await load();
      setLoading(false);
    };
    void bootstrap();
  }, [load]);

  useEffect(() => {
    if (!overview?.sources.some((source) => source.jobs.some((job) => job.running))) {
      return undefined;
    }
    const intervalId = window.setInterval(() => {
      void load();
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [load, overview]);

  useEffect(() => {
    if (!overview) {
      return;
    }
    setPriorityDrafts((current) => {
      const next = { ...current };
      overview.sources.forEach((source) => {
        next[source.key] = {
          priority: current[source.key]?.priority ?? source.priority,
          text_priority: current[source.key]?.text_priority ?? source.text_priority,
          image_priority: current[source.key]?.image_priority ?? source.image_priority,
        };
      });
      return next;
    });
  }, [overview]);

  const handleToggle = useCallback(
    async (source: CmsSourceOverview) => {
      const busyKey = `toggle:${source.key}`;
      setBusy(busyKey, true);
      setNotice('');
      setError('');
      try {
        const nextEnabled = !source.enabled_in_chain;
        const response = await updateSourceSettings(source.key, { enabled: nextEnabled });
        await load();
        setNotice(
          `${source.label}: ${response.source?.enabled_in_chain ? 'ενεργοποιήθηκε στην αλυσίδα πηγών' : 'απενεργοποιήθηκε από την αλυσίδα πηγών'}`,
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : `Αποτυχία ενημέρωσης ${source.label}.`);
      } finally {
        setBusy(busyKey, false);
      }
    },
    [load, setBusy],
  );

  const handleRunJob = useCallback(
    async (source: CmsSourceOverview, job: CmsSourceJob) => {
      const busyKey = `job:${source.key}:${job.key}`;
      setBusy(busyKey, true);
      setNotice('');
      setError('');
      try {
        const response = await runSourceJob(source.key, job.key);
        await load();
        if (response.job_start.already_running) {
          setNotice(`${source.label}: το ${job.label} εκτελείται ήδη.`);
        } else if (response.job_start.started) {
          setNotice(`${source.label}: το ${job.label} ξεκίνησε.`);
        } else {
          setNotice(`${source.label}: το αίτημα για ${job.label} ολοκληρώθηκε.`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : `Αποτυχία εκκίνησης ${job.label}.`);
      } finally {
        setBusy(busyKey, false);
      }
    },
    [load, setBusy],
  );

  const handleSelectJobUpload = useCallback((sourceKey: string, jobKey: string, file: File | null) => {
    setJobUploadFiles((current) => ({
      ...current,
      [`upload:${sourceKey}:${jobKey}`]: file,
    }));
  }, []);

  const handleUploadJobFile = useCallback(
    async (source: CmsSourceOverview, job: CmsSourceJob) => {
      const uploadKey = `upload:${source.key}:${job.key}`;
      const selectedFile = jobUploadFiles[uploadKey];
      if (!selectedFile) {
        setError('Επίλεξε XML αρχείο πριν τη μεταφόρτωση.');
        return;
      }
      setBusy(uploadKey, true);
      setNotice('');
      setError('');
      try {
        const response = await uploadSourceJobFile(source.key, job.key, selectedFile);
        await load();
        setJobUploadFiles((current) => ({
          ...current,
          [uploadKey]: null,
        }));
        setNotice(`${source.label}: το ${response.upload?.file_name || selectedFile.name} μεταφορτώθηκε.`);
      } catch (err) {
        setError(err instanceof Error ? err.message : `Αποτυχία μεταφόρτωσης XML για ${source.label}.`);
      } finally {
        setBusy(uploadKey, false);
      }
    },
    [jobUploadFiles, load, setBusy],
  );

  const handleRemoveSource = useCallback(
    async (source: CmsSourceOverview) => {
      const confirmed = window.confirm(
        `Να αφαιρεθεί η πηγή "${source.label}" από την ενεργή αλυσίδα;\n\nΤα υπάρχοντα προϊόντα θα παραμείνουν. Οι επόμενες ανανεώσεις θα γίνονται μόνο από τις υπόλοιπες ενεργές πηγές.`,
      );
      if (!confirmed) {
        return;
      }
      const busyKey = `remove:${source.key}`;
      setBusy(busyKey, true);
      setNotice('');
      setError('');
      try {
        await removeSource(source.key);
        await load();
        setNotice(`${source.label}: αφαιρέθηκε από την ενεργή αλυσίδα. Τα υπάρχοντα προϊόντα διατηρήθηκαν.`);
      } catch (err) {
        setError(err instanceof Error ? err.message : `Αποτυχία αφαίρεσης ${source.label}.`);
      } finally {
        setBusy(busyKey, false);
      }
    },
    [load, setBusy],
  );

  const handleRestoreSource = useCallback(
    async (source: CmsSourceOverview) => {
      const busyKey = `restore:${source.key}`;
      setBusy(busyKey, true);
      setNotice('');
      setError('');
      try {
        await restoreSource(source.key);
        await load();
        setNotice(`${source.label}: επαναφέρθηκε. Μπορείς να την ενεργοποιήσεις ξανά στην αλυσίδα πηγών.`);
      } catch (err) {
        setError(err instanceof Error ? err.message : `Αποτυχία επαναφοράς ${source.label}.`);
      } finally {
        setBusy(busyKey, false);
      }
    },
    [load, setBusy],
  );

  const handlePriorityChange = useCallback(
    (sourceKey: string, field: 'priority' | 'text_priority' | 'image_priority', value: string) => {
      const parsed = Number.parseInt(value, 10);
      const normalized = Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
      setPriorityDrafts((current) => ({
        ...current,
        [sourceKey]: {
          priority: current[sourceKey]?.priority ?? 0,
          text_priority: current[sourceKey]?.text_priority ?? 0,
          image_priority: current[sourceKey]?.image_priority ?? 0,
          [field]: normalized,
        },
      }));
    },
    [],
  );

  const handleSavePriorities = useCallback(
    async (source: CmsSourceOverview) => {
      const busyKey = `priority:${source.key}`;
      const draft = priorityDrafts[source.key];
      if (!draft) {
        return;
      }
      setBusy(busyKey, true);
      setNotice('');
      setError('');
      try {
        await updateSourceSettings(source.key, {
          priority: draft.priority,
          text_priority: draft.text_priority,
          image_priority: draft.image_priority,
        });
        await load();
        setNotice(`${source.label}: ενημερώθηκαν οι προτεραιότητες.`);
      } catch (err) {
        setError(err instanceof Error ? err.message : `Αποτυχία ενημέρωσης προτεραιοτήτων για ${source.label}.`);
      } finally {
        setBusy(busyKey, false);
      }
    },
    [load, priorityDrafts, setBusy],
  );

  const summaryMetrics = overview
    ? [
        { label: 'Παρακολουθούμενες Πηγές', value: overview.totals.tracked_sources.toLocaleString(), note: 'Πηγές που παρακολουθούνται στο CMS', tone: 'violet' as const },
        { label: 'Αφαιρεμένες Πηγές', value: (overview.totals.removed_sources_count?.toLocaleString() || '0'), note: 'Πηγές με ιστορικό αλλά εκτός chain', tone: 'amber' as const },
        { label: 'Γνωστά Προϊόντα Πηγών', value: overview.totals.products_in_db.toLocaleString(), note: 'Προϊόντα καταλόγου που αντιστοιχούν σε γνωστές πηγές', tone: 'emerald' as const },
        { label: 'Hosted Εικόνες', value: overview.totals.hosted_images_count.toLocaleString(), note: 'Εικόνες που έχουν αντιγραφεί στο hosting', tone: 'sky' as const },
        { label: 'Καθαρισμός υδατογραφήματος', value: overview.totals.watermark_cleaned_count.toLocaleString(), note: 'Legacy εικόνες που καθαρίστηκαν', tone: 'rose' as const },
      ]
    : [];

  return (
    <ModulePage
      title="Πηγές"
      description="Ορατότητα στην αλυσίδα πηγών, κάλυψη πεδίων, κατάσταση πρόσβασης και manual jobs."
    >
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {notice ? <Alert variant="success">{notice}</Alert> : null}
      {!error && overview ? (
        <Alert variant={overview.proxy_configured ? 'success' : 'warning'}>
          Proxy ρυθμισμένο: <strong>{overview.proxy_configured ? 'Ναι' : 'Όχι'}</strong>
          <span className="ms-3">Ενεργό chain: {overview.source_chain.join(' -&gt; ') || 'Κανένα'}</span>
        </Alert>
      ) : null}

      {loading ? (
    <Card className="cloudon-data-panel">
          <Card.Body className="py-5 d-flex justify-content-center">
            <Spinner animation="border" />
          </Card.Body>
        </Card>
      ) : null}

      {!loading && overview ? (
        <>
          <Row className="g-4 mb-4">
            {summaryMetrics.map((metric) => (
              <Col xl={3} md={6} key={metric.label}>
                <Card className={`cloudon-metric-card cloudon-metric-card--${metric.tone} h-100`}>
                  <Card.Body>
                    <div className="cloudon-metric-card__icon">{sourceMetricIcon({ tone: metric.tone })}</div>
                    <div className="cloudon-metric-card__label">{metric.label}</div>
                    <div className="cloudon-metric-card__value">{metric.value}</div>
                    <div className="cloudon-metric-card__note">{metric.note}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="mb-4 cloudon-data-panel">
            <Card.Header className="d-flex align-items-center justify-content-between">
              <Card.Title className="mb-0">Διαχειριζόμενες Πηγές</Card.Title>
              <Button variant="outline-primary" size="sm" onClick={() => void load()}>
                Ανανέωση
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="cloudon-source-grid">
                {overview.sources.map((source) => {
                  const tone = sourceTone(source);
                  const isExpanded = expandedSourceKey === source.key;
                  const runningJobs = source.jobs.filter((job) => job.running).length;
                  return (
                    <Card key={source.key} className={`cloudon-source-card cloudon-source-card--${tone}`}>
                      <Card.Body>
                        <div className="cloudon-source-card__hero">
                          <div className="cloudon-source-card__identity">
                            <span className="cloudon-source-card__eyebrow">Διαχειριζόμενη πηγή</span>
                            <div className="cloudon-source-card__title-row">
                              <h3 className="cloudon-source-card__title">{source.label}</h3>
                              {renderChainBadge(source)}
                              {statusBadge(source.access_status)}
                            </div>
                            <div className="text-muted fs-12 text-break">{source.base_url || '-'}</div>
                          </div>
                          <div className="cloudon-source-card__hero-side">
                            <div className="d-flex flex-column align-items-end gap-2">
                              {renderPurposeBadges(source)}
                              <Button
                                size="sm"
                                variant={isExpanded ? 'primary' : 'outline-primary'}
                                onClick={() => setExpandedSourceKey((current) => (current === source.key ? null : source.key))}
                              >
                                {isExpanded ? 'Απόκρυψη Ανάλυσης' : 'Επεξεργασία Πηγής'}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="cloudon-source-card__metric-row">
                          <div className="cloudon-source-stat-pill">
                            <span className="cloudon-source-stat-pill__label">Προϊόντα</span>
                            <strong>{source.products_in_db.toLocaleString()}</strong>
                          </div>
                          <div className="cloudon-source-stat-pill">
                            <span className="cloudon-source-stat-pill__label">Φιλοξενούμενες</span>
                            <strong>{source.hosted_images_count.toLocaleString()}</strong>
                          </div>
                          <div className="cloudon-source-stat-pill">
                            <span className="cloudon-source-stat-pill__label">Υδατογράφημα</span>
                            <strong>{source.watermark_cleaned_count.toLocaleString()}</strong>
                          </div>
                          <div className="cloudon-source-stat-pill">
                            <span className="cloudon-source-stat-pill__label">Πηγή εικόνας</span>
                            <strong>{source.field_coverage.source_image.toLocaleString()}</strong>
                          </div>
                        </div>
                        <div className="cloudon-source-card__summary">
                          <div className="cloudon-source-summary-pill">
                            <span className="cloudon-source-summary-pill__label">Αλυσίδα κειμένου</span>
                            <strong>{source.text_priority > 0 ? `#${source.text_priority}` : 'Κλειστό'}</strong>
                          </div>
                          <div className="cloudon-source-summary-pill">
                            <span className="cloudon-source-summary-pill__label">Αλυσίδα εικόνων</span>
                            <strong>{source.image_priority > 0 ? `#${source.image_priority}` : 'Κλειστό'}</strong>
                          </div>
                          <div className="cloudon-source-summary-pill">
                            <span className="cloudon-source-summary-pill__label">Εργασίες</span>
                            <strong>{source.jobs.length ? `${source.jobs.length} σύνολο` : 'Κανένα'}</strong>
                          </div>
                          <div className="cloudon-source-summary-pill">
                            <span className="cloudon-source-summary-pill__label">Δραστηριότητα</span>
                            <strong>{runningJobs ? `${runningJobs} σε εξέλιξη` : 'Ανενεργό'}</strong>
                          </div>
                        </div>

                        {isExpanded ? (
                          <div className="cloudon-source-card__grid">
                            <div className="cloudon-source-panel cloudon-source-panel--controls">
                              <div className="cloudon-source-panel__title">Έλεγχοι</div>
                              <div className="d-flex flex-column gap-2">
                                {source.runtime_control_enabled ? (
                                  <>
                                    <div className="cloudon-source-priority-box">
                                      <div className="fw-semibold fs-12 mb-2">Προτεραιότητες</div>
                                      <div className="cloudon-source-priority-grid">
                                        <div>
                                          <Form.Label className="fs-11 text-muted mb-1 d-block text-center">Αλυσίδα</Form.Label>
                                          <Form.Control
                                            type="number"
                                            min={0}
                                            size="sm"
                                            className="text-center"
                                            value={priorityDrafts[source.key]?.priority ?? source.priority}
                                            onChange={(event) => handlePriorityChange(source.key, 'priority', event.target.value)}
                                            disabled={source.removed || !canUpdateSources}
                                          />
                                        </div>
                                        <div>
                                          <Form.Label className="fs-11 text-muted mb-1 d-block text-center">Κείμενο</Form.Label>
                                          <Form.Control
                                            type="number"
                                            min={0}
                                            size="sm"
                                            className="text-center"
                                            value={priorityDrafts[source.key]?.text_priority ?? source.text_priority}
                                            onChange={(event) => handlePriorityChange(source.key, 'text_priority', event.target.value)}
                                            disabled={source.removed || !canUpdateSources}
                                          />
                                        </div>
                                        <div>
                                          <Form.Label className="fs-11 text-muted mb-1 d-block text-center">Εικόνες</Form.Label>
                                          <Form.Control
                                            type="number"
                                            min={0}
                                            size="sm"
                                            className="text-center"
                                            value={priorityDrafts[source.key]?.image_priority ?? source.image_priority}
                                            onChange={(event) => handlePriorityChange(source.key, 'image_priority', event.target.value)}
                                            disabled={source.removed || !canUpdateSources}
                                          />
                                        </div>
                                      </div>
                                      {canUpdateSources && !source.removed ? (
                                        <Button
                                          size="sm"
                                          variant="outline-primary"
                                          className="mt-2 w-100"
                                          disabled={busyActions[`priority:${source.key}`]}
                                          onClick={() => void handleSavePriorities(source)}
                                        >
                                          {busyActions[`priority:${source.key}`] ? 'Αποθήκευση...' : 'Αποθήκευση προτεραιοτήτων'}
                                        </Button>
                                      ) : null}
                                    </div>
                                    {source.removed ? (
                                      <>
                                        <div className="text-muted fs-12">
                                          Αφαιρέθηκε από τις λειτουργίες πηγών. Τα υπάρχοντα είδη παραμένουν στον κατάλογο.
                                        </div>
                                        {canUpdateSources ? (
                                          <Button
                                            size="sm"
                                            variant="outline-success"
                                            disabled={busyActions[`restore:${source.key}`]}
                                            onClick={() => void handleRestoreSource(source)}
                                          >
                                            {busyActions[`restore:${source.key}`] ? 'Επαναφορά...' : 'Επαναφορά'}
                                          </Button>
                                        ) : (
                                          <span className="text-muted fs-12">Χωρίς δικαιώματα ενημέρωσης</span>
                                        )}
                                      </>
                                    ) : canUpdateSources ? (
                                      <>
                                        <Button
                                          size="sm"
                                          variant={source.enabled_in_chain ? 'outline-danger' : 'outline-success'}
                                          disabled={busyActions[`toggle:${source.key}`]}
                                          onClick={() => void handleToggle(source)}
                                        >
                                          {busyActions[`toggle:${source.key}`] ? 'Αποθήκευση...' : source.enabled_in_chain ? 'Απενεργοποίηση' : 'Ενεργοποίηση'}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="danger"
                                          className="w-100"
                                          disabled={busyActions[`remove:${source.key}`]}
                                          onClick={() => void handleRemoveSource(source)}
                                        >
                                          {busyActions[`remove:${source.key}`] ? 'Αφαίρεση...' : 'Αφαίρεση πηγής'}
                                        </Button>
                                      </>
                                    ) : (
                                      <span className="text-muted fs-12">Χωρίς δικαιώματα ενημέρωσης</span>
                                    )}
                                  </>
                                ) : (
                                  <div className="cloudon-source-info-box text-muted fs-12">
                                    Πηγή μόνο για jobs. Δεν ανήκει στην ενεργή αλυσίδα και δεν έχει ελέγχους ενεργοποίησης/προτεραιότητας.
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="cloudon-source-panel cloudon-source-panel--jobs">
                              <div className="cloudon-source-panel__title">Εργασίες</div>
                              {source.removed ? (
                                <span className="text-muted fs-12">
                                  Τα jobs είναι απενεργοποιημένα όσο η πηγή έχει αφαιρεθεί. Οι υπόλοιπες πηγές θα χειριστούν τις ανανεώσεις.
                                </span>
                              ) : source.jobs.length ? (
                                <div className="d-flex flex-column gap-2">
                                  {source.jobs.map((job) => {
                                    const busyKey = `job:${source.key}:${job.key}`;
                                    return (
                                      <div key={job.key} className="cloudon-source-job-box">
                                        <div className="d-flex justify-content-between align-items-center gap-2 mb-1">
                                          <span className="fw-semibold fs-12">{job.label}</span>
                                          {jobBadge(job)}
                                        </div>
                                        <div className="text-muted fs-12 mb-2">{job.description}</div>
                                        {job.running && job.elapsed_human ? (
                                          <div className="text-muted fs-12 mb-2">Σε εξέλιξη για {job.elapsed_human}</div>
                                        ) : null}
                                        {!job.running && job.last_finished_at ? (
                                          <div className="text-muted fs-12 mb-1">
                                            Τελευταία ολοκλήρωση: {formatTimestamp(job.last_finished_at)}
                                            {typeof job.last_exit_code === 'number' ? ` · exit ${job.last_exit_code}` : ''}
                                          </div>
                                        ) : null}
                                        {job.last_message ? <div className="text-muted fs-12 mb-2">{job.last_message}</div> : null}
                                        {job.upload ? (
                                          <div className="cloudon-source-upload-box">
                                            <div className="fw-semibold fs-12 mb-2">{job.upload.label}</div>
                                            {job.upload.has_file ? (
                                              <div className="text-muted fs-12 mb-2">
                                                <div>{job.upload.file_name}</div>
                                                <div>
                                                  Μεταφορτώθηκε: {job.upload.uploaded_at ? formatTimestamp(job.upload.uploaded_at) : '-'}
                                                  {job.upload.size_bytes ? ` · ${formatFileSize(job.upload.size_bytes)}` : ''}
                                                </div>
                                                <div>
                                                  Προϊόντα: {job.upload.product_count.toLocaleString()} · Με εικόνα: {job.upload.image_rows.toLocaleString()}
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="text-muted fs-12 mb-2">Δεν έχει ανέβει XML.</div>
                                            )}
                                            {canRunJobs ? (
                                              <>
                                                <Form.Control
                                                  type="file"
                                                  size="sm"
                                                  accept={job.upload.accept || '.xml'}
                                                  className="mb-2"
                                                  disabled={job.running || busyActions[`upload:${source.key}:${job.key}`]}
                                                  onChange={(event) =>
                                                    handleSelectJobUpload(
                                                      source.key,
                                                      job.key,
                                                      (event.currentTarget as HTMLInputElement).files?.[0] ?? null,
                                                    )
                                                  }
                                                />
                                                <Button
                                                  size="sm"
                                                  variant="outline-primary"
                                                  className="w-100"
                                                  disabled={
                                                    job.running ||
                                                    busyActions[`upload:${source.key}:${job.key}`] ||
                                                    !jobUploadFiles[`upload:${source.key}:${job.key}`]
                                                  }
                                                  onClick={() => void handleUploadJobFile(source, job)}
                                                >
                                                  {busyActions[`upload:${source.key}:${job.key}`] ? 'Μεταφόρτωση...' : 'Μεταφόρτωση XML'}
                                                </Button>
                                              </>
                                            ) : (
                                              <span className="text-muted fs-12">Χωρίς δικαίωμα εκτέλεσης</span>
                                            )}
                                          </div>
                                        ) : null}
                                        {canRunJobs ? (
                                          <Button
                                            size="sm"
                                            variant="outline-primary"
                                            disabled={busyActions[busyKey] || job.running || Boolean(job.upload?.required && !job.upload.has_file)}
                                            onClick={() => void handleRunJob(source, job)}
                                          >
                                            {busyActions[busyKey] ? 'Εκκίνηση...' : job.running ? 'Σε εξέλιξη' : 'Έναρξη'}
                                          </Button>
                                        ) : (
                                          <span className="text-muted fs-12">Χωρίς δικαίωμα εκτέλεσης</span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <span className="text-muted fs-12">Δεν υπάρχουν server-side jobs.</span>
                              )}
                            </div>

                            <div className="cloudon-source-panel cloudon-source-panel--stats">
                              <div className="cloudon-source-panel__title">Στατιστικά εικόνων</div>
                              {renderImageStats(source)}
                            </div>

                            <div className="cloudon-source-panel cloudon-source-panel--coverage">
                              <div className="cloudon-source-panel__title">Κάλυψη πεδίων</div>
                              {renderFieldCoverage(source)}
                            </div>

                            <div className="cloudon-source-panel cloudon-source-panel--details cloudon-source-panel--wide">
                              <div className="cloudon-source-panel__title">Λεπτομέρειες</div>
                              {renderSourceDetails(source)}
                            </div>
                          </div>
                        ) : null}
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-4 cloudon-data-panel">
            <Card.Body className="d-flex flex-column gap-2">
              <div className="fw-semibold">Μοντέλο προτεραιότητας πηγών</div>
              <div className="text-muted fs-12">
                Κείμενο και εικόνες επιλύονται από ξεχωριστές αλυσίδες. Έτσι αποφεύγουμε “βρώμικες” πηγές φωτογραφιών που θα κέρδιζαν λόγω γενικής προτεραιότητας.
              </div>
              <div className="fs-12">
                <span className="fw-semibold">Αλυσίδα κειμένου:</span> {overview.text_source_chain.join(' -> ') || '-'}
              </div>
              <div className="fs-12">
                <span className="fw-semibold">Αλυσίδα εικόνων:</span> {overview.image_source_chain.join(' -> ') || '-'}
              </div>
            </Card.Body>
          </Card>

          {renderDetectedSources(
            overview.other_detected_sources,
            overview.sources,
            canRunJobs,
            busyActions,
            jobUploadFiles,
            handleSelectJobUpload,
            async (source, job) => handleUploadJobFile(source, job),
            async (source, job) => handleRunJob(source, job),
          )}
        </>
      ) : null}
    </ModulePage>
  );
}
