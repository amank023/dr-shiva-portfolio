import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api' })

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
export const adminLogin         = (password) => api.post('/auth/login', { password })
export const adminVerify        = (token)    => api.post('/auth/verify', { token })
export const adminChangePassword= (data)     => api.post('/auth/change-password', data)
export const getAdminStats      = ()         => api.get('/stats')

export default api
