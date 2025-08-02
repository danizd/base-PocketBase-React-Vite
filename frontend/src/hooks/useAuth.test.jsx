import { renderHook, act } from '@testing-library/react'
import { expect, test, describe, vi, beforeEach } from 'vitest'
import { AuthProvider } from '../contexts/AuthContext'
import { useAuth } from './useAuth'

// A more realistic mock of PocketBase
const mockUser = { id: 'user-id', email: 'test@example.com' }
const mockToken = 'test-token'
let authStoreOnChangeCallback = null

const pb = {
  authStore: {
    model: null,
    token: null,
    onChange: vi.fn((callback) => {
      authStoreOnChangeCallback = callback
      return () => { // Return an unsubscribe function
        authStoreOnChangeCallback = null
      }
    }),
    clear: vi.fn(() => {
      pb.authStore.model = null
      pb.authStore.token = null
      if (authStoreOnChangeCallback) {
        authStoreOnChangeCallback(null, null)
      }
    }),
  },
  collection: (name) => ({
    authWithPassword: vi.fn(async (email, password) => {
      if (password === 'password123') {
        const authData = { record: mockUser, token: mockToken }
        pb.authStore.model = authData.record
        pb.authStore.token = authData.token
        if (authStoreOnChangeCallback) {
          authStoreOnChangeCallback(authData.token, authData.record)
        }
        return authData
      }
      throw new Error('Failed to authenticate.')
    }),
    create: vi.fn(async (data) => {
      // Simulate user creation, doesn't need to do much for this test
      return { ...data, id: 'new-user-id' }
    }),
  }),
}

vi.mock('../lib/pocketbase', () => ({ pb }))

describe('useAuth hook', () => {
  beforeEach(() => {
    // Reset mocks and state before each test
    vi.clearAllMocks()
    pb.authStore.model = null
    pb.authStore.token = null
    authStoreOnChangeCallback = null
  })

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

  test('should provide initial auth context values', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.token).toBe(null)
    expect(result.current.user).toBe(null)
    expect(result.current.isAuthLoading).toBe(false)
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
    expect(typeof result.current.register).toBe('function')
  })

  test('should login a user and update state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    expect(pb.collection('users').authWithPassword).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    )
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.token).toBe(mockToken)
  })

  test('should handle login failure and throw an error', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    let error = null
    await act(async () => {
      try {
        await result.current.login('test@example.com', 'wrongpassword')
      } catch (e) {
        error = e
      }
    })

    expect(error).instanceOf(Error)
    expect(error.message).toBe('Failed to authenticate.')
    expect(result.current.user).toBe(null)
    expect(result.current.token).toBe(null)
  })

  test('should logout a user and clear state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    // First, login the user
    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    expect(result.current.user).not.toBe(null)

    // Then, logout
    await act(async () => {
      result.current.logout()
    })

    expect(pb.authStore.clear).toHaveBeenCalled()
    expect(result.current.user).toBe(null)
    expect(result.current.token).toBe(null)
  })

  test('should manage loading state during login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    let loginPromise
    act(() => {
      loginPromise = result.current.login('test@example.com', 'password123')
    })

    // Immediately after calling login, loading should be true
    expect(result.current.isAuthLoading).toBe(true)

    // Wait for the promise to resolve
    await act(async () => {
      await loginPromise
    })

    // After login is complete, loading should be false
    expect(result.current.isAuthLoading).toBe(false)
  })

  test('should register a new user and log them in', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.register('new@example.com', 'password123', 'password123')
    })

    expect(pb.collection('users').create).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    })
    // It should also call login, which in turn calls authWithPassword
    expect(pb.collection('users').authWithPassword).toHaveBeenCalledWith(
      'new@example.com',
      'password123'
    )
    // And the state should be updated
    expect(result.current.user).toEqual(mockUser)
    expect(result.current.token).toBe(mockToken)
  })
})
