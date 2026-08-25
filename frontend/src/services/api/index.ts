const rawApiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';
const normalizedApiBase = rawApiBase.endsWith('/') ? rawApiBase.slice(0, -1) : rawApiBase;

export interface ApiRequestOptions extends RequestInit {
  authless?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function extractErrorMessage(data: unknown, status: number): string {
  if (typeof data === 'string' && data.trim()) {
    return data;
  }
  if (data && typeof data === 'object') {
    const detail = (data as Record<string, unknown>).detail;
    if (typeof detail === 'string' && detail.trim()) {
      return detail;
    }
    if (Array.isArray(detail)) {
      const messages = detail
        .map((entry) => {
          if (typeof entry === 'string') return entry;
          if (entry && typeof entry === 'object') {
            const msg = (entry as Record<string, unknown>).msg;
            if (typeof msg === 'string' && msg.trim()) return msg;
            try {
              return JSON.stringify(entry);
            } catch {
              return '';
            }
          }
          return '';
        })
        .filter(Boolean);
      if (messages.length > 0) {
        return messages.join('; ');
      }
    }
    if (detail && typeof detail === 'object') {
      const msg = (detail as Record<string, unknown>).msg;
      if (typeof msg === 'string' && msg.trim()) return msg;
      try {
        return JSON.stringify(detail);
      } catch {
        // fallthrough
      }
    }
    const message = (data as Record<string, unknown>).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return `Request failed with status ${status}`;
}

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  if (path.startsWith('/')) {
    return `${normalizedApiBase}${path}`;
  }
  return `${normalizedApiBase}/${path}`;
}

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { authless, headers, ...rest } = options;
  const isFormData = typeof FormData !== 'undefined' && rest.body instanceof FormData;
  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    ...rest,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(headers ?? {}),
    },
  });

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = extractErrorMessage(data, response.status);
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export { normalizedApiBase as apiBase };
