import axios from 'axios'

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL
  return '/api'
}

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach admin token if present in localStorage
api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('dr_shiva_admin_token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (_) {}
  return config
})

// Response interceptor:
// Automatically catches HTML page returns (when proxy misroutes to index.html), 404s, 502/503/504, or network drops
// Retries directly against backend port 5000
api.interceptors.response.use(
  (response) => {
    // If proxy returned HTML SPA page instead of JSON API response
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      const err = new Error('Received HTML webpage instead of API JSON response')
      err.response = response
      err.isHtmlResponse = true
      return Promise.reject(err)
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    const status = error.response?.status
    const isHtml = error.isHtmlResponse || (typeof error.response?.data === 'string' && error.response.data.includes('<!DOCTYPE html>'))

    // Trigger retry if route had proxy 404, server gateway error, network disconnect, or HTML index fallback
    const shouldRetry =
      !error.response ||
      isHtml ||
      status === 404 ||
      status === 502 ||
      status === 503 ||
      status === 504 ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED'

    if (shouldRetry && typeof window !== 'undefined') {
      originalRequest._retry = true
      const host = window.location.hostname || 'localhost'
      const isHttps = window.location.protocol === 'https:'
      const isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.') || !isHttps

      if (isLocal) {
        // Strip any leading /api/ or / from url
        const rawUrl = originalRequest.url || ''
        const cleanPath = rawUrl.replace(/^\/?api\/?/, '').replace(/^\//, '')
        const fallbackUrl = `http://${host}:5000/api/${cleanPath}`

        console.warn(`[API Client Retry] Attempting direct backend connection: ${fallbackUrl}`)

        try {
          const directRes = await axios({
            ...originalRequest,
            url: fallbackUrl,
            baseURL: '',
            timeout: 10000
          })
          return directRes
        } catch (retryErr) {
          // Also try direct non-prefixed root route as secondary fallback
          const secondaryFallback = `http://${host}:5000/${cleanPath}`
          try {
            return await axios({
              ...originalRequest,
              url: secondaryFallback,
              baseURL: '',
              timeout: 10000
            })
          } catch (_) {
            return Promise.reject(retryErr)
          }
        }
      }
    }

    return Promise.reject(error)
  }
)

// Appointments
export const getAppointments    = ()         => api.get('/appointments')
export const createAppointment  = (data)     => api.post('/appointments', data)
export const updateAppointment  = (id, data) => api.patch(`/appointments/${id}`, data)
export const deleteAppointment  = (id)       => api.delete(`/appointments/${id}`)

// Reviews
export const getReviews         = ()         => api.get('/reviews')
export const createReview       = (data)     => api.post('/reviews', data)
export const updateReview       = (id, data) => api.patch(`/reviews/${id}`, data)
export const deleteReview       = (id)       => api.delete(`/reviews/${id}`)

// Messages
export const getMessages        = ()         => api.get('/messages')
export const sendMessage        = (data)     => api.post('/messages', data)
export const updateMessage      = (id, data) => api.patch(`/messages/${id}`, data)
export const deleteMessage      = (id)       => api.delete(`/messages/${id}`)

// Chat Logs
export const getChatLogs        = ()         => api.get('/chatlogs')
export const logChat            = (data)     => api.post('/chatlogs', data)
export const deleteChatLog      = (id)       => api.delete(`/chatlogs/${id}`)
export const clearChatLogs      = ()         => api.delete('/chatlogs')

// Content & Profile
export const getContent         = ()         => api.get('/content')
export const updateContent      = (data)     => api.put('/content', data)
export const resetContent       = ()         => api.post('/content/reset')

// Auth & Dashboard Stats
export const adminLogin = async (password) => {
  try {
    return await api.post('/auth/login', { password })
  } catch (err) {
    if (!err.response) {
      return await api.post('/login', { password })
    }
    throw err
  }
}
export const adminVerify        = (token)    => api.post('/auth/verify', { token })
export const adminChangePassword= (data)     => api.post('/auth/change-password', data)
export const getAdminStats      = ()         => api.get('/stats')

export default api
