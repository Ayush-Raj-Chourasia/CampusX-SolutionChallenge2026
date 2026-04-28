// Get API URL from config file, environment, or fallback
let configApiUrl: string | null = null;

async function loadConfigApiUrl(): Promise<string | null> {
  if (configApiUrl) return configApiUrl;

  try {
    const response = await fetch('/config.json');
    if (response.ok) {
      const config = await response.json();
      if (config.apiUrl) {
        configApiUrl = config.apiUrl;
        return configApiUrl;
      }
    }
  } catch (e) {
    // Config file not found or fetch failed - continue with other methods
  }

  return null;
}

// Get API URL from environment or runtime config
function getConfiguredApiUrl(): string {
  // Check if set via window object (injected by init script)
  if (typeof window !== 'undefined' && (window as any).__CAMPUSX_API_URL__) {
    return (window as any).__CAMPUSX_API_URL__;
  }

  // Check environment variable (set at build time)
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl;
  }

  // Development fallback
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5000';
  }

  // Production fallback: will attempt to load from config.json
  return 'http://localhost:5000';
}

let rawApiUrl = getConfiguredApiUrl();

// Try to load config asynchronously when module initializes
if (typeof window !== 'undefined') {
  loadConfigApiUrl().then((url) => {
    if (url) {
      rawApiUrl = url;
    }
  });
}

export async function ensureApiUrlLoaded(): Promise<void> {
  const url = await loadConfigApiUrl();
  if (url) {
    rawApiUrl = url;
  }
}

export function getBackendBaseUrl() {
  return rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
}

export function getApiUrl() {
  return getBackendBaseUrl();
}
