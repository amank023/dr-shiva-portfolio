import { getStoredToken, getStoredApiUrl, setStoredApiUrl } from './storage';
import { CANDIDATE_URLS, CURRENT_HOST_IP } from '../config/apiConfig';

/**
 * Ping an endpoint candidate to check if backend server is responsive
 */
export async function pingEndpoint(baseUrl, timeoutMs = 3000) {
  if (!baseUrl) return false;
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const testUrl = `${cleanBase}/health`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(testUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) return false;
    const data = await res.json();
    return data?.status === 'ok';
  } catch {
    clearTimeout(timer);
    return false;
  }
}

/**
 * Auto-discover the active backend server URL from candidate endpoints
 */
export async function autoDiscoverWorkingUrl() {
  const current = await getStoredApiUrl();

  // Test current first with short timeout
  if (await pingEndpoint(current, 2000)) {
    return current;
  }

  // Probe candidates in parallel
  const candidates = CANDIDATE_URLS.filter(u => u !== current);
  const probes = candidates.map(async (url) => {
    const ok = await pingEndpoint(url, 3000);
    return ok ? url : null;
  });

  const results = await Promise.all(probes);
  const working = results.find(u => u !== null);

  if (working) {
    console.log(`[API Auto-Discovery] Switched to working backend: ${working}`);
    await setStoredApiUrl(working);
    return working;
  }

  return current;
}

/**
 * Universal Request Dispatcher for Mobile Admin Client with Auto-Discovery & Retry
 */
async function request(endpoint, options = {}) {
  let baseUrl = await getStoredApiUrl();
  const token = await getStoredToken();

  // Normalize path
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${cleanBase}${cleanEndpoint}`;

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const timeoutMs = options.timeout || 25000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        if (text.includes('<!DOCTYPE html>')) {
          throw new Error('Received HTML page instead of API response. Please verify backend URL in Settings.');
        }
        data = { message: text };
      }
    }

    if (!response.ok) {
      const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);

    // If initial attempt failed with network error or timeout, attempt auto-recovery once
    const isNetworkOrTimeout = err.name === 'AbortError' ||
      err.message?.includes('Network request failed') ||
      err.message?.includes('Failed to fetch');

    if (isNetworkOrTimeout && !options._retry) {
      console.warn(`[API] Connection failed to ${fullUrl}. Attempting auto-discovery...`);
      try {
        const workingUrl = await autoDiscoverWorkingUrl();
        if (workingUrl && workingUrl !== baseUrl) {
          console.log(`[API] Retrying on newly discovered URL: ${workingUrl}`);
          return request(endpoint, { ...options, _retry: true });
        }
      } catch (discoveryErr) {
        console.warn('[API] Auto-discovery error:', discoveryErr);
      }
    }

    if (err.name === 'AbortError') {
      throw new Error(`The backend server at ${baseUrl} took too long to respond (>25s).\n\nPlease verify:\n1. Backend is running (npm run dev)\n2. USB Cable: run 'adb reverse tcp:5000 tcp:5000'\n3. Wi-Fi: ensure phone and PC are on same Wi-Fi (${CURRENT_HOST_IP})`);
    }

    if (err.message?.includes('Network request failed') || err.message?.includes('Failed to fetch')) {
      throw new Error(`Cannot connect to backend at ${baseUrl}.\n\nEnsure backend is running (npm run dev) and either:\n1. USB cable: 'adb reverse tcp:5000 tcp:5000' (http://127.0.0.1:5000/api)\n2. Wi-Fi: http://${CURRENT_HOST_IP}:5000/api`);
    }

    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// AUTH & DASHBOARD STATS
// ─────────────────────────────────────────────────────────────
export const adminLogin = async (password) => {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password })
  });
};

export const getAdminStats = async () => {
  return request('/stats', { method: 'GET' });
};

export const adminChangePassword = async (oldPassword, newPassword) => {
  return request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword })
  });
};

export const checkHealth = async () => {
  return request('/health', { method: 'GET', timeout: 5000 });
};

// ─────────────────────────────────────────────────────────────
// APPOINTMENTS
// ─────────────────────────────────────────────────────────────
export const getAppointments = async () => {
  return request('/appointments', { method: 'GET' });
};

export const createAppointment = async (data) => {
  return request('/appointments', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const updateAppointment = async (id, data) => {
  return request(`/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
};

export const deleteAppointment = async (id) => {
  return request(`/appointments/${id}`, { method: 'DELETE' });
};

// ─────────────────────────────────────────────────────────────
// PATIENT REVIEWS
// ─────────────────────────────────────────────────────────────
export const getReviews = async () => {
  return request('/reviews', { method: 'GET' });
};

export const createReview = async (data) => {
  return request('/reviews', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const updateReview = async (id, data) => {
  return request(`/reviews/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
};

export const deleteReview = async (id) => {
  return request(`/reviews/${id}`, { method: 'DELETE' });
};

export const resetReviews = async () => {
  return request('/reviews/reset', { method: 'POST' });
};

// ─────────────────────────────────────────────────────────────
// CONTACT INQUIRIES & MESSAGES
// ─────────────────────────────────────────────────────────────
export const getMessages = async () => {
  return request('/messages', { method: 'GET' });
};

export const updateMessage = async (id, data) => {
  return request(`/messages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
};

export const deleteMessage = async (id) => {
  return request(`/messages/${id}`, { method: 'DELETE' });
};

// ─────────────────────────────────────────────────────────────
// VIRTUAL ASSISTANT BOT LOGS
// ─────────────────────────────────────────────────────────────
export const getChatLogs = async () => {
  return request('/chatlogs', { method: 'GET' });
};

export const deleteChatLog = async (id) => {
  return request(`/chatlogs/${id}`, { method: 'DELETE' });
};

export const clearChatLogs = async () => {
  return request('/chatlogs', { method: 'DELETE' });
};

// ─────────────────────────────────────────────────────────────
// WEBSITE CONTENT CMS
// ─────────────────────────────────────────────────────────────
export const getContent = async () => {
  return request('/content', { method: 'GET' });
};

export const updateContent = async (data) => {
  return request('/content', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const resetContent = async () => {
  return request('/content/reset', { method: 'POST' });
};
