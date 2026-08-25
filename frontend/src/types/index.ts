export type CmsRole = 'super_admin' | 'admin' | 'editor' | 'client';

export interface CmsUser {
  id: string;
  email: string;
  full_name: string;
  role: CmsRole;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  permissions?: CmsPermission[];
}

export interface CmsAdminUser {
  id: string;
  email: string;
  full_name: string;
  role: CmsRole;
  is_active: boolean;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
  password_reset_required?: boolean;
  failed_login_count?: number;
  locked_until?: string | null;
  is_locked?: boolean;
}

export interface CmsAuthResponse {
  success: boolean;
  user: CmsUser;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  reset_token?: string;
  expires_in_minutes?: number;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedApiSuccessResponse<T> extends ApiSuccessResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export type CmsModuleKey =
  | 'dashboard'
  | 'server'
  | 'sources'
  | 'items'
  | 'items_fix_queue'
  | 'items_review_queue'
  | 'items_by_category'
  | 'categories'
  | 'clients'
  | 'customer_remarks'
  | 'missing_barcodes'
  | 'brand_queue'
  | 'duplicates'
  | 'users'
  | 'roles'
  | 'notifications'
  | 'audit_log'
  | 'settings';

export type CmsPermission =
  | 'dashboard.view'
  | 'server.view'
  | 'sources.view'
  | 'sources.update'
  | 'sources.run'
  | 'items.view'
  | 'items.create'
  | 'items.update'
  | 'items.delete'
  | 'categories.view'
  | 'categories.create'
  | 'categories.update'
  | 'categories.delete'
  | 'clients.view'
  | 'clients.create'
  | 'clients.update'
  | 'clients.delete'
  | 'missing_barcodes.view'
  | 'missing_barcodes.update'
  | 'brand_queue.view'
  | 'brand_queue.update'
  | 'duplicates.view'
  | 'duplicates.update'
  | 'users.view'
  | 'users.create'
  | 'users.update'
  | 'users.delete'
  | 'roles.view'
  | 'roles.create'
  | 'roles.update'
  | 'roles.delete'
  | 'notifications.view'
  | 'notifications.publish'
  | 'audit.view'
  | 'settings.view'
  | 'settings.update';

export interface CmsCategory {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  level?: number;
  path?: string[];
  category_1?: string;
  category_2?: string;
  category_3?: string;
  items_count: number;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface CmsCategoryPayload {
  parent_id?: string | null;
  name: string;
  slug?: string;
  description?: string;
  is_active: boolean;
}

export interface CmsItem {
  id: string;
  title: string;
  slug: string;
  code: string;
  sku: string;
  barcode: string;
  description: string;
  description_html?: string;
  brand: string;
  unit: string;
  status: 'active' | 'inactive';
  main_image: string;
  image_urls: string[];
  category_id: string;
  category_name: string;
  category_path?: string[];
  category_1?: string;
  category_2?: string;
  category_3?: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  catalog_quality_state?: 'ready' | 'needs_fix' | 'ready_for_review' | string;
  catalog_missing_requirements?: string[];
  catalog_ready_for_activation?: boolean;
  catalog_review_required?: boolean;
  catalog_reviewed_at?: string;
  catalog_reviewed_by?: string;
  catalog_has_hosted_image?: boolean;
  catalog_has_any_image?: boolean;
  catalog_has_text?: boolean;
  catalog_has_category?: boolean;
  catalog_public_image_enabled?: boolean;
  catalog_image_visibility?: 'hosted' | 'disabled_external' | 'missing' | string;
  photo_source_locked?: boolean;
  photo_source_lock?: string;
  image_source_domain?: string;
  text_source_domain?: string;
  category_source_domain?: string;
  category_resolution_source?: 'barcode_lookup' | 'source' | 'existing' | 'none' | string;
}

export interface CmsItemPayload {
  category_id?: string | null;
  title: string;
  slug?: string;
  code?: string;
  sku?: string;
  barcode: string;
  description?: string;
  description_html?: string;
  brand?: string;
  unit?: string;
  status: 'active' | 'inactive';
  main_image?: string;
}

export interface CmsItemSourceRefreshResult {
  source_name: string;
  text_source_name?: string;
  image_source_name?: string;
  category_source_name?: string;
  product_link: string;
  category_resolution_source?: 'barcode_lookup' | 'source' | 'existing' | 'none' | string;
  resolved_category_path?: string[];
  existing_category_path?: string[];
  category_improved?: boolean;
  image_improved?: boolean;
  text_improved?: boolean;
  any_improvement?: boolean;
  item: CmsItem;
}

export interface CmsBulkRefreshPayload {
  search?: string;
  status_filter?: 'all' | 'active' | 'inactive';
  quality_state_filter?: 'all' | 'ready' | 'needs_fix' | 'ready_for_review';
  missing_requirement?: 'all' | 'missing_any_image' | 'missing_text' | 'missing_category';
  photo_source_filter?: 'all' | 'youpharmacy_xml' | 'pharmacy295_excel';
  category_1?: string;
  category_2?: string;
  category_3?: string;
  source_key?: string;
  text_source_key?: string;
  image_source_key?: string;
  category_source_key?: string;
  limit?: number;
}

export interface CmsBulkRefreshStartResult {
  matched_total: number;
  limit: number;
  job_start: {
    started: boolean;
    already_running: boolean;
    pid: number;
    log_path: string;
    elapsed_human?: string;
  };
  job: CmsSourceJob | null;
}

export interface CmsBulkRefreshStopResult {
  stopped: boolean;
  already_stopped: boolean;
  pid: number;
  log_path: string;
}

export interface CmsBulkRefreshCancelResult {
  stopped: boolean;
  already_stopped: boolean;
  pid: number;
  log_path: string;
}

export interface CmsBulkRefreshRestartResult {
  stop_result: CmsBulkRefreshStopResult;
  start_result: {
    started: boolean;
    already_running: boolean;
    pid: number;
    log_path: string;
    elapsed_human?: string;
  };
}

export interface CmsProxySettings {
  enabled: boolean;
  url: string;
  username: string;
  password_configured: boolean;
  configured: boolean;
  effective_proxy_url: string;
  updated_at: string;
  updated_by: string;
}

export interface CmsApiSettings {
  products_enabled: boolean;
  products_internal_enabled: boolean;
  endpoints: CmsApiEndpoint[];
  products_fields: string[];
  products_internal_fields: string[];
  field_registry: string[];
  updated_at: string;
  updated_by: string;
}

export interface CmsApiEndpoint {
  key: string;
  label: string;
  path: string;
  enabled: boolean;
  public_only: boolean;
  include_internal_fields: boolean;
  allow_external_image_urls: boolean;
  fields: string[];
}

export interface CmsMailSettings {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_from: string;
  starttls: boolean;
  password_configured: boolean;
  configured: boolean;
  updated_at: string;
  updated_by: string;
}

export interface CmsImageProcessingSettings {
  watermark_cleanup_enabled: boolean;
  effective_watermark_cleanup_enabled: boolean;
  updated_at: string;
  updated_by: string;
}

export interface CmsXmlConfiguredClient {
  domain: string;
  function_name: string;
  company: string;
  solution_type: string;
  enabled: boolean;
  updated_at: string;
  updated_by: string;
}

export interface CmsXmlOutputFile {
  name: string;
  url: string;
}

export interface CmsXmlOutputGroup {
  domain: string;
  files: CmsXmlOutputFile[];
}

export interface CmsXmlRunResult {
  domain: string;
  file: string;
  files?: string[];
  generated_products: number;
  total_products: number;
}

export interface CmsXmlRunError {
  domain: string;
  error: string;
}

export interface CmsXmlLastRun {
  status: string;
  started_at: string;
  finished_at: string;
  message: string;
  requested_domain: string;
  requested_domains: string[];
  mode: string;
  cron_time: string;
  results: CmsXmlRunResult[];
  errors: CmsXmlRunError[];
}

export interface CmsXmlSettings {
  enabled: boolean;
  service_url: string;
  public_base_url: string;
  updated_at: string;
  updated_by: string;
  service_reachable: boolean;
  service_error: string;
  service_running: boolean;
  configured_clients: CmsXmlConfiguredClient[];
  outputs: CmsXmlOutputGroup[];
  last_run: CmsXmlLastRun;
}

export interface CmsSettingsData {
  proxy: CmsProxySettings;
  api: CmsApiSettings;
  mail: CmsMailSettings;
  image_processing: CmsImageProcessingSettings;
  xml: CmsXmlSettings;
  api_clients: CmsClient[];
}

export interface CmsItemChange {
  id: string;
  item_id: string;
  change_type: string;
  field_name: string;
  old_value: unknown;
  new_value: unknown;
  old_value_preview?: string;
  new_value_preview?: string;
  changed_by: string;
  created_at: string;
}

export interface CmsItemFilterCategory {
  key: string;
  label: string;
  path: string[];
  count: number;
}

export interface CmsTaxonomyFilterOption {
  value: string;
  count: number;
}

export interface CmsItemTaxonomyFilters {
  category_1: CmsTaxonomyFilterOption[];
  category_2: CmsTaxonomyFilterOption[];
  category_3: CmsTaxonomyFilterOption[];
}

export interface CmsItemQualitySummary {
  total_items: number;
  ready: number;
  needs_fix: number;
  missing_text: number;
  missing_category: number;
  missing_any_image: number;
}

export interface DashboardMetrics {
  total_items: number;
  active_items: number;
  inactive_items: number;
  total_categories: number;
  active_clients: number;
  pending_notifications: number;
  pending_brand_queue: number;
  pending_missing_barcodes: number;
  watermark_dead_ends: number;
  missing_hosted_image: number;
  pending_duplicates: number;
}

export interface DashboardActivityEntry {
  id: string;
  created_at: string;
}

export interface DashboardItemChange extends DashboardActivityEntry {
  item_id: string;
  change_type: string;
  field_name: string;
  changed_by: string;
  new_value_preview: string;
}

export interface DashboardUserActivity extends DashboardActivityEntry {
  user_id: string;
  user_email?: string;
  user_name?: string;
  entity_type: string;
  entity_id: string;
  action: string;
  metadata: unknown;
}

export interface DashboardRecentItem {
  id: string;
  title: string;
  code: string;
  barcode: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardCategoryCount {
  category: string;
  count: number;
}

export interface DashboardTimelinePoint {
  date: string;
  count: number;
}

export interface CmsDashboardOverview {
  metrics: DashboardMetrics;
  recent_item_changes: DashboardItemChange[];
  recent_user_activity: DashboardUserActivity[];
  recent_added_items: DashboardRecentItem[];
  items_by_category: DashboardCategoryCount[];
  items_added_last_30_days: DashboardTimelinePoint[];
}

export interface CmsSourceCapability {
  key: string;
  label: string;
  enabled: boolean;
}

export interface CmsSourceFieldCoverage {
  title: number;
  short_title: number;
  description: number;
  brand: number;
  category_tree: number;
  source_image: number;
}

export interface CmsSourceOverview {
  key: string;
  label: string;
  base_url: string;
  search_pattern: string;
  priority: number;
  text_priority: number;
  image_priority: number;
  enabled_in_chain: boolean;
  removed: boolean;
  removed_at: string;
  removed_by: string;
  use_flaresolverr: boolean;
  preserves_existing_products: boolean;
  access_status: string;
  runtime_control_enabled: boolean;
  products_in_db: number;
  hosted_images_count: number;
  multiple_images_count: number;
  watermark_cleaned_count: number;
  field_coverage: CmsSourceFieldCoverage;
  capabilities: CmsSourceCapability[];
  notes: string[];
  jobs: CmsSourceJob[];
}

export interface CmsSourceJob {
  key: string;
  label: string;
  description: string;
  running: boolean;
  status: string;
  pid: number;
  elapsed_seconds: number;
  elapsed_human: string;
  log_path: string;
  last_started_at: string;
  last_finished_at: string;
  last_exit_code: number | null;
  last_message: string;
  matched_total?: number;
  selected_total?: number;
  processed?: number;
  updated?: number;
  skipped?: number;
  failed?: number;
  last_barcode?: string;
  last_item_id?: string;
  upload?: CmsSourceJobUpload | null;
}

export interface CmsSourceJobUpload {
  required: boolean;
  label: string;
  accept: string;
  has_file: boolean;
  file_name: string;
  file_path: string;
  uploaded_at: string;
  size_bytes: number;
  product_count: number;
  image_rows: number;
}

export interface CmsOtherDetectedSource {
  key: string;
  label: string;
  products_in_db: number;
  hosted_images_count: number;
  multiple_images_count: number;
}

export interface CmsSourcesOverview {
  proxy_configured: boolean;
  source_chain: string[];
  text_source_chain: string[];
  image_source_chain: string[];
  totals: {
    tracked_sources: number;
    removed_sources_count?: number;
    products_in_db: number;
    hosted_images_count: number;
    multiple_images_count: number;
    watermark_cleaned_count: number;
    other_detected_sources_count: number;
  };
  sources: CmsSourceOverview[];
  other_detected_sources: CmsOtherDetectedSource[];
}

export interface CmsSourceSettingsPayload {
  enabled?: boolean;
  removed?: boolean;
  priority?: number;
  text_priority?: number;
  image_priority?: number;
  use_flaresolverr?: boolean;
}

export interface CmsSourceRunResponse {
  source: CmsSourceOverview;
  job: CmsSourceJob;
  job_start: {
    started: boolean;
    already_running: boolean;
    pid: number;
    log_path: string;
    elapsed_human?: string;
  };
}

export interface CmsServerDiskUsage {
  path: string;
  total_bytes: number;
  used_bytes: number;
  free_bytes: number;
  used_percent: number;
}

export interface CmsServerJob {
  pid: number;
  name: string;
  elapsed_seconds: number;
  elapsed_human: string;
  cpu_percent: number;
  memory_percent: number;
  command: string;
}

export interface CmsServerProcess {
  pid: number;
  cpu_percent: number;
  memory_percent: number;
  command: string;
}

export interface CmsServerOverview {
  captured_at: string;
  hostname: string;
  python_version: string;
  cpu_count: number;
  load_average: {
    load_1: number;
    load_5: number;
    load_15: number;
    per_cpu_1: number;
  };
  uptime: {
    system_seconds: number;
    system_human: string;
    app_seconds: number;
    app_human: string;
  };
  memory: {
    total_bytes: number;
    available_bytes: number;
    used_bytes: number;
    used_percent: number;
  };
  disks: CmsServerDiskUsage[];
  mongo: {
    ok: boolean;
    latency_ms: number;
    error: string;
  };
  app_collections: {
    products: number;
    cms_categories: number;
    cms_clients: number;
    cms_audit_logs: number;
  };
  background_jobs: CmsServerJob[];
  top_processes: CmsServerProcess[];
}

export type CmsClientSubscriptionMode = 'all_categories' | 'selected_categories';
export type CmsXmlSolutionType = 'site' | 'no_site' | '';

export interface CmsAssignedCategory {
  id: string;
  name: string;
}

export interface CmsClientImageServiceConfig {
  enabled: boolean;
}

export interface CmsClientXmlServiceConfig {
  enabled: boolean;
  domain: string;
  solution_type: CmsXmlSolutionType;
  function_name: string;
  company: string;
  whouse: string;
  api_key: string;
  site_xml: string;
  old_id_field: string;
  product_url_base: string;
  image_url_base: string;
  photo_root: string;
  default_category: string;
  shopflix_category: string;
  softone_distribution_channels: string;
  require_web_item: boolean;
}

export interface CmsClientServices {
  image_service: CmsClientImageServiceConfig;
  xml_service: CmsClientXmlServiceConfig;
}

export interface CmsClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  is_active: boolean;
  receive_all_categories: boolean;
  subscription_mode: CmsClientSubscriptionMode;
  notes: string;
  category_ids: string[];
  assigned_categories: CmsAssignedCategory[];
  assigned_categories_count: number;
  services: CmsClientServices;
  is_trial: boolean;
  trial_mode: 'whitelist' | 'quota' | string;
  trial_max_requests: number;
  trial_barcodes: string[];
  webhook_url: string;
  webhook_secret: string;
  webhook_events: string[];
  source_type: string;
  auth_provider: string;
  api_client_key: string;
  api_username: string;
  api_domain: string;
  api_request_count: number;
  password_configured: boolean;
  password_last_rotated_at: string;
  last_api_access_at: string;
  last_api_endpoint: string;
  last_api_ip: string;
  last_api_origin: string;
  last_api_referer: string;
  last_api_host: string;
  last_api_user_agent: string;
  last_api_barcodes_count: number;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  allowed_ips: string[];
}

export interface CmsApiClientCredentialsResult {
  data: CmsClient;
  credentials: {
    api_username: string;
    generated_password: string;
    email_sent: boolean;
  };
}

export interface CmsClientPayload {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  is_active: boolean;
  receive_all_categories: boolean;
  notes?: string;
  category_ids?: string[];
  services: CmsClientServices;
  is_trial?: boolean;
  trial_mode?: 'whitelist' | 'quota';
  trial_max_requests?: number;
  trial_barcodes?: string[];
  webhook_url?: string;
  webhook_secret?: string;
  allowed_ips?: string[];
}

export interface CmsAuditLog {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  entity_type: string;
  entity_id: string;
  action: string;
  metadata: unknown;
  metadata_preview: string;
  created_at: string;
}

export interface CmsNotificationEvent {
  id: string;
  item_id: string;
  category_id: string;
  category_name: string;
  event_type: string;
  channel?: 'catalog' | 'operations' | 'security';
  status: 'pending' | 'published';
  payload: Record<string, unknown>;
  payload_preview: string;
  item_title: string;
  item_code: string;
  item_barcode: string;
  created_at: string;
  published_at: string;
}

export interface CmsHeaderEvent {
  id: string;
  source: 'audit' | 'notification' | 'api_client' | 'customer_remark';
  kind: string;
  title: string;
  subtitle: string;
  status: string;
  created_at: string;
  route: string;
  item_id?: string;
}

export interface CmsCustomerRemark {
  id: string;
  item_id: string;
  item_barcode: string;
  item_title_snapshot: string;
  client_id: string;
  client_name_snapshot: string;
  client_email_snapshot: string;
  comment_text: string;
  comment_type: string;
  status: 'new' | 'under_review' | 'resolved';
  admin_response: string;
  resolution_note: string;
  created_at: string;
  updated_at: string;
  resolved_at: string;
  resolved_by: string;
}

export interface PortalClient {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  api_username: string;
  is_active: boolean;
  receive_all_categories: boolean;
  subscription_mode: 'all_categories' | 'selected_categories';
  category_ids: string[];
  assigned_categories?: Array<{
    id: string;
    label: string;
    level: number;
    category_1: string;
    category_2: string;
    category_3: string;
  }>;
  last_api_access_at?: string;
  last_api_endpoint?: string;
}

export interface PortalAuthResponse {
  success: boolean;
  client: PortalClient;
}

export interface PortalDashboardMetricSet {
  active_items: number;
  new_items_last_30_days: number;
  items_with_my_remarks: number;
  open_remarks: number;
}

export interface PortalDashboardRecentItem {
  id: string;
  title: string;
  code: string;
  barcode: string;
  updated_at: string;
}

export interface PortalDashboardCategoryCount {
  category: string;
  count: number;
}

export interface PortalDashboardOverview {
  metrics: PortalDashboardMetricSet;
  items_by_category: PortalDashboardCategoryCount[];
  recently_updated_items: PortalDashboardRecentItem[];
}

export interface PortalItem {
  id: string;
  title: string;
  slug: string;
  code: string;
  sku: string;
  barcode: string;
  description: string;
  description_html: string;
  brand: string;
  unit: string;
  status: 'active';
  main_image: string;
  image_urls: string[];
  category_id?: string | null;
  category_path: string[];
  category_1: string;
  category_2: string;
  category_3: string;
  created_at: string;
  updated_at: string;
  catalog_public_image_enabled: boolean;
  catalog_image_visibility: 'hosted' | 'hidden_external' | string;
}

export interface PortalCategorySummary {
  level: number;
  category_1: string;
  category_2: string;
  category_3: string;
  label: string;
  items_count: number;
}

export interface PortalComment {
  id: string;
  item_id: string;
  item_barcode: string;
  item_title_snapshot: string;
  comment_text: string;
  comment_type: string;
  status: 'new' | 'under_review' | 'resolved';
  admin_response: string;
  resolution_note: string;
  created_at: string;
  updated_at: string;
}
