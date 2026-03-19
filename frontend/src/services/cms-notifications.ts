import { apiFetch } from './api';
import type {
  ApiSuccessResponse,
  CmsNotificationEvent,
  PaginatedApiSuccessResponse,
} from '../types';

export interface NotificationEventListParams {
  search?: string;
  event_type?: string;
  status_filter?: 'all' | 'pending' | 'published';
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
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

export async function publishNotificationEvent(eventId: string): Promise<CmsNotificationEvent> {
  const response = await apiFetch<ApiSuccessResponse<CmsNotificationEvent>>(
    `/cms/notifications/events/${eventId}/publish`,
    {
      method: 'POST',
    },
  );
  return response.data;
}
