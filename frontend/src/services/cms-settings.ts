import type { ApiSuccessResponse, CmsSettingsData } from '../types';
import { apiFetch } from './api';

export interface CmsProxySettingsPayload {
  enabled: boolean;
  url: string;
  username: string;
  password: string;
}

export interface CmsApiSettingsPayload {
  products_enabled: boolean;
  products_internal_enabled: boolean;
  endpoints: {
    key: string;
    label: string;
    path: string;
    enabled: boolean;
    public_only: boolean;
    include_internal_fields: boolean;
    allow_external_image_urls: boolean;
    fields: string[];
  }[];
  products_fields: string[];
  products_internal_fields: string[];
  field_registry: string[];
}

export interface CmsMailSettingsPayload {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  smtp_from: string;
  starttls: boolean;
}

export interface CmsImageProcessingSettingsPayload {
  watermark_cleanup_enabled: boolean;
}

export interface CmsXmlSettingsPayload {
  enabled: boolean;
  service_url: string;
  public_base_url: string;
}

export interface CmsXmlRunPayload {
  domain?: string;
  mode?: 'full' | 'incremental';
}

export interface CmsXmlRunResponse {
  started: boolean;
  already_running: boolean;
  requested_domain: string;
  requested_domains: string[];
  mode: string;
  cron_time: string;
}

export async function fetchCmsSettings(): Promise<CmsSettingsData> {
  return (await apiFetch<ApiSuccessResponse<CmsSettingsData>>('/cms/settings')).data;
}

export async function updateProxySettings(payload: CmsProxySettingsPayload): Promise<CmsSettingsData> {
  const response = await apiFetch<ApiSuccessResponse<CmsSettingsData>>('/cms/settings/proxy', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateApiSettings(payload: CmsApiSettingsPayload): Promise<CmsSettingsData> {
  const response = await apiFetch<ApiSuccessResponse<CmsSettingsData>>('/cms/settings/api', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateApiClientStatus(clientId: string, enabled: boolean): Promise<CmsSettingsData> {
  const response = await apiFetch<ApiSuccessResponse<CmsSettingsData>>(`/cms/settings/api-clients/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify({ enabled }),
  });
  return response.data;
}

export async function updateMailSettings(payload: CmsMailSettingsPayload): Promise<CmsSettingsData> {
  const response = await apiFetch<ApiSuccessResponse<CmsSettingsData>>('/cms/settings/mail', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateImageProcessingSettings(payload: CmsImageProcessingSettingsPayload): Promise<CmsSettingsData> {
  const response = await apiFetch<ApiSuccessResponse<CmsSettingsData>>('/cms/settings/image-processing', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateXmlSettings(payload: CmsXmlSettingsPayload): Promise<CmsSettingsData> {
  const response = await apiFetch<ApiSuccessResponse<CmsSettingsData>>('/cms/settings/xml', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateXmlClientStatus(domain: string, enabled: boolean): Promise<CmsSettingsData> {
  const response = await apiFetch<ApiSuccessResponse<CmsSettingsData>>(`/cms/settings/xml/clients/${encodeURIComponent(domain)}`, {
    method: 'PUT',
    body: JSON.stringify({ enabled }),
  });
  return response.data;
}

export async function runXmlGeneration(
  payload: CmsXmlRunPayload = {},
): Promise<{ job: CmsXmlRunResponse; settings: CmsSettingsData }> {
  const response = await apiFetch<ApiSuccessResponse<{ job: CmsXmlRunResponse; settings: CmsSettingsData }>>(
    '/cms/settings/xml/run',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}
