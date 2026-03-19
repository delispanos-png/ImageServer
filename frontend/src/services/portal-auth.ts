import { apiFetch } from './api';
import type { PortalAuthResponse } from '../types';

interface PortalLoginPayload {
  login: string;
  password: string;
}

export async function portalLogin(payload: PortalLoginPayload) {
  return apiFetch<PortalAuthResponse>('/portal/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function portalLogout() {
  return apiFetch<{ success: boolean }>('/portal/auth/logout', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function getCurrentPortalClient() {
  return apiFetch<PortalAuthResponse>('/portal/auth/me', {
    method: 'GET',
  });
}
