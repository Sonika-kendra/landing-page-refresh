import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { AuthProvider } from './AuthContext';

vi.mock('@/api/auth', () => ({
  authApi: {
    getProfile: vi.fn().mockResolvedValue({ data: { _id: '1', email: 'a@b.com', role: 'user', verified: true } }),
    getRefreshToken: vi.fn().mockResolvedValue({ data: { token: 'new-token' } }),
  },
}));

import { authApi } from '@/api/auth';

describe('AuthProvider background token refresh', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.setItem('henig-auth-token', 'old-token');
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('renews the stored token every 6h so an active session never hits the 72h expiry', async () => {
    await act(async () => {
      render(<AuthProvider>{null}</AuthProvider>);
      await vi.advanceTimersByTimeAsync(0); // flush the mount-time getProfile()
    });

    await act(() => vi.advanceTimersByTimeAsync(6 * 60 * 60 * 1000));
    expect(authApi.getRefreshToken).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('henig-auth-token')).toBe('new-token');

    await act(() => vi.advanceTimersByTimeAsync(6 * 60 * 60 * 1000));
    expect(authApi.getRefreshToken).toHaveBeenCalledTimes(2);
  });
});
