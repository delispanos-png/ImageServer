import { apiFetch } from './api';
import type { ApiSuccessResponse, CmsDashboardOverview } from '../types';

export async function fetchDashboardOverview(): Promise<CmsDashboardOverview> {
  const response = await apiFetch<ApiSuccessResponse<CmsDashboardOverview>>('/cms/dashboard/overview');
  return response.data;
}
