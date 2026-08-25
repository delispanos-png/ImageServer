import { apiFetch } from './api';

export interface ProductAttributes {
  weight_kg?: number;
  weight_kg_source?: string;
  weight_kg_confidence?: 'verified' | 'estimated' | 'missing';
  length_cm?: number;
  length_cm_source?: string;
  length_cm_confidence?: 'verified' | 'estimated' | 'missing';
  width_cm?: number;
  width_cm_source?: string;
  width_cm_confidence?: 'verified' | 'estimated' | 'missing';
  height_cm?: number;
  height_cm_source?: string;
  height_cm_confidence?: 'verified' | 'estimated' | 'missing';
  volumetric_weight_kg?: number;
  vat_rate?: number;
  vat_rate_source?: string;
  vat_rate_confidence?: 'verified' | 'estimated' | 'missing';
  package_size_label?: string;
  package_size_source?: string;
  mpn?: string;
  mpn_source?: string;
  wholesale_price?: number;
  wholesale_price_source?: string;
  wholesale_price_confidence?: 'verified' | 'estimated' | 'missing';
  retail_price?: number;
  retail_price_source?: string;
  retail_price_confidence?: 'verified' | 'estimated' | 'missing';
  discount_percent?: number;
  discount_percent_source?: string;
  discount_percent_confidence?: 'verified' | 'estimated' | 'missing';
  updated_at?: string;
  updated_by?: string;
}

export interface PricingSummary {
  wholesale_price: number;
  retail_price: number;
  discount_percent: number;
  vat_rate: number;
  margin_percent: number;
  consumer_price_with_vat: number;
}

export interface AttributesResponse {
  barcode: string;
  title: string;
  category_1: string;
  attributes: ProductAttributes;
  pricing_summary: PricingSummary;
  site_ready_for_export: boolean;
  site_ready_required: string[];
}

export interface AttributesUpdatePayload {
  weight_kg?: number;
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
  vat_rate?: number;
  package_size_label?: string;
  mpn?: string;
  wholesale_price?: number;
  retail_price?: number;
  discount_percent?: number;
}

export async function fetchProductAttributes(barcode: string) {
  return apiFetch<AttributesResponse>(`/cms/products/${encodeURIComponent(barcode)}/attributes`);
}

export async function updateProductAttributes(barcode: string, payload: AttributesUpdatePayload) {
  return apiFetch<AttributesResponse>(`/cms/products/${encodeURIComponent(barcode)}/attributes`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function fetchSiteReadyExport(limit = 1000) {
  return apiFetch<{ count: number; items: Record<string, unknown>[] }>(
    `/cms/products/site-ready-export?limit=${limit}`,
  );
}
