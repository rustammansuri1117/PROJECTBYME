import fallbackImage from '../assets/hotel.png'

const BASE = import.meta.env.VITE_API_URL || ''

async function request(url, options) {
  let res
  try {
    res = await fetch(`${BASE}${url}`, options)
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.message || `Request failed (${res.status})`)
  return body
}

// The DB stores a path like "/uploads/abc.jpg"; turn it into something an <img> can load.
export const imageUrl = (path) => (path ? `${BASE}${path}` : fallbackImage)

export function toQueryString(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, value)
  })
  return qs.toString()
}

// GET /api/hotels?search=&location=&maxPrice=&page=&limit=
export const fetchHotels = (queryString) => request(`/api/hotels?${queryString}`)

// GET /api/hotels/locations
export const fetchLocations = () => request('/api/hotels/locations')

// POST /api/hotels  (FormData: title, description, price, latitude, longitude, location, image)
export const createHotel = (formData) =>
  request('/api/hotels', { method: 'POST', body: formData })

// PUT /api/hotels/:id
export const updateHotel = (id, formData) =>
  request(`/api/hotels/${id}`, { method: 'PUT', body: formData })

// DELETE /api/hotels/:id
export const deleteHotel = (id) => request(`/api/hotels/${id}`, { method: 'DELETE' })
