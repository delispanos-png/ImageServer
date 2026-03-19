import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import ModulePage from '../ModulePage';
import { useAdminLanguage } from '../../../app/i18n/AdminLanguageProvider';
import {
  approveItemGoLive,
  createItem,
  deleteItem,
  deleteItemImage,
  fetchBulkRefreshStatus,
  fetchCategories,
  fetchItem,
  fetchItemChanges,
  fetchItemTaxonomyFilters,
  fetchItems,
  importItemImageFromUrl,
  cancelBulkRefresh,
  refreshItemFromSources,
  restartBulkRefresh,
  stopBulkRefresh,
  startBulkRefresh,
  uploadItemImagesManual,
  updateItem,
} from '../../../services/cms-catalog';
import type {
  CmsBulkRefreshStartResult,
  CmsCategory,
  CmsItem,
  CmsItemChange,
  CmsItemPayload,
  CmsItemSourceRefreshResult,
  CmsItemTaxonomyFilters,
  CmsSourceJob,
} from '../../../types';

interface ItemFormState {
  title: string;
  code: string;
  sku: string;
  barcode: string;
  category_1_id: string;
  category_2_id: string;
  category_3_id: string;
  brand: string;
  unit: string;
  status: 'active' | 'inactive';
  description_html: string;
  main_image: string;
}

interface ItemsPageProps {
  moduleTitle?: string;
  moduleDescription?: string;
  initialQualityStateFilter?: 'all' | 'ready' | 'needs_fix' | 'ready_for_review';
  lockQualityStateFilter?: boolean;
  showBulkRefreshPanel?: boolean;
}

interface SourceSelectionState {
  sourceKey: string;
  textSourceKey: string;
  imageSourceKey: string;
  categorySourceKey: string;
}

type SourceSelectionFieldKey = keyof SourceSelectionState;

const initialFormState: ItemFormState = {
  title: '',
  code: '',
  sku: '',
  barcode: '',
  category_1_id: '',
  category_2_id: '',
  category_3_id: '',
  brand: '',
  unit: '',
  status: 'active',
  description_html: '',
  main_image: '',
};

const HOSTED_IMAGE_BASE = 'https://image.cloudon.gr/photos/';

const QUALITY_STATE_LABELS: Record<'en' | 'el', Record<string, string>> = {
  en: {
    ready: 'Ready',
    needs_fix: 'Needs Fix',
    ready_for_review: 'Ready for Review',
  },
  el: {
    ready: 'Έτοιμο',
    needs_fix: 'Χρειάζεται Διόρθωση',
    ready_for_review: 'Έτοιμο για Έλεγχο',
  },
};

const MISSING_REQUIREMENT_LABELS: Record<'en' | 'el', Record<string, string>> = {
  en: {
    missing_any_image: 'Missing public image',
    missing_text: 'Missing text',
    missing_category: 'Missing category',
  },
  el: {
    missing_any_image: 'Χωρίς δημόσια εικόνα',
    missing_text: 'Λείπει κείμενο',
    missing_category: 'Λείπει κατηγορία',
  },
};

const SOURCE_FIELD_OPTIONS = [
  { value: '', label: 'Αυτόματο chain' },
  { value: 'tofarmakeiomou', label: 'ToFarmakeioMou' },
  { value: 'farmakopoiosmou', label: 'Ofarmakopoiosmou' },
  { value: 'pharmacy295', label: 'Pharmacy295' },
  { value: 'youpharmacy', label: 'YouPharmacy' },
  { value: 'gohealthy', label: 'GoHealthy' },
  { value: 'cure4u', label: 'Cure4u' },
  { value: 'kpdhellas', label: 'KpdHellas' },
  { value: 'vita4you', label: 'Vita4You' },
] as const;

const initialSourceSelectionState: SourceSelectionState = {
  sourceKey: '',
  textSourceKey: '',
  imageSourceKey: '',
  categorySourceKey: '',
};

const isGoogleSearchUrl = (value: string): boolean => {
  const normalized = value.trim();
  if (!normalized) return false;
  try {
    const parsed = new URL(normalized);
    return parsed.hostname.includes('google.') && (parsed.pathname.startsWith('/search') || parsed.search.includes('tbm=isch'));
  } catch {
    return false;
  }
};

const SOURCE_SELECTION_FIELDS: Array<{
  key: SourceSelectionFieldKey;
  label: string;
  helper: string;
}> = [
  {
    key: 'sourceKey',
    label: 'Κοινή Πηγή',
    helper: 'Μία πηγή για όλα τα πεδία, εκτός αν ορίσεις ξεχωριστά πιο κάτω.',
  },
  {
    key: 'textSourceKey',
    label: 'Πηγή Κειμένου',
    helper: 'Τίτλος, brand, μονάδα και περιγραφή.',
  },
  {
    key: 'imageSourceKey',
    label: 'Πηγή Εικόνων',
    helper: 'Κύρια εικόνα και gallery.',
  },
  {
    key: 'categorySourceKey',
    label: 'Πηγή Κατηγοριών',
    helper: 'Διαδρομή κατηγορίας όταν δεν βρίσκει match το barcode mapping.',
  },
];

const ITEM_DETAILS_MODAL_CSS = `
.cms-item-form-modal {
  max-width: min(1320px, 94vw);
}
.cms-item-details-modal {
  max-width: min(1480px, 96vw);
}
.cms-item-details-modal .modal-content,
.cms-item-form-modal .modal-content {
  border: 0;
  border-radius: 18px;
  overflow: hidden;
}
.cms-item-form-modal .modal-body {
  background: #f7f9fc;
}
.cms-item-details-shell {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.cms-item-details-hero {
  display: grid;
  grid-template-columns: minmax(360px, 460px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}
.cms-item-details-media-panel,
.cms-item-details-summary-panel,
.cms-item-details-section {
  border: 1px solid #e8ebf3;
  border-radius: 16px;
  background: #fff;
}
.cms-item-details-media-panel {
  padding: 18px;
  position: sticky;
  top: 0;
}
.cms-item-details-main-image {
  width: 100%;
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  border: 1px solid #edf0f6;
  border-radius: 14px;
  background: linear-gradient(180deg, #f9fbff 0%, #f1f5fb 100%);
}
.cms-item-details-main-image img {
  max-width: 100%;
  max-height: 320px;
  object-fit: contain;
}
.cms-item-thumb-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}
.cms-item-thumb {
  width: 72px;
  height: 72px;
  border: 1px solid #dfe4ee;
  border-radius: 12px;
  background: #fff;
  padding: 6px;
}
.cms-item-thumb.is-active {
  border-color: #6259ca;
  box-shadow: 0 0 0 3px rgba(98, 89, 202, 0.14);
}
.cms-item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.cms-item-details-summary-panel {
  padding: 24px;
}
.cms-item-details-kicker {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7b8191;
  margin-bottom: 12px;
}
.cms-item-details-title {
  font-size: 1.75rem;
  line-height: 1.25;
  font-weight: 600;
  color: #1f2940;
  margin: 0;
}
.cms-item-details-submeta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}
.cms-item-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 999px;
  background: #f5f7fb;
  color: #4b5675;
  font-size: 0.82rem;
}
.cms-item-category-path {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.cms-item-category-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: #eef2ff;
  color: #394a72;
  font-size: 0.82rem;
  font-weight: 500;
}
.cms-item-category-arrow {
  color: #98a2b8;
  font-size: 0.9rem;
  align-self: center;
}
.cms-item-details-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px 16px;
  margin-top: 22px;
}
.cms-item-stat {
  padding: 14px 16px;
  border: 1px solid #eef1f7;
  border-radius: 14px;
  background: #fbfcff;
}
.cms-item-stat-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8a93a9;
  margin-bottom: 8px;
}
.cms-item-stat-value {
  font-size: 0.98rem;
  line-height: 1.55;
  color: #26314d;
  word-break: break-word;
}
.cms-item-details-section {
  padding: 22px 24px;
}
.cms-item-details-section-title {
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #616b86;
  margin-bottom: 16px;
}
.cms-item-description-body {
  line-height: 1.8;
  color: #33415c;
  font-size: 0.98rem;
}
.cms-item-description-body p:last-child,
.cms-item-html-preview p:last-child {
  margin-bottom: 0;
}
.cms-item-description-body h2,
.cms-item-description-body h3,
.cms-item-description-body h4,
.cms-item-html-preview h2,
.cms-item-html-preview h3,
.cms-item-html-preview h4 {
  margin: 0 0 10px;
  color: #1f2940;
  font-weight: 600;
}
.cms-item-description-body ul,
.cms-item-description-body ol,
.cms-item-html-preview ul,
.cms-item-html-preview ol {
  padding-left: 20px;
}
.cms-item-description-body a,
.cms-item-html-preview a {
  color: #6259ca;
  text-decoration: underline;
}
.cms-item-metadata-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 18px;
}
.cms-item-meta-row strong {
  display: block;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8a93a9;
  margin-bottom: 6px;
}
.cms-item-meta-row div {
  color: #2f3a56;
  word-break: break-word;
}
.cms-item-form-panel {
  border: 1px solid #e6ebf3;
  border-radius: 16px;
  background: #fff;
  padding: 18px;
  height: 100%;
}
.cms-item-edit-shell {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.cms-item-form-label {
  display: block;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8a93a9;
  margin-bottom: 6px;
}
.cms-item-form-control,
.cms-item-form-select {
  border-radius: 12px;
  min-height: 44px;
}
.cms-item-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
  margin-top: 22px;
}
.cms-item-edit-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px 16px;
}
.cms-item-edit-meta-card {
  padding: 16px 18px;
  border: 1px solid #eef1f7;
  border-radius: 14px;
  background: #fbfcff;
}
.cms-item-edit-meta-card strong {
  display: block;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8a93a9;
  margin-bottom: 8px;
}
.cms-item-edit-meta-card div {
  color: #2f3a56;
  word-break: break-word;
}
.cms-item-form-section-title {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6e7891;
  margin-bottom: 14px;
}
.cms-item-html-preview {
  min-height: 320px;
  border: 1px solid #e8ebf3;
  border-radius: 14px;
  background: #fbfcff;
  padding: 18px;
  color: #33415c;
  line-height: 1.8;
}
.cms-item-html-editor {
  min-height: 320px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.9rem;
}
.cms-item-muted-note {
  font-size: 0.8rem;
  color: #7d869e;
}
.cms-item-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.cms-item-toolbar .btn {
  --bs-btn-padding-y: 0.32rem;
  --bs-btn-padding-x: 0.7rem;
  --bs-btn-font-size: 0.78rem;
}
.cms-refresh-panel {
  border: 1px solid rgba(116, 128, 173, 0.18);
  border-radius: 20px;
  background:
    radial-gradient(circle at top left, rgba(104, 95, 255, 0.08), transparent 38%),
    radial-gradient(circle at top right, rgba(34, 197, 94, 0.08), transparent 30%),
    linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
  box-shadow: 0 18px 40px rgba(37, 53, 88, 0.08);
}
.cms-refresh-panel__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.cms-refresh-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.cms-refresh-panel__title {
  font-size: 1rem;
  font-weight: 700;
  color: #27314d;
  margin: 0;
}
.cms-refresh-panel__note {
  font-size: 0.86rem;
  color: #6a7694;
  margin: 6px 0 0;
  max-width: 780px;
}
.cms-refresh-source-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.cms-refresh-source-card {
  padding: 14px 14px 12px;
  border: 1px solid rgba(132, 146, 194, 0.18);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.cms-refresh-source-card__label {
  display: block;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #697593;
  margin-bottom: 6px;
}
.cms-refresh-source-card__helper {
  font-size: 0.76rem;
  color: #8b94ac;
  margin-top: 6px;
  min-height: 34px;
}
.cms-refresh-panel__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}
.cms-refresh-panel__meta-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.cms-refresh-panel__stat {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(242, 245, 255, 0.9);
  border: 1px solid rgba(145, 156, 198, 0.18);
  color: #4b5678;
  font-size: 0.82rem;
}
.cms-refresh-panel__stat strong {
  color: #222f50;
}
.cms-refresh-panel__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.cms-refresh-panel__limit {
  width: 132px;
}
.cms-refresh-panel__job {
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(100, 116, 164, 0.16);
  background: rgba(250, 251, 255, 0.9);
}
.cms-refresh-panel__job-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}
.cms-refresh-panel__job-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}
.cms-refresh-panel__job-title {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7694;
  font-weight: 700;
}
.cms-refresh-panel__job-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 0.8rem;
  color: #7f89a3;
}
.cms-refresh-panel__job-message {
  color: #33415c;
  font-size: 0.88rem;
  line-height: 1.55;
}
@media (max-width: 1199px) {
  .cms-item-details-hero {
    grid-template-columns: 1fr;
  }
  .cms-item-details-media-panel {
    position: static;
  }
  .cms-refresh-source-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 767px) {
  .cms-item-details-grid,
  .cms-item-metadata-list,
  .cms-item-form-grid,
  .cms-item-edit-meta-grid {
    grid-template-columns: 1fr;
  }
  .cms-item-details-title {
    font-size: 1.35rem;
  }
  .cms-refresh-source-grid {
    grid-template-columns: 1fr;
  }
}
`;

function formatDate(value: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function statusBadge(status: 'active' | 'inactive' | string, language: 'en' | 'el' = 'el') {
  const label = status === 'active'
    ? (language === 'el' ? 'Ενεργό' : 'Active')
    : status === 'inactive'
      ? (language === 'el' ? 'Ανενεργό' : 'Inactive')
      : status;
  return <Badge bg={status === 'inactive' ? 'secondary' : 'success'}>{label}</Badge>;
}

function qualityStateBadge(state?: string | null, language: 'en' | 'el' = 'el') {
  const normalized = String(state || '').trim() || 'ready';
  const label = QUALITY_STATE_LABELS[language][normalized] || normalized;
  const bg = normalized === 'needs_fix' ? 'danger' : normalized === 'ready_for_review' ? 'warning' : 'success';
  return <Badge bg={bg}>{label}</Badge>;
}

function photoSourceLockBadge(item?: CmsItem | null) {
  const lock = String(item?.photo_source_lock || '').trim();
  if (!lock) {
    return null;
  }
  if (lock === 'youpharmacy_xml') {
    return <Badge bg="info">Φωτογραφία YouPharmacy</Badge>;
  }
  if (lock === 'pharmacy295_excel') {
    return <Badge bg="primary">Φωτογραφία Pharmacy295</Badge>;
  }
  if (lock === 'manual_upload') {
    return <Badge bg="dark">Χειροκίνητη φωτογραφία</Badge>;
  }
  return <Badge bg="light" text="dark">{lock}</Badge>;
}

function photoSourceLockLabel(item?: CmsItem | null) {
  const lock = String(item?.photo_source_lock || '').trim();
  if (lock === 'youpharmacy_xml') {
    return 'Κλείδωμα αντικατάστασης από YouPharmacy XML';
  }
  if (lock === 'pharmacy295_excel') {
    return 'Κλείδωμα φωτογραφίας από Pharmacy295 Excel';
  }
  if (lock === 'manual_upload') {
    return 'Χειροκίνητη μεταφόρτωση hosted φωτογραφίας';
  }
  if (lock) {
    return lock;
  }
  const imageSourceDomain = String(item?.image_source_domain || '').trim();
  return imageSourceDomain || '-';
}

function sourceBadge(name?: string | null, fallbackLabel?: string) {
  const normalized = String(name || '').trim().toLowerCase();
  if (!normalized) return null;
  if (normalized === 'youpharmacy' || normalized === 'youpharmacy_xml') {
    return <Badge bg="info">{fallbackLabel || 'YouPharmacy'}</Badge>;
  }
  if (normalized === 'pharmacy295' || normalized === 'pharmacy295_excel') {
    return <Badge bg="primary">{fallbackLabel || 'Pharmacy295'}</Badge>;
  }
  if (normalized === 'farmakopoiosmou') {
    return <Badge bg="secondary">{fallbackLabel || 'Ofarmakopoiosmou'}</Badge>;
  }
  if (normalized === 'tofarmakeiomou') {
    return <Badge bg="warning" text="dark">{fallbackLabel || 'ToFarmakeioMou'}</Badge>;
  }
  if (normalized === 'kpdhellas') {
    return <Badge bg="dark">{fallbackLabel || 'KpdHellas'}</Badge>;
  }
  if (normalized === 'gohealthy') {
    return <Badge bg="success">{fallbackLabel || 'GoHealthy'}</Badge>;
  }
  if (normalized === 'cure4u') {
    return <Badge bg="success">{fallbackLabel || 'Cure4u'}</Badge>;
  }
  if (normalized === 'vita4you') {
    return <Badge bg="danger">{fallbackLabel || 'Vita4You'}</Badge>;
  }
  if (normalized === 'manual_upload') {
    return <Badge bg="dark">{fallbackLabel || 'Χειροκίνητο'}</Badge>;
  }
  if (normalized === 'existing') {
    return <Badge bg="secondary">{fallbackLabel || 'Υπάρχον'}</Badge>;
  }
  return <Badge bg="light" text="dark">{fallbackLabel || name}</Badge>;
}

function textProvenanceBadge(item?: CmsItem | null) {
  const textSourceDomain = String(item?.text_source_domain || '').trim();
  if (textSourceDomain) {
    return sourceBadge(textSourceDomain);
  }
  if (item?.catalog_has_text) {
    return <Badge bg="secondary">Υπάρχον</Badge>;
  }
  return null;
}

function textProvenanceLabel(item?: CmsItem | null) {
  const textSourceDomain = String(item?.text_source_domain || '').trim();
  if (textSourceDomain) {
    return textSourceDomain;
  }
  return item?.catalog_has_text ? 'Τρέχον αποθηκευμένο κείμενο CMS/πηγής' : '-';
}

function categoryProvenanceBadge(item?: CmsItem | null) {
  const resolution = String(item?.category_resolution_source || '').trim();
  if (resolution === 'barcode_lookup') {
    return <Badge bg="success">Αντιστοίχιση barcode</Badge>;
  }
  if (resolution === 'existing') {
    return <Badge bg="secondary">Υπάρχουσα κατηγορία</Badge>;
  }
  const categorySourceDomain = String(item?.category_source_domain || '').trim();
  if (categorySourceDomain) {
    return sourceBadge(categorySourceDomain);
  }
  return item?.catalog_has_category ? <Badge bg="secondary">Υπάρχον</Badge> : null;
}

function categoryProvenanceLabel(item?: CmsItem | null) {
  const resolution = String(item?.category_resolution_source || '').trim();
  if (resolution === 'barcode_lookup') {
    return 'Κατηγορία από barcode mapping';
  }
  if (resolution === 'existing') {
    return 'Διατηρήθηκε η υπάρχουσα διαδρομή κατηγορίας';
  }
  const categorySourceDomain = String(item?.category_source_domain || '').trim();
  if (categorySourceDomain) {
    return categorySourceDomain;
  }
  return item?.catalog_has_category ? 'Τρέχουσα αποθηκευμένη διαδρομή κατηγορίας' : '-';
}

function canApproveGoLive(item?: CmsItem | null) {
  if (!item) return false;
  return item.catalog_quality_state === 'ready_for_review' && item.status !== 'active' && !(item.catalog_missing_requirements || []).length;
}

function detailValue(value?: string | null) {
  return value && value.trim() ? value : '-';
}

function missingRequirementLabel(code: string, language: 'en' | 'el' = 'el') {
  return MISSING_REQUIREMENT_LABELS[language][code] || code;
}

function buildDraftQuality(formState: ItemFormState) {
  const hasTitle = Boolean(formState.title.trim());
  const descriptionText = htmlToPlainText(formState.description_html);
  const hasDescription = Boolean(descriptionText.trim());
  const hasText = hasTitle && hasDescription;
  const hasCategory = Boolean(deepestSelectedCategoryId(formState));
  const imageValue = formState.main_image.trim();
  const hasAnyImage = Boolean(imageValue);
  const publicImageEnabled = imageValue.startsWith(HOSTED_IMAGE_BASE);
  const missingRequirements: string[] = [];

  if (!hasAnyImage) missingRequirements.push('missing_any_image');
  if (!hasText) missingRequirements.push('missing_text');
  if (!hasCategory) missingRequirements.push('missing_category');

  return {
    hasText,
    hasCategory,
    hasAnyImage,
    publicImageEnabled,
    imageVisibility: publicImageEnabled ? 'hosted' : hasAnyImage ? 'disabled_external' : 'missing',
    qualityState: missingRequirements.length ? 'needs_fix' : formState.status === 'inactive' ? 'ready_for_review' : 'ready',
    missingRequirements,
  };
}

function buildImageList(item: CmsItem | null) {
  if (!item) return [];
  const candidates = [item.main_image, ...(item.image_urls || [])]
    .map((value) => String(value || '').trim())
    .filter(Boolean);
  return [...new Set(candidates)];
}

function appendPreviewToken(url: string, previewToken: string) {
  const normalized = String(url || '').trim();
  if (!normalized || !previewToken) return normalized;
  try {
    const parsed = new URL(normalized);
    parsed.searchParams.set('_preview', previewToken);
    return parsed.toString();
  } catch {
    const separator = normalized.includes('?') ? '&' : '?';
    return `${normalized}${separator}_preview=${encodeURIComponent(previewToken)}`;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function decodeHtmlEntities(value: string) {
  if (!value) return '';
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(`<!doctype html><body>${value}`, 'text/html');
    return doc.body.textContent || '';
  }
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function plainTextToHtml(value: string) {
  const text = value.trim();
  if (!text) return '';
  const headingKeywords = new Set([
    'περιγραφή',
    'οφέλη',
    'χρήση',
    'χαρακτηριστικά',
    'σύνθεση',
    'συστατικά',
    'δοσολογία',
    'προειδοποιήσεις',
    'προφυλάξεις',
    'τρόπος χρήσης',
    'οδηγίες χρήσης',
    'benefits',
    'usage',
    'directions',
    'description',
    'ingredients',
  ]);
  const blocks = text.replace(/\r\n/g, '\n').split(/\n\s*\n/).map((segment) => segment.trim()).filter(Boolean);
  const htmlParts: string[] = [];

  const flushParagraph = (lines: string[]) => {
    if (!lines.length) return;
    const paragraph = lines.map((line) => line.trim()).filter(Boolean).join(' ');
    if (paragraph) {
      htmlParts.push(`<p>${escapeHtml(paragraph)}</p>`);
    }
  };

  const flushList = (lines: string[]) => {
    if (!lines.length) return;
    const items = lines
      .map((line) => line.replace(/^\s*[-*•]+\s*/, '').trim())
      .filter(Boolean)
      .map((line) => `<li>${escapeHtml(line)}</li>`)
      .join('');
    if (items) {
      htmlParts.push(`<ul>${items}</ul>`);
    }
  };

  const looksLikeHeading = (line: string) => {
    const cleaned = line.replace(/[:：]\s*$/, '').trim();
    if (!cleaned) return false;
    const lower = cleaned.toLowerCase();
    if (headingKeywords.has(lower)) return true;
    if (cleaned.length <= 48 && /[:：]\s*$/.test(line)) return true;
    if (cleaned.length <= 42 && /^[A-Za-zΑ-Ωα-ω0-9\s/&+-]+$/.test(cleaned)) {
      const letters = [...cleaned].filter((char) => /[A-Za-zΑ-Ωα-ω]/.test(char));
      if (letters.length) {
        const uppercaseRatio = letters.filter((char) => char === char.toUpperCase()).length / letters.length;
        if (uppercaseRatio >= 0.7) return true;
      }
    }
    return false;
  };

  blocks.forEach((block) => {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
    let paragraphBuffer: string[] = [];
    let listBuffer: string[] = [];

    lines.forEach((line) => {
      const isBullet = /^\s*[-*•]+\s+/.test(line);
      if (isBullet) {
        flushParagraph(paragraphBuffer);
        paragraphBuffer = [];
        listBuffer.push(line);
        return;
      }

      if (listBuffer.length) {
        flushList(listBuffer);
        listBuffer = [];
      }

      if (looksLikeHeading(line)) {
        flushParagraph(paragraphBuffer);
        paragraphBuffer = [];
        htmlParts.push(`<h3>${escapeHtml(line.replace(/[:：]\s*$/, '').trim())}</h3>`);
        return;
      }

      paragraphBuffer.push(line);
    });

    flushList(listBuffer);
    flushParagraph(paragraphBuffer);
  });

  return htmlParts.join('\n');
}

function htmlToPlainText(value: string) {
  const source = value.trim();
  if (!source) return '';
  const normalized = source
    .replace(/\r\n/g, '\n')
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\s*\/p\s*>/gi, '\n\n')
    .replace(/<\s*\/div\s*>/gi, '\n\n')
    .replace(/<\s*\/section\s*>/gi, '\n\n')
    .replace(/<\s*\/article\s*>/gi, '\n\n')
    .replace(/<\s*\/h[1-6]\s*>/gi, '\n\n')
    .replace(/<\s*li\b[^>]*>/gi, '\n- ')
    .replace(/<\s*\/li\s*>/gi, '')
    .replace(/<\s*\/ul\s*>/gi, '\n')
    .replace(/<\s*\/ol\s*>/gi, '\n');

  const plain = decodeHtmlEntities(normalized.replace(/<[^>]+>/g, ' '));
  return plain
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function itemDescriptionHtml(item: CmsItem | null) {
  if (!item) return '';
  return (item.description_html || '').trim() || plainTextToHtml(item.description || '');
}

function itemCategoryPath(item: CmsItem | null, categoryNameById: Map<string, string>) {
  if (!item) return [];
  const path = (item.category_path || []).map((value) => String(value || '').trim()).filter(Boolean);
  if (path.length) return path;
  const fallback = item.category_name || categoryNameById.get(item.category_id) || '';
  return fallback ? fallback.split('/').map((part) => part.trim()).filter(Boolean) : [];
}

function itemCategoryLevels(item: CmsItem | null, categoryNameById: Map<string, string>) {
  const path = itemCategoryPath(item, categoryNameById);
  return [
    { label: 'Κατηγορία 1', value: (item?.category_1 || '').trim() || path[0] || '' },
    { label: 'Κατηγορία 2', value: (item?.category_2 || '').trim() || path[1] || '' },
    { label: 'Κατηγορία 3', value: (item?.category_3 || '').trim() || path[2] || '' },
  ];
}

function buildCategoryById(categories: CmsCategory[]) {
  return new Map(categories.map((category) => [category.id, category]));
}

function resolveCategoryDocsPath(categoryId: string, categoryById: Map<string, CmsCategory>) {
  const path: CmsCategory[] = [];
  let current = categoryId ? categoryById.get(categoryId) : undefined;
  const visited = new Set<string>();
  while (current && !visited.has(current.id)) {
    path.unshift(current);
    visited.add(current.id);
    current = current.parent_id ? categoryById.get(current.parent_id) : undefined;
  }
  return path;
}

function deriveCategorySelection(categoryId: string, categoryById: Map<string, CmsCategory>) {
  const path = resolveCategoryDocsPath(categoryId, categoryById);
  return {
    category_1_id: path[0]?.id || '',
    category_2_id: path[1]?.id || '',
    category_3_id: path[2]?.id || '',
  };
}

function deepestSelectedCategoryId(formState: ItemFormState) {
  return formState.category_3_id || formState.category_2_id || formState.category_1_id || '';
}

function selectedCategoryPath(formState: ItemFormState, categoryById: Map<string, CmsCategory>) {
  return resolveCategoryDocsPath(deepestSelectedCategoryId(formState), categoryById).map((category) => category.name);
}

function descriptionTemplate() {
  return [
    '<h3>Περιγραφή</h3>',
    '<p></p>',
    '<h3>Οφέλη</h3>',
    '<ul>',
    '  <li></li>',
    '  <li></li>',
    '</ul>',
    '<h3>Χρήση</h3>',
    '<p></p>',
  ].join('\n');
}

function zoomClamp(value: number) {
  return Math.min(4, Math.max(1, Number(value.toFixed(2))));
}

function toPayload(state: ItemFormState): CmsItemPayload {
  const descriptionHtml = state.description_html.trim();
  return {
    title: state.title.trim(),
    code: state.code.trim(),
    sku: state.sku.trim(),
    barcode: state.barcode.trim(),
    category_id: deepestSelectedCategoryId(state) || null,
    brand: state.brand.trim(),
    unit: state.unit.trim(),
    status: state.status,
    description: htmlToPlainText(descriptionHtml),
    description_html: descriptionHtml,
    main_image: state.main_image.trim(),
  };
}

function toFormStateFromItem(item: CmsItem, categoryById: Map<string, CmsCategory>): ItemFormState {
  const selection = deriveCategorySelection(item.category_id || '', categoryById);
  return {
    title: item.title,
    code: item.code,
    sku: item.sku,
    barcode: item.barcode,
    category_1_id: selection.category_1_id,
    category_2_id: selection.category_2_id,
    category_3_id: selection.category_3_id,
    brand: item.brand,
    unit: item.unit,
    status: item.status,
    description_html: item.description_html || plainTextToHtml(item.description || ''),
    main_image: item.main_image,
  };
}

export default function ItemsPage({
  moduleTitle,
  moduleDescription,
  initialQualityStateFilter = 'all',
  lockQualityStateFilter = false,
  showBulkRefreshPanel = false,
}: ItemsPageProps) {
  const { language } = useAdminLanguage();
  const isGreek = language === 'el';
  const tx = (en: string, el: string) => (isGreek ? el : en);
  const resolvedModuleTitle = moduleTitle || tx('Items', 'Είδη');
  const resolvedModuleDescription =
    moduleDescription || tx('Searchable product catalog with filtering, status control, detail view, and change history.', 'Αναζήτηση και φιλτράρισμα ειδών με έλεγχο κατάστασης και ιστορικό αλλαγών.');
  const [searchParams, setSearchParams] = useSearchParams();
  const autoOpenedDetails = useRef(false);
  const [items, setItems] = useState<CmsItem[]>([]);
  const [categories, setCategories] = useState<CmsCategory[]>([]);
  const [taxonomyFilters, setTaxonomyFilters] = useState<CmsItemTaxonomyFilters>({
    category_1: [],
    category_2: [],
    category_3: [],
  });
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [pageSuccess, setPageSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [qualityStateFilter, setQualityStateFilter] = useState<'all' | 'ready' | 'needs_fix' | 'ready_for_review'>(initialQualityStateFilter);
  const [missingRequirementFilter, setMissingRequirementFilter] = useState<'all' | 'missing_any_image' | 'missing_text' | 'missing_category'>('all');
  const [photoSourceFilter, setPhotoSourceFilter] = useState<'all' | 'youpharmacy_xml' | 'pharmacy295_excel'>('all');
  const [category1Filter, setCategory1Filter] = useState('');
  const [category2Filter, setCategory2Filter] = useState('');
  const [category3Filter, setCategory3Filter] = useState('');
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [pagination, setPagination] = useState({ total: 0, page: 1, per_page: 15, total_pages: 1 });
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshingFromSource, setRefreshingFromSource] = useState(false);
  const [bulkRefreshing, setBulkRefreshing] = useState(false);
  const [deletingImageUrl, setDeletingImageUrl] = useState('');
  const [manualRefreshSources, setManualRefreshSources] = useState<SourceSelectionState>(initialSourceSelectionState);
  const [bulkRefreshSources, setBulkRefreshSources] = useState<SourceSelectionState>(initialSourceSelectionState);
  const [bulkRefreshLimit, setBulkRefreshLimit] = useState(250);
  const [bulkRefreshJob, setBulkRefreshJob] = useState<CmsSourceJob | null>(null);
  const [bulkRefreshNotice, setBulkRefreshNotice] = useState('');
  const [bulkRefreshStopping, setBulkRefreshStopping] = useState(false);
  const [bulkRefreshRestarting, setBulkRefreshRestarting] = useState(false);
  const [bulkRefreshCanceling, setBulkRefreshCanceling] = useState(false);
  const [approvingItemId, setApprovingItemId] = useState('');
  const [editingItem, setEditingItem] = useState<CmsItem | null>(null);
  const [formState, setFormState] = useState<ItemFormState>(initialFormState);
  const [sourceRefreshResult, setSourceRefreshResult] = useState<CmsItemSourceRefreshResult | null>(null);
  const [manualImageFiles, setManualImageFiles] = useState<File[]>([]);
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [manualImageSourceUrl, setManualImageSourceUrl] = useState('');
  const [replaceExistingManualImages, setReplaceExistingManualImages] = useState(false);
  const [uploadManualAsMain, setUploadManualAsMain] = useState(true);
  const [uploadingManualImages, setUploadingManualImages] = useState(false);
  const [importingManualImageUrl, setImportingManualImageUrl] = useState(false);
  const [manualUploadInputKey, setManualUploadInputKey] = useState(0);
  const [detailsItem, setDetailsItem] = useState<CmsItem | null>(null);
  const [detailsChanges, setDetailsChanges] = useState<CmsItemChange[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showImageZoomModal, setShowImageZoomModal] = useState(false);
  const [imageZoomScale, setImageZoomScale] = useState(1);
  const [mediaPreviewToken, setMediaPreviewToken] = useState(() => String(Date.now()));

  const loadCategories = async () => {
    try {
      const categoryData = await fetchCategories();
      setCategories(categoryData);
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης κατηγοριών.');
    }
  };

  const loadTaxonomyFilters = async () => {
    try {
      const data = await fetchItemTaxonomyFilters({
        category_1: category1Filter || undefined,
        category_2: category2Filter || undefined,
      });
      setTaxonomyFilters(data);
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης φίλτρων κατηγοριών.');
    }
  };

  const loadItems = async () => {
    setLoading(true);
    setPageError('');
    try {
      const response = await fetchItems({
        search,
        status_filter: statusFilter,
        quality_state_filter: qualityStateFilter,
        missing_requirement: missingRequirementFilter,
        photo_source_filter: photoSourceFilter,
        category_1: category1Filter || undefined,
        category_2: category2Filter || undefined,
        category_3: category3Filter || undefined,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setItems(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης ειδών.');
    } finally {
      setLoading(false);
    }
  };

  const loadBulkRefreshStatus = async () => {
    try {
      const job = await fetchBulkRefreshStatus();
      setBulkRefreshJob(job);
    } catch {
      setBulkRefreshJob(null);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    void loadTaxonomyFilters();
  }, [category1Filter, category2Filter]);

  useEffect(() => {
    void loadItems();
  }, [search, statusFilter, qualityStateFilter, missingRequirementFilter, photoSourceFilter, category1Filter, category2Filter, category3Filter, page, perPage, sortBy, sortOrder]);

  useEffect(() => {
    void loadBulkRefreshStatus();
  }, []);

  useEffect(() => {
    if (!bulkRefreshJob?.running) return undefined;
    const timer = window.setInterval(() => {
      void loadBulkRefreshStatus();
    }, 4000);
    return () => window.clearInterval(timer);
  }, [bulkRefreshJob?.running]);

  const categoryNameById = useMemo(() => new Map(categories.map((category) => [category.id, category.name])), [categories]);
  const categoryById = useMemo(() => buildCategoryById(categories), [categories]);
  const category1Options = useMemo(
    () =>
      categories
        .filter((category) => !category.parent_id && category.is_active)
        .slice()
        .sort((left, right) => left.name.localeCompare(right.name)),
    [categories],
  );
  const category2Options = useMemo(
    () =>
      categories
        .filter((category) => category.parent_id === formState.category_1_id && category.is_active)
        .slice()
        .sort((left, right) => left.name.localeCompare(right.name)),
    [categories, formState.category_1_id],
  );
  const category3Options = useMemo(
    () =>
      categories
        .filter((category) => category.parent_id === formState.category_2_id && category.is_active)
        .slice()
        .sort((left, right) => left.name.localeCompare(right.name)),
    [categories, formState.category_2_id],
  );
  const detailsImages = useMemo(() => buildImageList(detailsItem), [detailsItem]);
  const detailsCategoryLevels = useMemo(
    () => itemCategoryLevels(detailsItem, categoryNameById),
    [detailsItem, categoryNameById],
  );
  const editCategoryPath = useMemo(
    () => selectedCategoryPath(formState, categoryById),
    [formState, categoryById],
  );
  const editCategoryLevels = useMemo(
    () => [
      { label: 'Κατηγορία 1', value: categoryById.get(formState.category_1_id)?.name || '' },
      { label: 'Κατηγορία 2', value: categoryById.get(formState.category_2_id)?.name || '' },
      { label: 'Κατηγορία 3', value: categoryById.get(formState.category_3_id)?.name || '' },
    ],
    [formState, categoryById],
  );
  const editImages = useMemo(() => buildImageList(editingItem), [editingItem]);
  const formPreviewMainImage = useMemo(
    () => appendPreviewToken(formState.main_image, mediaPreviewToken),
    [formState.main_image, mediaPreviewToken],
  );
  const editImagePreviewMap = useMemo(
    () => new Map(editImages.map((imageUrl) => [imageUrl, appendPreviewToken(imageUrl, mediaPreviewToken)])),
    [editImages, mediaPreviewToken],
  );
  const descriptionPreviewHtml = useMemo(
    () => formState.description_html.trim() || plainTextToHtml(htmlToPlainText(formState.description_html)),
    [formState.description_html],
  );
  const editDraftQuality = useMemo(() => buildDraftQuality(formState), [formState]);

  const applyDescriptionAutoFormat = () => {
    setFormState((prev) => {
      const source = prev.description_html.trim();
      const plain = htmlToPlainText(source) || source;
      return { ...prev, description_html: plainTextToHtml(plain) };
    });
  };

  const insertDescriptionTemplate = () => {
    setFormState((prev) => ({
      ...prev,
      description_html: prev.description_html.trim() ? `${prev.description_html.trim()}\n\n${descriptionTemplate()}` : descriptionTemplate(),
    }));
  };

  const resetManualUploadState = () => {
    setManualImageFiles([]);
    setManualImageUrl('');
    setManualImageSourceUrl('');
    setReplaceExistingManualImages(false);
    setUploadManualAsMain(true);
    setManualUploadInputKey((prev) => prev + 1);
  };

  const openCreate = () => {
    setMediaPreviewToken(String(Date.now()));
    setEditingItem(null);
    setFormState(initialFormState);
    setFormError('');
    setManualRefreshSources(initialSourceSelectionState);
    setSourceRefreshResult(null);
    resetManualUploadState();
    setShowFormModal(true);
  };

  const openEdit = (item: CmsItem) => {
    setMediaPreviewToken(String(Date.now()));
    setEditingItem(item);
    setFormState(toFormStateFromItem(item, categoryById));
    setFormError('');
    setManualRefreshSources(initialSourceSelectionState);
    setSourceRefreshResult(null);
    resetManualUploadState();
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setFormError('');
    setManualRefreshSources(initialSourceSelectionState);
    setSourceRefreshResult(null);
    resetManualUploadState();
  };

  const openDetails = async (itemId: string) => {
    setMediaPreviewToken(String(Date.now()));
    setShowDetailsModal(true);
    setDetailsLoading(true);
    try {
      const [item, changes] = await Promise.all([fetchItem(itemId), fetchItemChanges(itemId)]);
      setDetailsItem(item);
      setDetailsChanges(changes);
      const images = buildImageList(item);
      setSelectedImage(images[0] || '');
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης λεπτομερειών είδους.');
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    const focusId = searchParams.get('focus');
    if (!focusId || autoOpenedDetails.current) return;
    autoOpenedDetails.current = true;
    void openDetails(focusId);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('focus');
      return next;
    }, { replace: true });
  }, [searchParams, setSearchParams]);

  const closeDetails = () => {
    setShowDetailsModal(false);
    setShowImageZoomModal(false);
    setImageZoomScale(1);
  };

  const openImageZoom = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageZoomScale(1);
    setShowImageZoomModal(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      if (editingItem) {
        await updateItem(editingItem.id, toPayload(formState));
      } else {
        await createItem(toPayload(formState));
      }
      closeFormModal();
      await loadItems();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Αποτυχία αποθήκευσης είδους.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!editingItem) return;
    const confirmed = window.confirm(`Διαγραφή είδους "${editingItem.title || editingItem.barcode || editingItem.id}"?`);
    if (!confirmed) return;

    setSubmitting(true);
    setFormError('');
    try {
      await deleteItem(editingItem.id);
      closeFormModal();
      setEditingItem(null);
      setFormState(initialFormState);
      await loadItems();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Αποτυχία διαγραφής είδους.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!editingItem) return;
    const normalizedImageUrl = String(imageUrl || '').trim();
    if (!normalizedImageUrl) return;

    const confirmed = window.confirm('Διαγραφή αυτής της εικόνας από το είδος;');
    if (!confirmed) return;

    setDeletingImageUrl(normalizedImageUrl);
    setFormError('');
    try {
      const updatedItem = await deleteItemImage(editingItem.id, normalizedImageUrl);
      const updatedCategories = await fetchCategories();
      const updatedCategoryById = buildCategoryById(updatedCategories);
      setCategories(updatedCategories);
      setEditingItem(updatedItem);
      setFormState(toFormStateFromItem(updatedItem, updatedCategoryById));
      setSourceRefreshResult(null);
      setMediaPreviewToken(String(Date.now()));
      setItems((prev) => prev.map((row) => (row.id === updatedItem.id ? updatedItem : row)));
      if (detailsItem?.id === updatedItem.id) {
        setDetailsItem(updatedItem);
      }
      if (selectedImage === normalizedImageUrl) {
        const nextImages = buildImageList(updatedItem);
        setSelectedImage(nextImages[0] || '');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Αποτυχία διαγραφής εικόνας.');
    } finally {
      setDeletingImageUrl('');
    }
  };

  const handleManualImageUpload = async () => {
    if (!editingItem) {
      setFormError('Αποθήκευσε πρώτα το είδος πριν ανεβάσεις χειροκίνητα εικόνες.');
      return;
    }
    if (!manualImageFiles.length) {
      setFormError('Επίλεξε τουλάχιστον μία εικόνα για ανέβασμα.');
      return;
    }

    setUploadingManualImages(true);
    setFormError('');
    try {
      const updatedItem = await uploadItemImagesManual(editingItem.id, manualImageFiles, {
        replaceExisting: replaceExistingManualImages,
        setUploadedAsMain: uploadManualAsMain,
      });
      setEditingItem(updatedItem);
      setFormState(toFormStateFromItem(updatedItem, categoryById));
      setSourceRefreshResult(null);
      setMediaPreviewToken(String(Date.now()));
      setItems((prev) => prev.map((row) => (row.id === updatedItem.id ? updatedItem : row)));
      if (detailsItem?.id === updatedItem.id) {
        setDetailsItem(updatedItem);
      }
      setSelectedImage(updatedItem.main_image || '');
      resetManualUploadState();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Αποτυχία ανεβάσματος εικόνων.');
    } finally {
      setUploadingManualImages(false);
    }
  };

  const handleOpenGoogleImages = () => {
    const barcode = formState.barcode.trim();
    const brand = formState.brand.trim();
    const title = formState.title.trim();
    const compactTitle = title.split(/\s+/).slice(0, 8).join(' ').trim();
    const searchTerms = [barcode, brand, compactTitle].filter(Boolean).join(' ').trim();
    if (!searchTerms) {
      setFormError('Χρειάζεται barcode ή τίτλος πριν ανοίξεις το Google Images.');
      return;
    }
    const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchTerms)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleImportManualImageUrl = async () => {
    if (!editingItem) {
      setFormError('Αποθήκευσε πρώτα το είδος πριν εισάγεις remote εικόνα.');
      return;
    }
    if (!manualImageUrl.trim() && !manualImageSourceUrl.trim()) {
      setFormError('Κάνε επικόλληση direct URL εικόνας ή URL σελίδας πηγής πριν την εισαγωγή.');
      return;
    }
    if (isGoogleSearchUrl(manualImageUrl)) {
      setFormError('Το Google search URL δεν είναι άμεση εικόνα. Βάλε το URL της εικόνας ή το URL της σελίδας πηγής.');
      return;
    }
    if (isGoogleSearchUrl(manualImageSourceUrl)) {
      setFormError('Χρησιμοποίησε τη σελίδα προϊόντος της πηγής, όχι το Google search URL.');
      return;
    }

    setImportingManualImageUrl(true);
    setFormError('');
    try {
      const updatedItem = await importItemImageFromUrl(editingItem.id, {
        imageUrl: manualImageUrl.trim(),
        sourcePageUrl: manualImageSourceUrl.trim(),
        replaceExisting: replaceExistingManualImages,
        setUploadedAsMain: uploadManualAsMain,
      });
      setEditingItem(updatedItem);
      setFormState(toFormStateFromItem(updatedItem, categoryById));
      setSourceRefreshResult(null);
      setMediaPreviewToken(String(Date.now()));
      setItems((prev) => prev.map((row) => (row.id === updatedItem.id ? updatedItem : row)));
      if (detailsItem?.id === updatedItem.id) {
        setDetailsItem(updatedItem);
      }
      setSelectedImage(updatedItem.main_image || '');
      resetManualUploadState();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Αποτυχία εισαγωγής remote εικόνας.');
    } finally {
      setImportingManualImageUrl(false);
    }
  };

  const handleRefreshFromSources = async () => {
    if (!editingItem) return;
    const barcode = formState.barcode.trim();
    if (!barcode) {
      setFormError('Χρειάζεται barcode πριν γίνει refresh από πηγές.');
      return;
    }

    setRefreshingFromSource(true);
    setFormError('');
    try {
      const refreshed = await refreshItemFromSources(editingItem.id, barcode, {
        sourceKey: manualRefreshSources.sourceKey || undefined,
        textSourceKey: manualRefreshSources.textSourceKey || undefined,
        imageSourceKey: manualRefreshSources.imageSourceKey || undefined,
        categorySourceKey: manualRefreshSources.categorySourceKey || undefined,
      });
      const updatedCategories = await fetchCategories();
      const updatedCategoryById = buildCategoryById(updatedCategories);
      setCategories(updatedCategories);
      setEditingItem(refreshed.item);
      setFormState(toFormStateFromItem(refreshed.item, updatedCategoryById));
      setSourceRefreshResult(refreshed);
      setMediaPreviewToken(String(Date.now()));
      setItems((prev) => prev.map((row) => (row.id === refreshed.item.id ? refreshed.item : row)));
      if (detailsItem?.id === refreshed.item.id) {
        setDetailsItem(refreshed.item);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Αποτυχία refresh από πηγές.');
    } finally {
      setRefreshingFromSource(false);
    }
  };

  const handleStartBulkRefresh = async () => {
    setBulkRefreshing(true);
    setPageError('');
    setPageSuccess('');
    setBulkRefreshNotice('');
    try {
      const result: CmsBulkRefreshStartResult = await startBulkRefresh({
        search,
        status_filter: statusFilter,
        quality_state_filter: qualityStateFilter,
        missing_requirement: missingRequirementFilter,
        photo_source_filter: photoSourceFilter,
        category_1: category1Filter || undefined,
        category_2: category2Filter || undefined,
        category_3: category3Filter || undefined,
        source_key: bulkRefreshSources.sourceKey || undefined,
        text_source_key: bulkRefreshSources.textSourceKey || undefined,
        image_source_key: bulkRefreshSources.imageSourceKey || undefined,
        category_source_key: bulkRefreshSources.categorySourceKey || undefined,
        limit: bulkRefreshLimit,
      });
      setBulkRefreshJob(result.job);
      setBulkRefreshNotice(
        result.job_start.already_running
          ? `Το bulk refresh εκτελείται ήδη (${result.matched_total.toLocaleString()} είδη ταιριάζουν).`
          : `Το bulk refresh ξεκίνησε για έως ${result.limit.toLocaleString()} είδη (${result.matched_total.toLocaleString()} ταιριάζουν με τα φίλτρα).`,
      );
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Αποτυχία εκκίνησης bulk refresh.');
    } finally {
      setBulkRefreshing(false);
      await loadBulkRefreshStatus();
    }
  };

  const handleStopBulkRefresh = async () => {
    setBulkRefreshStopping(true);
    setBulkRefreshNotice('');
    try {
      const result = await stopBulkRefresh();
      setBulkRefreshJob(result.job || null);
      setBulkRefreshNotice(result.stop_result.stopped ? 'Το bulk refresh σταμάτησε.' : 'Δεν έτρεχε bulk refresh.');
    } catch (err) {
      setBulkRefreshNotice(err instanceof Error ? err.message : 'Αποτυχία διακοπής bulk refresh.');
    } finally {
      setBulkRefreshStopping(false);
    }
  };

  const handleRestartBulkRefresh = async () => {
    setBulkRefreshRestarting(true);
    setBulkRefreshNotice('');
    try {
      const result = await restartBulkRefresh();
      setBulkRefreshJob(result.job || null);
      setBulkRefreshNotice('Το bulk refresh επανεκκίνησε.');
    } catch (err) {
      setBulkRefreshNotice(err instanceof Error ? err.message : 'Αποτυχία επανεκκίνησης bulk refresh.');
    } finally {
      setBulkRefreshRestarting(false);
    }
  };

  const handleCancelBulkRefresh = async () => {
    setBulkRefreshCanceling(true);
    setBulkRefreshNotice('');
    try {
      const result = await cancelBulkRefresh();
      setBulkRefreshJob(result.job || null);
      setBulkRefreshNotice(result.cancel_result.stopped ? 'Το bulk refresh ακυρώθηκε.' : 'Δεν έτρεχε bulk refresh.');
    } catch (err) {
      setBulkRefreshNotice(err instanceof Error ? err.message : 'Αποτυχία ακύρωσης bulk refresh.');
    } finally {
      setBulkRefreshCanceling(false);
    }
  };

  const handleApproveGoLive = async (item: CmsItem) => {
    if (!canApproveGoLive(item)) {
      return;
    }
    const confirmed = window.confirm(`Έγκριση "${item.title || item.barcode || item.id}" για δημοσίευση;`);
    if (!confirmed) return;

    setApprovingItemId(item.id);
    setPageError('');
    setPageSuccess('');
    try {
      const updatedItem = await approveItemGoLive(item.id);
      setPageSuccess(`"${updatedItem.title || updatedItem.barcode}" μεταφέρθηκε σε live κατάσταση.`);
      setItems((prev) => prev.map((row) => (row.id === updatedItem.id ? updatedItem : row)));
      if (detailsItem?.id === updatedItem.id) {
        setDetailsItem(updatedItem);
        const changes = await fetchItemChanges(updatedItem.id);
        setDetailsChanges(changes);
      }
      if (editingItem?.id === updatedItem.id) {
        setEditingItem(updatedItem);
        setFormState(toFormStateFromItem(updatedItem, categoryById));
      }
      await loadItems();
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'Αποτυχία έγκρισης για δημοσίευση.');
    } finally {
      setApprovingItemId('');
    }
  };

  const sourceRefreshCategoryLabel = (() => {
    if (!sourceRefreshResult?.category_resolution_source) return '';
    if (sourceRefreshResult.category_resolution_source === 'barcode_lookup') return 'Κατηγορίες από barcode mapping';
    if (sourceRefreshResult.category_resolution_source === 'source') return 'Κατηγορίες από την πηγή';
    if (sourceRefreshResult.category_resolution_source === 'existing') return 'Διατηρήθηκαν οι υπάρχουσες κατηγορίες';
    return 'Δεν βρέθηκε category path';
  })();

  const manualRefreshOverrideCount = Object.values(manualRefreshSources).filter(Boolean).length;
  const bulkRefreshOverrideCount = Object.values(bulkRefreshSources).filter(Boolean).length;
  const bulkRefreshMatchedCount = pagination.total;
  const bulkRefreshStatusVariant =
    bulkRefreshJob?.running ? 'primary' : bulkRefreshJob?.status === 'completed' ? 'success' : bulkRefreshJob?.status === 'failed' ? 'danger' : 'secondary';
  const bulkRefreshSelectedTotal = bulkRefreshJob?.selected_total ?? 0;
  const bulkRefreshProcessed = bulkRefreshJob?.processed ?? 0;
  const bulkRefreshUpdated = bulkRefreshJob?.updated ?? 0;
  const bulkRefreshSkipped = bulkRefreshJob?.skipped ?? 0;
  const bulkRefreshFailed = bulkRefreshJob?.failed ?? 0;
  const bulkRefreshProgress = bulkRefreshSelectedTotal > 0 ? Math.min(100, Math.round((bulkRefreshProcessed / bulkRefreshSelectedTotal) * 100)) : 0;
  const sourceRefreshCategorySource =
    sourceRefreshResult?.category_resolution_source === 'barcode_lookup'
      ? 'Barcode mapping'
      : sourceRefreshResult?.category_source_name || (sourceRefreshResult?.category_resolution_source === 'existing' ? 'Υπάρχουσες κατηγορίες' : '-');
  const shouldShowBulkRefreshPanel = showBulkRefreshPanel && qualityStateFilter === 'needs_fix';

  const activeFilterCount = [
    Boolean(search.trim()),
    statusFilter !== 'all',
    qualityStateFilter !== 'all',
    missingRequirementFilter !== 'all',
    photoSourceFilter !== 'all',
    Boolean(category1Filter),
    Boolean(category2Filter),
    Boolean(category3Filter),
  ].filter(Boolean).length;

  const moduleMetrics = [
    {
      label: tx('Filtered Records', 'Φιλτραρισμένες Εγγραφές'),
      value: pagination.total.toLocaleString(),
      helper: tx('Items matching the current filter set', 'Είδη που ταιριάζουν στα φίλτρα'),
      tone: 'primary' as const,
    },
    {
      label: tx('Active Filters', 'Ενεργά Φίλτρα'),
      value: activeFilterCount,
      helper: activeFilterCount
        ? tx('Filters are narrowing the result set', 'Τα φίλτρα περιορίζουν τα αποτελέσματα')
        : tx('Showing the full result set', 'Προβολή όλων των αποτελεσμάτων'),
      tone: activeFilterCount ? ('warning' as const) : ('info' as const),
    },
    {
      label: tx('Page', 'Σελίδα'),
      value: `${pagination.page}/${Math.max(pagination.total_pages, 1)}`,
      helper: `${perPage} ${tx('per page', 'ανά σελίδα')}`,
      tone: 'success' as const,
    },
  ];

  const pages: React.ReactNode[] = [];
  for (let index = 1; index <= pagination.total_pages; index += 1) {
    pages.push(
      <Pagination.Item key={index} active={index === pagination.page} onClick={() => setPage(index)}>
        {index}
      </Pagination.Item>,
    );
  }

  return (
    <ModulePage
      title={resolvedModuleTitle}
      description={resolvedModuleDescription}
      metrics={moduleMetrics}
    >
      <style>{ITEM_DETAILS_MODAL_CSS}</style>
      {pageError ? <Alert variant="danger">{pageError}</Alert> : null}
      {pageSuccess ? <Alert variant="success">{pageSuccess}</Alert> : null}
      <Alert variant="info" className="mb-4">
        {tx('To see which items need correction, set ', 'Για να δεις ποια είδη θέλουν διόρθωση, βάλε ')}
        <strong>Quality = Needs Fix</strong>
        {tx('. On each item you will also see which requirements are missing.', '. Στο κάθε είδος θα δεις και ποια requirements λείπουν.')}
      </Alert>

      {shouldShowBulkRefreshPanel ? (
      <Card className="cms-refresh-panel mb-4">
        <Card.Body className="cms-refresh-panel__body">
          <div className="cms-refresh-panel__header">
            <div>
              <h3 className="cms-refresh-panel__title">Μαζική Ανανέωση Πηγών</h3>
              <p className="cms-refresh-panel__note">
                Χρησιμοποιεί τα τρέχοντα φίλτρα του Fix Queue και τρέχει background refresh στα matching items. Μπορείς να κρατήσεις το auto chain ή να
                ορίσεις ξεχωριστές πηγές για κείμενα, φωτογραφίες, και κατηγορίες.
              </p>
            </div>
            <div className="cms-refresh-panel__actions">
              <Form.Control
                className="cms-item-form-control cms-refresh-panel__limit"
                type="number"
                min={1}
                max={5000}
                value={bulkRefreshLimit}
                onChange={(event) => setBulkRefreshLimit(Math.max(1, Math.min(5000, Number(event.target.value) || 1)))}
                disabled={bulkRefreshing}
              />
              <Button
                onClick={() => void handleStartBulkRefresh()}
                disabled={bulkRefreshing || !bulkRefreshMatchedCount}
              >
                {bulkRefreshing ? 'Εκκίνηση...' : bulkRefreshOverrideCount ? 'Έναρξη με επιλεγμένες πηγές' : 'Έναρξη Bulk Refresh'}
              </Button>
            </div>
          </div>

          <div className="cms-refresh-panel__meta">
            <div className="cms-refresh-panel__meta-group">
              <span className="cms-refresh-panel__stat">
                <strong>{bulkRefreshMatchedCount.toLocaleString()}</strong> ταιριάζουν με τα φίλτρα
              </span>
              <span className="cms-refresh-panel__stat">
                <strong>{activeFilterCount}</strong> ενεργά φίλτρα
              </span>
              <span className="cms-refresh-panel__stat">
                <strong>{bulkRefreshOverrideCount}</strong> επιλεγμένες πηγές
              </span>
            </div>
            <div className="cms-item-muted-note">
              Το όριο εφαρμόζεται στο φιλτραρισμένο σύνολο. Τρέχον όριο: <strong>{bulkRefreshLimit.toLocaleString()}</strong> είδη.
            </div>
          </div>

          <div className="cms-refresh-source-grid">
            {SOURCE_SELECTION_FIELDS.map((field) => (
              <div key={`bulk-${field.key}`} className="cms-refresh-source-card">
                <label className="cms-refresh-source-card__label">{field.label}</label>
                <Form.Select
                  className="cms-item-form-select"
                  value={bulkRefreshSources[field.key]}
                  disabled={bulkRefreshing}
                  onChange={(event) =>
                    setBulkRefreshSources((prev) => ({
                      ...prev,
                      [field.key]: event.target.value,
                    }))
                  }
                >
                  {SOURCE_FIELD_OPTIONS.map((option) => (
                    <option key={`${field.key}-${option.value || 'auto'}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                <div className="cms-refresh-source-card__helper">{field.helper}</div>
              </div>
            ))}
          </div>

          <div className="cms-refresh-panel__job">
          <div className="cms-refresh-panel__job-header">
            <div className="cms-refresh-panel__job-title">Κατάσταση Bulk Job</div>
            <Badge bg={bulkRefreshStatusVariant}>
              {bulkRefreshJob?.running ? 'Σε εξέλιξη' : bulkRefreshJob?.status || 'Ανενεργό'}
            </Badge>
          </div>
          <div className="cms-refresh-panel__job-actions">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => void handleStopBulkRefresh()}
              disabled={!bulkRefreshJob?.running || bulkRefreshStopping}
            >
              {bulkRefreshStopping ? 'Διακοπή...' : 'Διακοπή'}
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => void handleCancelBulkRefresh()}
              disabled={!bulkRefreshJob?.running || bulkRefreshCanceling}
            >
              {bulkRefreshCanceling ? 'Ακύρωση...' : 'Ακύρωση'}
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => void handleRestartBulkRefresh()}
              disabled={bulkRefreshRestarting}
            >
              {bulkRefreshRestarting ? 'Επανεκκίνηση...' : 'Επανεκκίνηση'}
            </Button>
          </div>
            <div className="cms-refresh-panel__job-meta mb-2">
              <span>Job: {bulkRefreshJob?.label || 'Ανανέωση καταλόγου'}</span>
              <span>Διάρκεια: {bulkRefreshJob?.elapsed_human || '-'}</span>
              <span>Τελευταίο τέλος: {bulkRefreshJob?.last_finished_at ? formatDate(bulkRefreshJob.last_finished_at) : '-'}</span>
            </div>
            {bulkRefreshSelectedTotal > 0 ? (
              <div className="cms-refresh-panel__job-progress mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Πρόοδος: {bulkRefreshProcessed.toLocaleString()} / {bulkRefreshSelectedTotal.toLocaleString()}</span>
                  <span>{bulkRefreshProgress}%</span>
                </div>
                <div className="progress cloudon-progress-track cloudon-progress-track--success mt-2" style={{ height: '8px' }}>
                  <div className="progress-bar" style={{ width: `${bulkRefreshProgress}%` }}></div>
                </div>
                <div className="d-flex flex-wrap gap-3 mt-2 text-muted">
                  <span>Ενημερώθηκαν: {bulkRefreshUpdated.toLocaleString()}</span>
                  <span>Παραλείφθηκαν: {bulkRefreshSkipped.toLocaleString()}</span>
                  <span>Απέτυχαν: {bulkRefreshFailed.toLocaleString()}</span>
                  {bulkRefreshJob?.last_barcode ? <span>Τελευταίο barcode: {bulkRefreshJob.last_barcode}</span> : null}
                </div>
              </div>
            ) : null}
            <div className="cms-refresh-panel__job-message">
              {bulkRefreshNotice || bulkRefreshJob?.last_message || 'Δεν έχει ξεκινήσει bulk refresh από το τρέχον Fix Queue.'}
            </div>
          </div>
        </Card.Body>
      </Card>
      ) : null}

      <Row className="mb-4 g-3 align-items-end">
        <Col xl={3} md={6}>
          <Form.Label>{tx('Search', 'Αναζήτηση')}</Form.Label>
          <Form.Control value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder={tx('Title, code, barcode', 'Τίτλος, κωδικός, barcode')} />
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>{tx('Status', 'Κατάσταση')}</Form.Label>
          <Form.Select value={statusFilter} onChange={(event) => { setPage(1); setStatusFilter(event.target.value as 'all' | 'active' | 'inactive'); }}>
            <option value="all">{tx('All', 'Όλα')}</option>
            <option value="active">{tx('Active', 'Ενεργά')}</option>
            <option value="inactive">{tx('Inactive', 'Ανενεργά')}</option>
          </Form.Select>
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>{tx('Quality', 'Ποιότητα')}</Form.Label>
          <Form.Select value={qualityStateFilter} disabled={lockQualityStateFilter} onChange={(event) => { setPage(1); setQualityStateFilter(event.target.value as 'all' | 'ready' | 'needs_fix' | 'ready_for_review'); }}>
            <option value="all">{tx('All', 'Όλα')}</option>
            <option value="ready">{tx('Ready', 'Έτοιμα')}</option>
            <option value="needs_fix">{tx('Needs Fix', 'Χρειάζονται διόρθωση')}</option>
            <option value="ready_for_review">{tx('Ready for Review', 'Έτοιμα για έλεγχο')}</option>
          </Form.Select>
        </Col>
        <Col xl={2} md={6}>
          <Form.Label>{tx('Missing', 'Ελλείψεις')}</Form.Label>
          <Form.Select value={missingRequirementFilter} onChange={(event) => { setPage(1); setMissingRequirementFilter(event.target.value as 'all' | 'missing_any_image' | 'missing_text' | 'missing_category'); }}>
            <option value="all">{tx('All requirements', 'Όλες οι απαιτήσεις')}</option>
            <option value="missing_any_image">{tx('Missing public image', 'Χωρίς δημόσια εικόνα')}</option>
            <option value="missing_text">{tx('Missing text', 'Λείπει κείμενο')}</option>
            <option value="missing_category">{tx('Missing category', 'Λείπει κατηγορία')}</option>
          </Form.Select>
        </Col>
        <Col xl={3} md={6}>
          <Form.Label>{tx('Photo Source', 'Πηγή φωτογραφίας')}</Form.Label>
          <Form.Select
            value={photoSourceFilter}
            onChange={(event) => {
              setPage(1);
              setPhotoSourceFilter(event.target.value as 'all' | 'youpharmacy_xml' | 'pharmacy295_excel');
            }}
          >
            <option value="all">{tx('All photo sources', 'Όλες οι πηγές')}</option>
            <option value="youpharmacy_xml">{tx('YouPharmacy photo', 'YouPharmacy φωτογραφία')}</option>
            <option value="pharmacy295_excel">{tx('Pharmacy295 photo', 'Pharmacy295 φωτογραφία')}</option>
          </Form.Select>
        </Col>
        <Col xl={3} md={6}>
          <Form.Label>{tx('Category 1', 'Κατηγορία 1')}</Form.Label>
          <Form.Select value={category1Filter} onChange={(event) => { setPage(1); setCategory1Filter(event.target.value); setCategory2Filter(''); setCategory3Filter(''); }}>
            <option value="">{tx('All category 1', 'Όλες οι κατηγορίες 1')}</option>
            {taxonomyFilters.category_1.map((category) => (
              <option key={category.value} value={category.value}>
                {category.value} ({category.count})
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xl={3} md={6}>
          <Form.Label>{tx('Category 2', 'Κατηγορία 2')}</Form.Label>
          <Form.Select value={category2Filter} onChange={(event) => { setPage(1); setCategory2Filter(event.target.value); setCategory3Filter(''); }}>
            <option value="">{tx('All category 2', 'Όλες οι κατηγορίες 2')}</option>
            {taxonomyFilters.category_2.map((category) => (
              <option key={category.value} value={category.value}>
                {category.value} ({category.count})
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xl={3} md={6}>
          <Form.Label>{tx('Category 3', 'Κατηγορία 3')}</Form.Label>
          <Form.Select value={category3Filter} onChange={(event) => { setPage(1); setCategory3Filter(event.target.value); }}>
            <option value="">{tx('All category 3', 'Όλες οι κατηγορίες 3')}</option>
            {taxonomyFilters.category_3.map((category) => (
              <option key={category.value} value={category.value}>
                {category.value} ({category.count})
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xl={2} md={3}>
          <Form.Label>{tx('Sort By', 'Ταξινόμηση')}</Form.Label>
          <Form.Select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="updated_at">{tx('Updated At', 'Ενημερώθηκε')}</option>
            <option value="created_at">{tx('Created At', 'Δημιουργήθηκε')}</option>
            <option value="title">{tx('Title', 'Τίτλος')}</option>
            <option value="code">{tx('Code', 'Κωδικός')}</option>
            <option value="barcode">Barcode</option>
            <option value="status">{tx('Status', 'Κατάσταση')}</option>
          </Form.Select>
        </Col>
        <Col xl={1} md={3}>
          <Form.Label>{tx('Order', 'Σειρά')}</Form.Label>
          <Form.Select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as 'asc' | 'desc')}>
            <option value="desc">{tx('Desc', 'Φθίνουσα')}</option>
            <option value="asc">{tx('Asc', 'Αύξουσα')}</option>
          </Form.Select>
        </Col>
        <Col xl={1} md={12} className="text-md-end">
          <Button onClick={openCreate}>{tx('New', 'Νέο')}</Button>
        </Col>
      </Row>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Card.Title>{tx('Items List', 'Λίστα Ειδών')}</Card.Title>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted fs-13">{tx('Per Page', 'Ανά σελίδα')}</span>
            <Form.Select style={{ width: 100 }} value={perPage} onChange={(event) => { setPage(1); setPerPage(Number(event.target.value)); }}>
              {[15, 25, 50].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Form.Select>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <>
              <Table responsive className="table table-striped mb-3 align-middle">
                <thead>
                  <tr>
                    <th>{tx('Title', 'Τίτλος')}</th>
                    <th>{tx('Category', 'Κατηγορία')}</th>
                    <th>{tx('Status', 'Κατάσταση')}</th>
                    <th>{tx('Quality', 'Ποιότητα')}</th>
                    <th>{tx('Missing', 'Ελλείψεις')}</th>
                    <th>{tx('Updated At', 'Ενημερώθηκε')}</th>
                    <th>{tx('Actions', 'Ενέργειες')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length ? (
                    items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="fw-semibold">{item.title || '-'}</div>
                          <div className="text-muted fs-12">Barcode: {item.barcode || '-'} | {tx('Code', 'Κωδικός')}: {item.code || '-'}</div>
                          {photoSourceLockBadge(item) ? (
                            <div className="mt-1">{photoSourceLockBadge(item)}</div>
                          ) : null}
                        </td>
                        <td>{item.category_name || categoryNameById.get(item.category_id) || '-'}</td>
                        <td>{statusBadge(item.status, language)}</td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            <div>{qualityStateBadge(item.catalog_quality_state, language)}</div>
                            <div className="text-muted fs-12">
                              {item.catalog_public_image_enabled
                                ? tx('Public image enabled', 'Δημόσια εικόνα ενεργή')
                                : tx('Public image hidden', 'Δημόσια εικόνα κρυφή')}
                            </div>
                          </div>
                        </td>
                        <td>
                          {item.catalog_missing_requirements?.length ? (
                            <div className="d-flex flex-wrap gap-1">
                              {item.catalog_missing_requirements.map((requirement) => (
                                <Badge key={`${item.id}-${requirement}`} bg="light" text="dark">
                                  {missingRequirementLabel(requirement, language)}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-success fs-12">{tx('Complete', 'Ολοκληρωμένο')}</span>
                          )}
                        </td>
                        <td>{formatDate(item.updated_at)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            {canApproveGoLive(item) ? (
                              <Button
                                size="sm"
                                variant="success"
                                disabled={approvingItemId === item.id}
                                onClick={() => void handleApproveGoLive(item)}
                              >
                                {approvingItemId === item.id ? tx('Approving...', 'Έγκριση...') : tx('Approve Go Live', 'Έγκριση δημοσίευσης')}
                              </Button>
                            ) : null}
                            <Button size="sm" variant="outline-info" onClick={() => void openDetails(item.id)}>
                              {tx('Details', 'Λεπτομέρειες')}
                            </Button>
                            <Button size="sm" variant="outline-primary" onClick={() => openEdit(item)}>
                              {tx('Edit', 'Επεξεργασία')}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">
                        {tx('No items found.', 'Δεν βρέθηκαν είδη.')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span className="text-muted fs-13">
                  {tx('Page', 'Σελίδα')} {pagination.page} {tx('of', 'από')} {pagination.total_pages} | {tx('Total', 'Σύνολο')} {pagination.total} {tx('records', 'εγγραφές')}
                </span>
                <Pagination className="mb-0">{pages}</Pagination>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <Modal show={showFormModal} onHide={closeFormModal} size="xl" centered dialogClassName="cms-item-form-modal">
        <Modal.Header closeButton>
          <div className="d-flex flex-column gap-1">
            <Modal.Title>{editingItem ? 'Επεξεργασία είδους' : 'Δημιουργία είδους'}</Modal.Title>
            <div className="d-flex align-items-center flex-wrap gap-2 fs-12 text-muted">
              <span>Barcode: {detailValue(formState.barcode)}</span>
              <span>Κωδικός: {detailValue(formState.code)}</span>
              {statusBadge(formState.status)}
            </div>
          </div>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="cms-item-edit-shell">
              <div className="cms-item-details-hero">
                <div className="cms-item-details-media-panel">
                  <div className="cms-item-details-kicker">Πολυμέσα προϊόντος</div>
                  {formState.main_image ? (
                    <>
                      <button
                        type="button"
                        className="cms-item-details-main-image w-100"
                        style={{ cursor: 'zoom-in' }}
                        onClick={() => openImageZoom(formPreviewMainImage)}
                      >
                        <img src={formPreviewMainImage} alt={formState.title || 'Item preview'} />
                      </button>
                      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                        <span className="text-muted fs-13">Προεπισκόπηση κύριας εικόνας</span>
                        <Button variant="outline-secondary" size="sm" onClick={() => openImageZoom(formPreviewMainImage)}>
                          Μεγέθυνση
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-muted">Δεν υπάρχει κύρια εικόνα.</div>
                  )}
                  {editingItem ? (
                    <div className="mt-4">
                      <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                        <span className="text-muted fs-13">Εικόνες είδους</span>
                        <span className="text-muted fs-12">{editImages.length} εικόνα(ες)</span>
                      </div>
                      {editImages.length ? (
                        <div className="d-flex flex-column gap-2">
                          {editImages.map((imageUrl, index) => {
                            const previewImageUrl = editImagePreviewMap.get(imageUrl) || imageUrl;
                            return (
                              <div key={imageUrl} className="border rounded p-2">
                                <div className="d-flex align-items-start gap-2">
                                  <button
                                    type="button"
                                    className="border-0 bg-transparent p-0"
                                    style={{ cursor: 'zoom-in' }}
                                    onClick={() => openImageZoom(previewImageUrl)}
                                  >
                                    <img
                                      src={previewImageUrl}
                                      alt={`Item image ${index + 1}`}
                                      style={{ width: 72, height: 72, objectFit: 'contain', borderRadius: 8, background: '#fff' }}
                                    />
                                  </button>
                                  <div className="flex-grow-1 min-w-0">
                                    <div className="fw-semibold fs-12 mb-1">Εικόνα {index + 1}</div>
                                    <div className="text-muted fs-12 text-break">{imageUrl}</div>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-end mt-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline-danger"
                                    disabled={Boolean(deletingImageUrl) || refreshingFromSource || submitting}
                                    onClick={() => void handleDeleteImage(imageUrl)}
                                  >
                                    {deletingImageUrl === imageUrl ? 'Διαγραφή...' : 'Διαγραφή'}
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-muted fs-13">Δεν υπάρχουν εικόνες είδους.</div>
                      )}
                    </div>
                  ) : null}
                  <div className="mt-4 border rounded-4 p-3 bg-light-subtle">
                    <div className="d-flex align-items-start justify-content-between gap-3 mb-2">
                      <div>
                        <div className="fw-semibold">Χειροκίνητη μεταφόρτωση</div>
                        <div className="text-muted fs-13">
                          Ανέβασε δικά σου αρχεία εικόνας όταν καμία πηγή δεν δίνει αξιοποιήσιμο αποτέλεσμα.
                        </div>
                      </div>
                      {editingItem ? photoSourceLockBadge(editingItem) : null}
                    </div>
                    {editingItem ? (
                      <div className="d-flex flex-column gap-3">
                        <div className="border rounded-4 p-3 bg-white">
                          <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-2">
                            <div>
                              <div className="fw-semibold">Εφεδρικές εικόνες Google</div>
                              <div className="text-muted fs-13">
                                Άνοιξε Google Images για το barcode/brand και κάνε εισαγωγή είτε του direct URL εικόνας είτε του URL σελίδας πηγής.
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline-secondary"
                              size="sm"
                              onClick={handleOpenGoogleImages}
                              disabled={uploadingManualImages || importingManualImageUrl || refreshingFromSource || submitting}
                            >
                              Άνοιγμα Google Images
                            </Button>
                          </div>
                          <div className="d-flex flex-column gap-2">
                            <Form.Control
                              type="url"
                              placeholder="Άμεσο URL εικόνας (προαιρετικό αν δώσεις URL σελίδας πηγής)"
                              value={manualImageUrl}
                              onChange={(event) => setManualImageUrl(event.target.value)}
                              disabled={uploadingManualImages || importingManualImageUrl || refreshingFromSource || submitting}
                            />
                            {isGoogleSearchUrl(manualImageUrl) ? (
                              <Alert variant="warning" className="py-2 mb-0 fs-12">
                                Αυτό είναι URL αποτελεσμάτων Google, όχι direct image URL. Άνοιξε ένα αποτέλεσμα από το origin site και επικόλλησε εκείνο το image URL ή το product page URL.
                              </Alert>
                            ) : null}
                            <Form.Control
                              type="url"
                              placeholder="URL σελίδας πηγής (προαιρετικό, χρησιμοποιείται και για auto-extract)"
                              value={manualImageSourceUrl}
                              onChange={(event) => setManualImageSourceUrl(event.target.value)}
                              disabled={uploadingManualImages || importingManualImageUrl || refreshingFromSource || submitting}
                            />
                            {isGoogleSearchUrl(manualImageSourceUrl) ? (
                              <Alert variant="warning" className="py-2 mb-0 fs-12">
                                Στο `Source page URL` βάλε τη σελίδα προϊόντος του origin site, όχι το Google results URL. Το σύστημα κάνει extract μόνο από τη σελίδα του πραγματικού site.
                              </Alert>
                            ) : null}
                            <div className="text-muted fs-12">
                              Καλύτερη επιλογή: επικόλλησε το URL εικόνας από το origin site. Αν έχεις μόνο τη σελίδα προϊόντος, βάλε το URL σελίδας και το σύστημα θα προσπαθήσει να βρει την καλύτερη εικόνα.
                            </div>
                            <div className="text-muted fs-12">
                              Μην βάζεις εδώ το URL αποτελεσμάτων Google. Χρησιμοποίησε το Google μόνο για να βρεις το origin site.
                            </div>
                            <div className="d-flex justify-content-end">
                              <Button
                                type="button"
                                variant="outline-primary"
                                disabled={(!manualImageUrl.trim() && !manualImageSourceUrl.trim()) || uploadingManualImages || importingManualImageUrl || refreshingFromSource || submitting}
                                onClick={() => void handleImportManualImageUrl()}
                              >
                                {importingManualImageUrl ? 'Εισαγωγή...' : (manualImageUrl.trim() ? 'Εισαγωγή URL εικόνας' : 'Εισαγωγή από σελίδα')}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Form.Control
                          key={manualUploadInputKey}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          multiple
                          onChange={(event) => {
                            const input = event.currentTarget as HTMLInputElement;
                            setManualImageFiles(Array.from(input.files || []));
                          }}
                          disabled={uploadingManualImages || refreshingFromSource || submitting}
                        />
                        <div className="d-flex flex-column gap-2">
                          <Form.Check
                            id="manual-upload-replace-existing"
                            type="switch"
                            label="Αντικατάσταση υπαρχουσών hosted εικόνων"
                            checked={replaceExistingManualImages}
                            onChange={(event) => setReplaceExistingManualImages(event.target.checked)}
                            disabled={uploadingManualImages || refreshingFromSource || submitting}
                          />
                          <Form.Check
                            id="manual-upload-set-main"
                            type="switch"
                            label="Ορισμός της πρώτης εικόνας ως κύρια"
                            checked={uploadManualAsMain}
                            onChange={(event) => setUploadManualAsMain(event.target.checked)}
                            disabled={uploadingManualImages || refreshingFromSource || submitting}
                          />
                        </div>
                        <div className="text-muted fs-12">
                          {manualImageFiles.length
                            ? `${manualImageFiles.length} αρχείο(α) επιλεγμένα: ${manualImageFiles.map((file) => file.name).join(', ')}`
                            : 'Δεν έχουν επιλεγεί αρχεία.'}
                        </div>
                        <div className="d-flex justify-content-end">
                          <Button
                            type="button"
                            variant="dark"
                            disabled={!manualImageFiles.length || uploadingManualImages || refreshingFromSource || submitting}
                            onClick={() => void handleManualImageUpload()}
                          >
                            {uploadingManualImages ? 'Μεταφόρτωση...' : 'Μεταφόρτωση εικόνων'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted fs-13">Αποθήκευσε πρώτα το είδος για να ενεργοποιηθεί η χειροκίνητη μεταφόρτωση.</div>
                    )}
                  </div>
                </div>

                <div className="cms-item-details-summary-panel">
                  <div className="cms-item-details-kicker">Επεξεργάσιμη σύνοψη</div>
                  {editingItem ? (
                    <div className="cms-refresh-panel mb-3">
                      <div className="p-3 p-lg-4 cms-refresh-panel__body">
                        <div className="cms-refresh-panel__header">
                          <div>
                            <h4 className="cms-refresh-panel__title">Χειροκίνητη Ανανέωση Πηγών</h4>
                            <p className="cms-refresh-panel__note mb-0">
                              Τραβά κείμενα από την πρώτη διαθέσιμη πηγή. Για τις κατηγορίες ελέγχει πρώτα το barcode mapping και μόνο αν δεν βρεθεί match
                              πέφτει στις κατηγορίες της πηγής. Τα field selectors παρακάτω σου επιτρέπουν να σπάσεις το refresh ανά κανάλι.
                            </p>
                          </div>
                          <div className="cms-refresh-panel__actions">
                            <Button
                              type="button"
                              variant="outline-primary"
                              onClick={() => void handleRefreshFromSources()}
                              disabled={refreshingFromSource || !formState.barcode.trim()}
                            >
                              {refreshingFromSource
                                ? 'Ανανέωση...'
                                : manualRefreshOverrideCount
                                  ? 'Ανανέωση επιλεγμένων πηγών'
                                  : 'Ανανέωση από πηγές'}
                            </Button>
                          </div>
                        </div>
                        <div className="cms-refresh-source-grid">
                          {SOURCE_SELECTION_FIELDS.map((field) => (
                            <div key={`manual-${field.key}`} className="cms-refresh-source-card">
                              <label className="cms-refresh-source-card__label">{field.label}</label>
                              <Form.Select
                                className="cms-item-form-select"
                                value={manualRefreshSources[field.key]}
                                disabled={refreshingFromSource}
                                onChange={(event) =>
                                  setManualRefreshSources((prev) => ({
                                    ...prev,
                                    [field.key]: event.target.value,
                                  }))
                                }
                              >
                                {SOURCE_FIELD_OPTIONS.map((option) => (
                                  <option key={`${field.key}-${option.value || 'auto'}`} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </Form.Select>
                              <div className="cms-refresh-source-card__helper">{field.helper}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {sourceRefreshResult ? (
                    <Alert variant="success" className="mb-3">
                      Η φόρμα ενημερώθηκε από <strong>{sourceRefreshResult.source_name}</strong>.
                      {sourceRefreshResult.product_link ? (
                        <>
                          {' '}
                          <a href={sourceRefreshResult.product_link} target="_blank" rel="noreferrer">
                            Άνοιγμα σελίδας πηγής
                          </a>
                        </>
                      ) : null}
                      {sourceRefreshResult.resolved_category_path?.length ? (
                        <div className="mt-2 text-muted">
                          Διαδρομή κατηγορίας: {sourceRefreshResult.resolved_category_path.join(' / ')}
                        </div>
                      ) : null}
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        <span className="cms-item-chip">Κείμενο: {sourceRefreshResult.text_source_name || sourceRefreshResult.source_name || '-'}</span>
                        <span className="cms-item-chip">Εικόνες: {sourceRefreshResult.image_source_name || sourceRefreshResult.source_name || '-'}</span>
                        <span className="cms-item-chip">Κατηγορίες: {sourceRefreshCategorySource}</span>
                      </div>
                      {sourceRefreshCategoryLabel ? <div className="mt-2 text-muted">{sourceRefreshCategoryLabel}</div> : null}
                    </Alert>
                  ) : null}
                  {formError ? <Alert variant="danger" className="mb-3">{formError}</Alert> : null}
                  <Form.Control
                    required
                    className="mb-3 cms-item-form-control"
                    size="lg"
                    value={formState.title}
                    onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="Τίτλος προϊόντος"
                  />

                  <div className="cms-item-details-submeta">
                    <span className="cms-item-chip">Barcode: {detailValue(formState.barcode)}</span>
                    <span className="cms-item-chip">Κωδικός: {detailValue(formState.code)}</span>
                    <span className="cms-item-chip">SKU: {detailValue(formState.sku)}</span>
                    {editCategoryPath.length ? <span className="cms-item-chip">{editCategoryPath.join(' / ')}</span> : null}
                  </div>

                  <div className="cms-item-form-grid">
                    <div>
                      <label className="cms-item-form-label">Κατηγορία 1</label>
                      <Form.Select
                        className="cms-item-form-select"
                        value={formState.category_1_id}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            category_1_id: event.target.value,
                            category_2_id: '',
                            category_3_id: '',
                          }))
                        }
                      >
                        <option value="">Μη ορισμένη</option>
                        {category1Options.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </Form.Select>
                    </div>
                    <div>
                      <label className="cms-item-form-label">Κατηγορία 2</label>
                      <Form.Select
                        className="cms-item-form-select"
                        value={formState.category_2_id}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            category_2_id: event.target.value,
                            category_3_id: '',
                          }))
                        }
                        disabled={!formState.category_1_id}
                      >
                        <option value="">Μη ορισμένη</option>
                        {category2Options.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </Form.Select>
                    </div>
                    <div>
                      <label className="cms-item-form-label">Κατηγορία 3</label>
                      <Form.Select
                        className="cms-item-form-select"
                        value={formState.category_3_id}
                        onChange={(event) =>
                          setFormState((prev) => ({
                            ...prev,
                            category_3_id: event.target.value,
                          }))
                        }
                        disabled={!formState.category_2_id}
                      >
                        <option value="">Μη ορισμένη</option>
                        {category3Options.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </Form.Select>
                    </div>
                    <div>
                      <label className="cms-item-form-label">Κατάσταση</label>
                      <Form.Select className="cms-item-form-select" value={formState.status} onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value as 'active' | 'inactive' }))}>
                        <option value="active">Ενεργό</option>
                        <option value="inactive">Ανενεργό</option>
                      </Form.Select>
                    </div>
                    <div>
                      <label className="cms-item-form-label">Κωδικός</label>
                      <Form.Control className="cms-item-form-control" value={formState.code} onChange={(event) => setFormState((prev) => ({ ...prev, code: event.target.value }))} />
                    </div>
                    <div>
                      <label className="cms-item-form-label">SKU</label>
                      <Form.Control className="cms-item-form-control" value={formState.sku} onChange={(event) => setFormState((prev) => ({ ...prev, sku: event.target.value }))} />
                    </div>
                    <div>
                      <label className="cms-item-form-label">Barcode</label>
                      <Form.Control required className="cms-item-form-control" value={formState.barcode} onChange={(event) => setFormState((prev) => ({ ...prev, barcode: event.target.value }))} />
                    </div>
                    <div>
                      <label className="cms-item-form-label">Μάρκα</label>
                      <Form.Control className="cms-item-form-control" value={formState.brand} onChange={(event) => setFormState((prev) => ({ ...prev, brand: event.target.value }))} />
                    </div>
                    <div>
                      <label className="cms-item-form-label">Μονάδα</label>
                      <Form.Control className="cms-item-form-control" value={formState.unit} onChange={(event) => setFormState((prev) => ({ ...prev, unit: event.target.value }))} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label className="cms-item-form-label">Κύρια εικόνα</label>
                      <Form.Control className="cms-item-form-control" value={formState.main_image} onChange={(event) => setFormState((prev) => ({ ...prev, main_image: event.target.value }))} placeholder="https://..." />
                    </div>
                  </div>
                </div>
              </div>

              <div className="cms-item-details-section">
                <div className="cms-item-details-section-title">Κατηγορίες</div>
                <div className="cms-item-edit-meta-grid">
                  {editCategoryLevels.map((category) => (
                    <div key={category.label} className="cms-item-edit-meta-card">
                      <strong>{category.label}</strong>
                      <div>{detailValue(category.value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cms-item-details-section">
                <div className="cms-item-details-section-title">Έλεγχος ενεργοποίησης</div>
                <div className="cms-item-edit-meta-grid">
                  <div className="cms-item-edit-meta-card">
                    <strong>Πρόχειρη ποιότητα</strong>
                    <div>{qualityStateBadge(editDraftQuality.qualityState)}</div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Δημόσια εικόνα API</strong>
                    <div>{editDraftQuality.publicImageEnabled ? 'Ορατή' : 'Κρυφή'}</div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Κείμενο</strong>
                    <div>{editDraftQuality.hasText ? 'Ολοκληρωμένο' : 'Λείπει'}</div>
                    <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
                      {textProvenanceBadge(editingItem)}
                      <span>{textProvenanceLabel(editingItem)}</span>
                    </div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Κατηγορία</strong>
                    <div>{editDraftQuality.hasCategory ? 'Ολοκληρωμένη' : 'Λείπει'}</div>
                    <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
                      {categoryProvenanceBadge(editingItem)}
                      <span>{categoryProvenanceLabel(editingItem)}</span>
                    </div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Πηγή εικόνας</strong>
                    <div>{editDraftQuality.hasAnyImage ? 'Ολοκληρωμένο' : 'Λείπει'}</div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Λείποντα</strong>
                    <div>
                      {editDraftQuality.missingRequirements.length
                        ? editDraftQuality.missingRequirements.map((code) => missingRequirementLabel(code, language)).join(', ')
                        : tx('None', 'Κανένα')}
                    </div>
                  </div>
                </div>
                <div className="cms-item-muted-note mt-3">
                  Το quality state ξαναϋπολογίζεται στο save. Αν το item μείνει inactive αλλά γίνει πλήρες, μπαίνει προσωρινά στο Review Queue για τελικό έλεγχο.
                </div>
              </div>

              <div className="cms-item-details-section">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                  <div>
                    <div className="cms-item-details-section-title mb-1">Περιγραφή</div>
                    <div className="cms-item-muted-note">Επεξεργασία σε HTML με live preview.</div>
                  </div>
                </div>
                <div className="cms-item-toolbar">
                  <Button type="button" variant="outline-primary" onClick={applyDescriptionAutoFormat}>
                    Αυτόματη μορφοποίηση
                  </Button>
                  <Button type="button" variant="outline-secondary" onClick={insertDescriptionTemplate}>
                    Εισαγωγή template προϊόντος
                  </Button>
                </div>
                <Row className="g-3">
                  <Col lg={6}>
                    <label className="cms-item-form-label">Πηγή HTML</label>
                    <Form.Control
                      as="textarea"
                      rows={15}
                      className="cms-item-html-editor"
                      value={formState.description_html}
                      onChange={(event) => setFormState((prev) => ({ ...prev, description_html: event.target.value }))}
                    />
                  </Col>
                  <Col lg={6}>
                    <label className="cms-item-form-label">Προεπισκόπηση</label>
                    <div className="cms-item-html-preview">
                      {descriptionPreviewHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: descriptionPreviewHtml }} />
                      ) : (
                        <div className="text-muted">Δεν υπάρχει ακόμη περιγραφή σε HTML.</div>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="cms-item-details-section">
                <div className="cms-item-details-section-title">Μεταδεδομένα</div>
                <div className="cms-item-edit-meta-grid">
                  <div className="cms-item-edit-meta-card">
                    <strong>Δημιουργήθηκε</strong>
                    <div>{editingItem ? formatDate(editingItem.created_at) : '-'}</div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Ενημερώθηκε</strong>
                    <div>{editingItem ? formatDate(editingItem.updated_at) : '-'}</div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Slug</strong>
                    <div>{editingItem ? detailValue(editingItem.slug) : '-'}</div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Δημιουργήθηκε από</strong>
                    <div>{editingItem ? detailValue(editingItem.created_by) : '-'}</div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Ενημερώθηκε από</strong>
                    <div>{editingItem ? detailValue(editingItem.updated_by) : '-'}</div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Τρόπος περιγραφής</strong>
                    <div>{formState.description_html.trim() ? 'HTML μορφοποιημένο' : 'Κενό'}</div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {editingItem ? (
              <Button variant="outline-danger" onClick={() => void handleDeleteItem()} disabled={submitting || refreshingFromSource}>
                Διαγραφή είδους
              </Button>
            ) : null}
            <Button variant="light" onClick={closeFormModal}>Ακύρωση</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Αποθήκευση...' : editingItem ? 'Αποθήκευση αλλαγών' : 'Δημιουργία είδους'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDetailsModal} onHide={closeDetails} size="xl" centered dialogClassName="cms-item-details-modal modal-dialog-scrollable">
        <Modal.Header closeButton>
          <div className="d-flex flex-column gap-1">
            <Modal.Title>{detailsItem?.title || 'Λεπτομέρειες είδους'}</Modal.Title>
            {detailsItem ? (
              <div className="d-flex align-items-center flex-wrap gap-2 fs-12 text-muted">
                <span>Barcode: {detailValue(detailsItem.barcode)}</span>
                <span>Κωδικός: {detailValue(detailsItem.code)}</span>
                {statusBadge(detailsItem.status)}
              </div>
            ) : null}
          </div>
        </Modal.Header>
        <Modal.Body>
          {detailsLoading ? (
            <Spinner animation="border" size="sm" />
          ) : detailsItem ? (
            <div className="cms-item-details-shell">
              <div className="cms-item-details-hero">
                <div className="cms-item-details-media-panel">
                  <div className="cms-item-details-kicker">Πολυμέσα προϊόντος</div>
                  {selectedImage ? (
                    <>
                      <button
                        type="button"
                        className="cms-item-details-main-image w-100"
                        style={{ cursor: 'zoom-in' }}
                        onClick={() => openImageZoom(selectedImage)}
                      >
                        <img src={selectedImage} alt={detailsItem.title} />
                      </button>
                      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                        <span className="text-muted fs-13">
                          {detailsImages.length} image(s) available
                        </span>
                        <Button variant="outline-secondary" size="sm" onClick={() => openImageZoom(selectedImage)}>
                          Zoom
                        </Button>
                      </div>
                      {detailsImages.length > 1 ? (
                        <div className="cms-item-thumb-grid">
                          {detailsImages.map((imageUrl, index) => (
                            <button
                              key={`${imageUrl}-${index}`}
                              type="button"
                              className={`cms-item-thumb ${imageUrl === selectedImage ? 'is-active' : ''}`}
                              onClick={() => setSelectedImage(imageUrl)}
                            >
                              <img src={imageUrl} alt={`${detailsItem.title} ${index + 1}`} />
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="text-muted">Δεν υπάρχει κύρια εικόνα.</div>
                  )}
                </div>

                <div className="cms-item-details-summary-panel">
                  <div className="cms-item-details-kicker">Σύνοψη προϊόντος</div>
                  <h2 className="cms-item-details-title">{detailValue(detailsItem.title)}</h2>
                  <div className="cms-item-details-submeta">
                    <span className="cms-item-chip">Barcode: {detailValue(detailsItem.barcode)}</span>
                    <span className="cms-item-chip">Κωδικός: {detailValue(detailsItem.code)}</span>
                    <span className="cms-item-chip">SKU: {detailValue(detailsItem.sku)}</span>
                    <span className="cms-item-chip">{detailValue(detailsItem.category_name || categoryNameById.get(detailsItem.category_id) || '')}</span>
                  </div>
                  {canApproveGoLive(detailsItem) ? (
                    <div className="mt-3">
                      <Button
                        variant="success"
                        disabled={approvingItemId === detailsItem.id}
                        onClick={() => void handleApproveGoLive(detailsItem)}
                      >
                        {approvingItemId === detailsItem.id ? 'Έγκριση...' : 'Έγκριση δημοσίευσης'}
                      </Button>
                    </div>
                  ) : null}

                  <div className="cms-item-details-grid">
                    <div className="cms-item-stat">
                      <div className="cms-item-stat-label">Κατάσταση</div>
                      <div className="cms-item-stat-value">{statusBadge(detailsItem.status)}</div>
                    </div>
                    <div className="cms-item-stat">
                      <div className="cms-item-stat-label">Μάρκα</div>
                      <div className="cms-item-stat-value">{detailValue(detailsItem.brand)}</div>
                    </div>
                    <div className="cms-item-stat">
                      <div className="cms-item-stat-label">Μονάδα</div>
                      <div className="cms-item-stat-value">{detailValue(detailsItem.unit)}</div>
                    </div>
                    <div className="cms-item-stat">
                      <div className="cms-item-stat-label">Slug</div>
                      <div className="cms-item-stat-value">{detailValue(detailsItem.slug)}</div>
                    </div>
                    <div className="cms-item-stat">
                      <div className="cms-item-stat-label">Δημιουργήθηκε από</div>
                      <div className="cms-item-stat-value">{detailValue(detailsItem.created_by)}</div>
                    </div>
                    <div className="cms-item-stat">
                      <div className="cms-item-stat-label">Ενημερώθηκε από</div>
                      <div className="cms-item-stat-value">{detailValue(detailsItem.updated_by)}</div>
                    </div>
                    <div className="cms-item-stat">
                      <div className="cms-item-stat-label">Τρόπος περιγραφής</div>
                      <div className="cms-item-stat-value">{detailsItem.description_html ? 'HTML μορφοποιημένο' : 'Απλό κείμενο (fallback)'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cms-item-details-section">
                <div className="cms-item-details-section-title">Κατηγορίες</div>
                <div className="cms-item-edit-meta-grid">
                  {detailsCategoryLevels.map((category) => (
                    <div key={category.label} className="cms-item-edit-meta-card">
                      <strong>{category.label}</strong>
                      <div>{detailValue(category.value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cms-item-details-section">
                <div className="cms-item-details-section-title">Έλεγχος ενεργοποίησης</div>
                <div className="cms-item-edit-meta-grid">
                  <div className="cms-item-edit-meta-card">
                    <strong>Κατάσταση ποιότητας</strong>
                    <div>{qualityStateBadge(detailsItem.catalog_quality_state)}</div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Δημόσια εικόνα API</strong>
                    <div>{detailsItem.catalog_public_image_enabled ? 'Ορατή' : 'Κρυφή'}</div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Κείμενο</strong>
                    <div>{detailsItem.catalog_has_text ? 'Ολοκληρωμένο' : 'Λείπει'}</div>
                    <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
                      {textProvenanceBadge(detailsItem)}
                      <span>{textProvenanceLabel(detailsItem)}</span>
                    </div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Κατηγορία</strong>
                    <div>{detailsItem.catalog_has_category ? 'Ολοκληρωμένη' : 'Λείπει'}</div>
                    <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
                      {categoryProvenanceBadge(detailsItem)}
                      <span>{categoryProvenanceLabel(detailsItem)}</span>
                    </div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Πηγή εικόνας</strong>
                    <div>{detailsItem.catalog_has_any_image ? 'Ολοκληρωμένο' : 'Λείπει'}</div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Προέλευση φωτογραφίας</strong>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      {photoSourceLockBadge(detailsItem)}
                      <span>{photoSourceLockLabel(detailsItem)}</span>
                    </div>
                  </div>
                  <div className="cms-item-edit-meta-card">
                    <strong>Λείποντα</strong>
                    <div>
                      {detailsItem.catalog_missing_requirements?.length
                        ? detailsItem.catalog_missing_requirements.map((code) => missingRequirementLabel(code, language)).join(', ')
                        : tx('None', 'Κανένα')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="cms-item-details-section">
                <div className="cms-item-details-section-title">Περιγραφή</div>
                {itemDescriptionHtml(detailsItem) ? (
                  <div
                    className="cms-item-description-body"
                    dangerouslySetInnerHTML={{ __html: itemDescriptionHtml(detailsItem) }}
                  />
                ) : (
                  <div className="text-muted">Δεν υπάρχει περιγραφή.</div>
                )}
              </div>

              <div className="cms-item-details-section">
                <div className="cms-item-details-section-title">Μεταδεδομένα</div>
                <div className="cms-item-metadata-list">
                  <div className="cms-item-meta-row">
                    <strong>Δημιουργήθηκε</strong>
                    <div>{formatDate(detailsItem.created_at)}</div>
                  </div>
                  <div className="cms-item-meta-row">
                    <strong>Ενημερώθηκε</strong>
                    <div>{formatDate(detailsItem.updated_at)}</div>
                  </div>
                  <div className="cms-item-meta-row">
                    <strong>Διαδρομή κατηγορίας</strong>
                    <div>{detailValue(detailsItem.category_name || categoryNameById.get(detailsItem.category_id) || '')}</div>
                  </div>
                  <div className="cms-item-meta-row">
                    <strong>Κύρια εικόνα</strong>
                    <div>{detailsItem.main_image ? 'Διαθέσιμη' : 'Λείπει'}</div>
                  </div>
                  <div className="cms-item-meta-row">
                    <strong>Ελέγχθηκε</strong>
                    <div>{detailsItem.catalog_reviewed_at ? formatDate(detailsItem.catalog_reviewed_at) : '-'}</div>
                  </div>
                  <div className="cms-item-meta-row">
                    <strong>Ελέγχθηκε από</strong>
                    <div>{detailValue(detailsItem.catalog_reviewed_by)}</div>
                  </div>
                </div>
              </div>

              <div className="cms-item-details-section">
                <div className="cms-item-details-section-title">Ιστορικό αλλαγών</div>
                <Table responsive className="table table-striped mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Τύπος</th>
                      <th>Πεδίο</th>
                      <th>Προεπισκόπηση</th>
                      <th>Αλλαγή από</th>
                      <th>Πότε</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailsChanges.length ? (
                      detailsChanges.map((change) => (
                        <tr key={change.id}>
                          <td>{change.change_type || '-'}</td>
                          <td>{change.field_name || '-'}</td>
                          <td className="text-muted fs-12">{change.new_value_preview || change.old_value_preview || '-'}</td>
                          <td>{change.changed_by || '-'}</td>
                          <td>{formatDate(change.created_at)}</td>
                        </tr>
                      ))
                    ) : (
                        <tr>
                        <td colSpan={5} className="text-center text-muted py-4">Δεν υπάρχει ιστορικό αλλαγών.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-muted">Δεν έχει επιλεγεί είδος.</div>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={showImageZoomModal}
        onHide={() => setShowImageZoomModal(false)}
        size="xl"
        centered
        dialogClassName="modal-dialog-scrollable"
      >
        <Modal.Header closeButton>
          <div className="d-flex align-items-center justify-content-between w-100 gap-3 flex-wrap">
            <Modal.Title>Μεγέθυνση εικόνας</Modal.Title>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" size="sm" onClick={() => setImageZoomScale((current) => zoomClamp(current - 0.25))}>
                -
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={() => setImageZoomScale(1)}>
                Επαναφορά
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={() => setImageZoomScale((current) => zoomClamp(current + 0.25))}>
                +
              </Button>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: 540, background: '#f5f7fb', overflow: 'auto' }}
        >
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={detailsItem?.title || 'Zoomed item image'}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                transform: `scale(${imageZoomScale})`,
                transition: 'transform 0.15s ease-out',
                transformOrigin: 'center center',
              }}
            />
          ) : (
            <div className="text-muted">Δεν έχει επιλεγεί εικόνα.</div>
          )}
        </Modal.Body>
      </Modal>
    </ModulePage>
  );
}
