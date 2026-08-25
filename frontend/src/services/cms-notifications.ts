import { apiFetch } from './api';
import type {
  ApiSuccessResponse,
  CmsNotificationEvent,
  PaginatedApiSuccessResponse,
} from '../types';

export type NotificationChannel = 'catalog' | 'operations' | 'security';

export interface NotificationEventListParams {
  search?: string;
  event_type?: string;
  channel?: NotificationChannel | '';
  status_filter?: 'all' | 'pending' | 'published';
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

export interface NotificationChannelStats {
  pending: number;
  total: number;
}

export interface NotificationSummary {
  channels: Record<NotificationChannel, NotificationChannelStats>;
}

function buildQuery(params: NotificationEventListParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  const encoded = query.toString();
  return encoded ? `?${encoded}` : '';
}

export async function fetchNotificationEvents(params: NotificationEventListParams = {}) {
  return apiFetch<PaginatedApiSuccessResponse<CmsNotificationEvent>>(
    `/cms/notifications/events${buildQuery(params)}`,
  );
}

export async function fetchNotificationSummary(): Promise<NotificationSummary> {
  const response = await apiFetch<ApiSuccessResponse<NotificationSummary>>(
    '/cms/notifications/summary',
  );
  return response.data;
}

export async function publishNotificationEvent(eventId: string): Promise<CmsNotificationEvent> {
  const response = await apiFetch<ApiSuccessResponse<CmsNotificationEvent>>(
    `/cms/notifications/events/${eventId}/publish`,
    {
      method: 'POST',
    },
  );
  return response.data;
}

export interface BulkPublishBody {
  ids?: string[];
  filter?: NotificationEventListParams;
}

export async function bulkPublishNotifications(body: BulkPublishBody): Promise<{ updated: number }> {
  const response = await apiFetch<ApiSuccessResponse<{ updated: number }>>(
    '/cms/notifications/events/bulk-publish',
    { method: 'POST', body: JSON.stringify(body) },
  );
  return response.data;
}

export async function bulkDismissNotifications(body: BulkPublishBody): Promise<{ deleted: number }> {
  const response = await apiFetch<ApiSuccessResponse<{ deleted: number }>>(
    '/cms/notifications/events/bulk-dismiss',
    { method: 'POST', body: JSON.stringify(body) },
  );
  return response.data;
}
