import { apiFetch } from '../api';
import type { CmsAuthResponse, ForgotPasswordResponse } from '../../types';

interface LoginPayload {
  email: string;
  password: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
}

interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export async function login(payload: LoginPayload) {
  return apiFetch<CmsAuthResponse>('/cms/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return apiFetch<{ success: boolean }>('/cms/auth/logout', {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function getCurrentUser() {
  return apiFetch<CmsAuthResponse>('/cms/auth/me', {
    method: 'GET',
  });
}

export async function forgotPassword(email: string) {
  return apiFetch<ForgotPasswordResponse>('/cms/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(payload: ResetPasswordPayload) {
  return apiFetch<{ success: boolean; message: string }>('/cms/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function changePassword(payload: ChangePasswordPayload) {
  return apiFetch<{ success: boolean; message: string }>('/cms/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
