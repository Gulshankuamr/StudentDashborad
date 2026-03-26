// src/services/authService.js
import { API_BASE_URL } from './api'

/**
 * Login user
 * POST /api/auth/login
 * Body: { user_email, password }
 */
export const loginUser = async ({ user_email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_email, password }),
  })

  const data = await response.json()

  if (!response.ok || data.success !== true) {
    return {
      success: false,
      message: data?.message || 'Login failed. Please check your credentials.',
    }
  }

  return {
    success: true,
    data: {
      token: data.data.token,
      user: {
        ...data.data.user,
        permissions: data.data.user?.permissions || [],
      },
    },
  }
}