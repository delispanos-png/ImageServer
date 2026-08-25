import { apiFetch } from './api';

export interface ScannerSourceResult {
  source_key: string;
  status: 'hit' | 'miss' | 'timeout' | 'error';
  elapsed_ms: number;
  error?: string;
  data: {
    hit: boolean;
    title?: string;
    short_title?: string;
    brand?: string;
    description?: string;
    category_1?: string;
    category_2?: string;
    category_3?: string;
    image_url?: string;
    image_urls?: string[];
    product_link?: string;
  };
}

export interface ScannerResponse {
  barcode: string;
  scanned_at_ms: number;
  elapsed_ms: number;
  sources: ScannerSourceResult[];
  hits: string[];
}

export async function scanBarcode(barcode: string, opts: { download_images?: boolean; sources?: string[] } = {}) {
  const response = await apiFetch<{ success: boolean; data: ScannerResponse }>('/cms/sources/scan', {
    method: 'POST',
    body: JSON.stringify({
      barcode: barcode.trim(),
      download_images: opts.download_images ?? false,
      ...(opts.sources && opts.sources.length ? { sources: opts.sources } : {}),
    }),
  });
  return response.data;
}

export async function ingestFromSource(barcode: string, source_key: string) {
  const response = await apiFetch<{ success: boolean; data: { barcode: string; source_key: string; title: string } }>(
    '/cms/sources/scan/ingest',
    {
      method: 'POST',
      body: JSON.stringify({ barcode: barcode.trim(), source_key }),
    },
  );
  return response.data;
}
