// src/services/api.js

export const API_BASE_URL = 'https://university.fctesting.shop/api'

export const getAuthToken = () => sessionStorage.getItem('token') || null
const buildAuthError = (message = 'Unauthorized') => {
  const error = new Error(message)
  error.status = 401
  return error
}

const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken()
  const isFormData = options.body instanceof FormData

  const config = {
    ...options,
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (response.status === 401) {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    throw buildAuthError('Unauthorized')
  }

  return response
}

export const get = async (endpoint) => {
  const response = await apiFetch(endpoint, { method: 'GET' })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return await response.json()
}

export const post = async (endpoint, data) => {
  const response = await apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return await response.json()
}

export const postFormData = async (endpoint, formData) => {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  })

  if (response.status === 401) {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    throw buildAuthError('Unauthorized')
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }
  return await response.json()
}

export const put = async (endpoint, data) => {
  const response = await apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return await response.json()
}

export const del = async (endpoint) => {
  const response = await apiFetch(endpoint, { method: 'DELETE' })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return await response.json()
}

export default { get, post, postFormData, put, delete: del }

