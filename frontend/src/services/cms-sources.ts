import { apiFetch } from './api';
import type {
  ApiSuccessResponse,
  CmsSourceJob,
  CmsSourceJobUpload,
  CmsSourceOverview,
  CmsSourceRunResponse,
  CmsSourceSettingsPayload,
  CmsSourcesOverview,
} from '../types';

export async function fetchSourcesOverview(): Promise<CmsSourcesOverview> {
  const response = await apiFetch<ApiSuccessResponse<CmsSourcesOverview>>('/cms/sources/overview');
  return response.data;
}

export async function updateSourceSettings(
  sourceKey: string,
  payload: CmsSourceSettingsPayload,
): Promise<{ source: CmsSourceOverview | null; source_chain: string[] }> {
  const response = await apiFetch<ApiSuccessResponse<{ source: CmsSourceOverview | null; source_chain: string[] }>>(
    `/cms/sources/${sourceKey}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function removeSource(sourceKey: string): Promise<{ source: CmsSourceOverview | null; source_chain: string[] }> {
  const response = await apiFetch<ApiSuccessResponse<{ source: CmsSourceOverview | null; source_chain: string[] }>>(
    `/cms/sources/${sourceKey}`,
    {
      method: 'DELETE',
    },
  );
  return response.data;
}

export async function restoreSource(sourceKey: string): Promise<{ source: CmsSourceOverview | null; source_chain: string[] }> {
  const response = await apiFetch<ApiSuccessResponse<{ source: CmsSourceOverview | null; source_chain: string[] }>>(
    `/cms/sources/${sourceKey}/restore`,
    {
      method: 'POST',
      body: JSON.stringify({}),
    },
  );
  return response.data;
}

export async function runSourceJob(
  sourceKey: string,
  jobKey: string,
): Promise<{ source: CmsSourceOverview | null; job: CmsSourceJob | null; job_start: CmsSourceRunResponse['job_start'] }> {
  const response = await apiFetch<
    ApiSuccessResponse<{ source: CmsSourceOverview | null; job: CmsSourceJob | null; job_start: CmsSourceRunResponse['job_start'] }>
  >(`/cms/sources/${sourceKey}/run`, {
    method: 'POST',
    body: JSON.stringify({ job_key: jobKey }),
  });
  return response.data;
}

export async function uploadSourceJobFile(
  sourceKey: string,
  jobKey: string,
  file: File,
): Promise<{ source: CmsSourceOverview | null; job: CmsSourceJob | null; upload: CmsSourceJobUpload | null }> {
  const content = await file.text();
  const response = await apiFetch<
    ApiSuccessResponse<{ source: CmsSourceOverview | null; job: CmsSourceJob | null; upload: CmsSourceJobUpload | null }>
  >(`/cms/sources/${sourceKey}/jobs/${jobKey}/upload`, {
    method: 'POST',
    body: JSON.stringify({
      file_name: file.name,
      content,
    }),
  });
  return response.data;
}
