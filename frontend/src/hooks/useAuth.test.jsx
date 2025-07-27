import { renderHook, act } from '@testing-library/react'
import { expect, test, describe, vi } from 'vitest'
import { AuthProvider } from '../contexts/AuthContext'
import { useAuth } from './useAuth'

// Mock PocketBase
const pb = {
  authStore: {
    model: null,
    token: null,
    onChange: vi.fn(),
    clear: vi.fn(),
  },
  collection: () => ({
    authWithPassword: vi.fn().mockResolvedValue({
      token: 'test-token',
      record: { id: 'user-id', email: 'test@example.com' },
    }),
  }),
}

vi.mock('../lib/pocketbase', () => ({ pb }))

describe('useAuth hook', () => {
  test('should provide auth context values', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.token).toBe(null)
    expect(result.current.user).toBe(null)
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
    expect(typeof result.current.register).toBe('function')
  })

  test('should login a user', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    expect(pb.collection().authWithPassword).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    )
  })

  test('should logout a user', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.logout()
    })

    expect(pb.authStore.clear).toHaveBeenCalled()
  })
})
