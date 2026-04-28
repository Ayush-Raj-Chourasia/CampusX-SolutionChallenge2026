const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function getBackendBaseUrl() {
  return rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
}

export function getApiUrl() {
  return `${getBackendBaseUrl()}/api`;
}
