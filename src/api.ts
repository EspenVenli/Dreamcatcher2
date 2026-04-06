/** Base URL for the API (no trailing slash). Required for split dev and native shells (Capacitor). */
export function apiUrl(path: string): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const base = raw?.replace(/\/$/, '') ?? '';
  const p = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}
