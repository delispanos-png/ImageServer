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
    const message =
      typeof data === 'object' && data && 'detail' in (data as Record<string, unknown>)
        ? String((data as Record<string, unknown>).detail)
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export { normalizedApiBase as apiBase };
