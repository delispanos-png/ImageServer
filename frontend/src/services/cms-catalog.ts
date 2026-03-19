import { apiFetch } from './api';
import type {
  ApiSuccessResponse,
  CmsBulkRefreshPayload,
  CmsBulkRefreshCancelResult,
  CmsBulkRefreshRestartResult,
  CmsBulkRefreshStartResult,
  CmsBulkRefreshStopResult,
  CmsCategory,
  CmsCategoryPayload,
  CmsItem,
  CmsItemChange,
  CmsItemFilterCategory,
  CmsItemSourceRefreshResult,
  CmsItemTaxonomyFilters,
  CmsItemPayload,
  CmsSourceJob,
  PaginatedApiSuccessResponse,
} from '../types';

export interface CategoryListParams {
  search?: string;
  is_active?: string;
  parent_id?: string;
  category_1?: string;
  category_2?: string;
  category_3?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ItemListParams {
  search?: string;
  status_filter?: 'all' | 'active' | 'inactive';
  quality_state_filter?: 'all' | 'ready' | 'needs_fix' | 'ready_for_review';
  missing_requirement?: 'all' | 'missing_any_image' | 'missing_text' | 'missing_category';
  photo_source_filter?: 'all' | 'youpharmacy_xml' | 'pharmacy295_excel';
  category_id?: string;
  category_filter?: string;
  category_1?: string;
  category_2?: string;
  category_3?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

function buildQuery(params: Record<string, string | number | undefined> | CategoryListParams | ItemListParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  const encoded = query.toString();
  return encoded ? `?${encoded}` : '';
}

export async function fetchCategories(params: CategoryListParams = {}): Promise<CmsCategory[]> {
  const response = await apiFetch<ApiSuccessResponse<CmsCategory[]>>(
    `/cms/catalog/categories${buildQuery(params)}`,
  );
  return response.data;
}

export async function fetchCategoriesPage(params: CategoryListParams = {}) {
  return apiFetch<PaginatedApiSuccessResponse<CmsCategory>>(
    `/cms/catalog/categories${buildQuery(params)}`,
  );
}

export async function createCategory(payload: CmsCategoryPayload): Promise<CmsCategory> {
  const response = await apiFetch<ApiSuccessResponse<CmsCategory>>('/cms/catalog/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateCategory(categoryId: string, payload: CmsCategoryPayload): Promise<CmsCategory> {
  const response = await apiFetch<ApiSuccessResponse<CmsCategory>>(`/cms/catalog/categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function fetchItems(params: ItemListParams = {}) {
  return apiFetch<PaginatedApiSuccessResponse<CmsItem>>(`/cms/catalog/items${buildQuery(params)}`);
}

export async function fetchItemFilterCategories(): Promise<CmsItemFilterCategory[]> {
  const response = await apiFetch<ApiSuccessResponse<CmsItemFilterCategory[]>>('/cms/catalog/items/filter-categories');
  return response.data;
}

export async function fetchItemTaxonomyFilters(params: Pick<ItemListParams, 'category_1' | 'category_2'> = {}): Promise<CmsItemTaxonomyFilters> {
  const response = await apiFetch<ApiSuccessResponse<CmsItemTaxonomyFilters>>(`/cms/catalog/items/filter-taxonomy${buildQuery(params)}`);
  return response.data;
}

export async function createItem(payload: CmsItemPayload): Promise<CmsItem> {
  const response = await apiFetch<ApiSuccessResponse<CmsItem>>('/cms/catalog/items', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateItem(itemId: string, payload: CmsItemPayload): Promise<CmsItem> {
  const response = await apiFetch<ApiSuccessResponse<CmsItem>>(`/cms/catalog/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function deleteItem(itemId: string): Promise<void> {
  await apiFetch<ApiSuccessResponse<{ id: string; deleted: boolean }>>(`/cms/catalog/items/${itemId}`, {
    method: 'DELETE',
  });
}

export async function deleteItemImage(itemId: string, imageUrl: string): Promise<CmsItem> {
  const query = new URLSearchParams({ image_url: imageUrl }).toString();
  const response = await apiFetch<ApiSuccessResponse<{ deleted_image_url: string; deleted_hosted_file: boolean; item: CmsItem }>>(
    `/cms/catalog/items/${itemId}/images?${query}`,
    {
      method: 'DELETE',
    },
  );
  return response.data.item;
}

export async function uploadItemImagesManual(
  itemId: string,
  files: File[],
  options?: {
    replaceExisting?: boolean;
    setUploadedAsMain?: boolean;
  },
): Promise<CmsItem> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  formData.append('replace_existing', options?.replaceExisting ? 'true' : 'false');
  formData.append('set_uploaded_as_main', options?.setUploadedAsMain === false ? 'false' : 'true');
  const response = await apiFetch<ApiSuccessResponse<{ uploaded_count: number; uploaded_urls: string[]; item: CmsItem }>>(
    `/cms/catalog/items/${itemId}/images/manual`,
    {
      method: 'POST',
      body: formData,
    },
  );
  return response.data.item;
}

export async function importItemImageFromUrl(
  itemId: string,
  payload: {
    imageUrl: string;
    sourcePageUrl?: string;
    replaceExisting?: boolean;
    setUploadedAsMain?: boolean;
  },
): Promise<CmsItem> {
  const response = await apiFetch<ApiSuccessResponse<{ uploaded_count: number; uploaded_urls: string[]; item: CmsItem }>>(
    `/cms/catalog/items/${itemId}/images/import-url`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: payload.imageUrl,
        source_page_url: payload.sourcePageUrl || '',
        replace_existing: payload.replaceExisting === true,
        set_uploaded_as_main: payload.setUploadedAsMain !== false,
      }),
    },
  );
  return response.data.item;
}

export async function fetchItem(itemId: string): Promise<CmsItem> {
  const previewBypass = Date.now();
  const response = await apiFetch<ApiSuccessResponse<CmsItem>>(`/cms/catalog/items/${itemId}?preview_bypass=${previewBypass}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });
  return response.data;
}

export async function fetchItemChanges(itemId: string): Promise<CmsItemChange[]> {
  const response = await apiFetch<ApiSuccessResponse<CmsItemChange[]>>(`/cms/catalog/items/${itemId}/changes`);
  return response.data;
}

export async function refreshItemFromSources(
  itemId: string,
  barcode?: string,
  options?: {
    sourceKey?: string;
    textSourceKey?: string;
    imageSourceKey?: string;
    categorySourceKey?: string;
  },
): Promise<CmsItemSourceRefreshResult> {
  const response = await apiFetch<ApiSuccessResponse<CmsItemSourceRefreshResult>>(`/cms/catalog/items/${itemId}/refresh-from-sources`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    body: JSON.stringify({
      barcode: barcode || undefined,
      source_key: options?.sourceKey || undefined,
      text_source_key: options?.textSourceKey || undefined,
      image_source_key: options?.imageSourceKey || undefined,
      category_source_key: options?.categorySourceKey || undefined,
    }),
  });
  return response.data;
}

export async function approveItemGoLive(itemId: string): Promise<CmsItem> {
  const response = await apiFetch<ApiSuccessResponse<CmsItem>>(`/cms/catalog/items/${itemId}/approve-go-live`, {
    method: 'POST',
  });
  return response.data;
}

export async function fetchBulkRefreshStatus(): Promise<CmsSourceJob | null> {
  const response = await apiFetch<ApiSuccessResponse<CmsSourceJob | null>>('/cms/catalog/bulk-refresh/status');
  return response.data;
}

export async function stopBulkRefresh() {
  const response = await apiFetch<ApiSuccessResponse<{ stop_result: CmsBulkRefreshStopResult; job: CmsSourceJob | null }>>(
    '/cms/catalog/bulk-refresh/stop',
    {
      method: 'POST',
    },
  );
  return response.data;
}

export async function cancelBulkRefresh() {
  const response = await apiFetch<ApiSuccessResponse<{ cancel_result: CmsBulkRefreshCancelResult; job: CmsSourceJob | null }>>(
    '/cms/catalog/bulk-refresh/cancel',
    {
      method: 'POST',
    },
  );
  return response.data;
}

export async function restartBulkRefresh() {
  const response = await apiFetch<ApiSuccessResponse<{ restart_result: CmsBulkRefreshRestartResult; job: CmsSourceJob | null }>>(
    '/cms/catalog/bulk-refresh/restart',
    {
      method: 'POST',
    },
  );
  return response.data;
}

export async function startBulkRefresh(payload: CmsBulkRefreshPayload): Promise<CmsBulkRefreshStartResult> {
  const response = await apiFetch<ApiSuccessResponse<CmsBulkRefreshStartResult>>('/cms/catalog/bulk-refresh/start', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.data;
}
