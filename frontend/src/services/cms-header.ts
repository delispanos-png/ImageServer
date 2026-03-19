import { apiFetch } from './api';
import type { CmsHeaderEvent } from '../types';

export interface CmsHeaderEventsResponse {
  success: boolean;
  data: CmsHeaderEvent[];
  meta: {
    pending_notifications: number;
    visible_events: number;
    unread_events: number;
  };
}

export async function fetchHeaderEvents(limit = 12): Promise<CmsHeaderEventsResponse> {
  return apiFetch<CmsHeaderEventsResponse>(`/cms/header/events?limit=${limit}`);
}

export async function markHeaderEventsRead(eventIds: string[]) {
  return apiFetch<{ success: boolean; data: { marked: number } }>('/cms/header/events/mark-read', {
    method: 'POST',
    body: JSON.stringify({ event_ids: eventIds }),
  });
}
