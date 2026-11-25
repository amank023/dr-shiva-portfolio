import { getStoredToken, getStoredApiUrl } from './storage';

/**
 * Universal Request Dispatcher for Mobile Admin Client
 */
async function request(endpoint, options = {}) {
  const baseUrl = await getStoredApiUrl();
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 12000);

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
          throw new Error('Received HTML response instead of API data. Please verify your Backend URL in Settings.');
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
    if (err.name === 'AbortError') {
      throw new Error('Network timeout: The backend server took too long to respond. Verify server IP in Settings.');
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
