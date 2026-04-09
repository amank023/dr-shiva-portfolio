import axios from 'axios'
const api = axios.create({ baseURL: '/api' })
export const getReviews       = ()     => api.get('/reviews')
export const createReview     = (data) => api.post('/reviews', data)
export const getAppointments  = ()     => api.get('/appointments')
export const createAppointment= (data) => api.post('/appointments', data)
export const sendMessage      = (data) => api.post('/messages', data)
export const logChat          = (data) => api.post('/chatlogs', data)
