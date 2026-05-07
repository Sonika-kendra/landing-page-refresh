import { baseURL, newApiURL } from '@/config/site';

// ─── Base URLs ────────────────────────────────────────────────────────────────
// To switch a feature group to the new API, change its `base` field from
// 'legacy' to 'new'. That's the only change needed.

export const API_BASES = {
  legacy: baseURL,   // VITE_API_URL  — https://api.henigdiamonds.co.uk/backend
  new: newApiURL,    // VITE_NEW_API_URL — http://localhost:4000
} as const;

export type ApiBase = keyof typeof API_BASES;

// ─── Endpoint Registry ────────────────────────────────────────────────────────
// Each feature group declares:
//   base      — which API to target ('legacy' | 'new')
//   endpoints — the path strings / path-builder functions for that group
//
// Add new groups here as the new API comes online.

export const API_CONFIG = {
  blog: {
    base: 'new' as ApiBase,
    endpoints: {
      posts: (status: string = 'all') => `/posts/${status}`,
    },
  },

  auth: {
    base: 'new' as ApiBase,
    endpoints: {
      login: '/login',
      logout: '/logout',
      register: '/register',
      forgotPassword: '/forgot',
      resetPassword: '/reset',
      verify: '/verify',
      resendVerification: '/resendVerification',
      refreshToken: '/token',
      profile: '/profile',
    },
  },

  admin: {
    base: 'new' as ApiBase,
    endpoints: {
      stats:        '/admin/stats',
      users:        '/admin/users',
      pendingUsers: '/admin/users/pending',
      approveUser:    (id: string) => `/admin/users/${id}/approve`,
      rejectUser:     (id: string) => `/admin/users/${id}/reject`,
      blockUser:      (id: string) => `/admin/users/${id}/block`,
      unblockUser:    (id: string) => `/admin/users/${id}/unblock`,
      activateUser:   (id: string) => `/admin/users/${id}/activate`,
      deactivateUser: (id: string) => `/admin/users/${id}/deactivate`,
      deleteUser:     (id: string) => `/admin/users/${id}`,
      draftUsers:     '/admin/users/draft',
      submitDraftUser:(id: string) => `/admin/users/${id}/submit-draft`,
      assignRole:     (id: string) => `/admin/users/${id}/role`,
      assignScopes:   (id: string) => `/admin/users/${id}/scopes`,
      statusLog:      (id: string) => `/admin/users/${id}/status-log`,
      user:           (id: string) => `/users/${id}`,
      updateUser:     (id: string) => `/users/${id}`,
    },
  },

  adminPosts: {
    base: 'new' as ApiBase,
    endpoints: {
      all: '/posts/all',
      post: (id: string) => `/posts/${id}`,
      create: '/posts',
      update: (id: string) => `/posts/${id}`,
      delete: (id: string) => `/posts/${id}`,
      uploadImage: '/posts/upload-image',
    },
  },

  adminConfigs: {
    base: 'new' as ApiBase,
    endpoints: {
      all: '/configs/all',
      config: (id: string) => `/configs/${id}`,
      update: (id: string) => `/configs/${id}`,
    },
  },

  adminZoho: {
    base: 'new' as ApiBase,
    endpoints: {
      status:     '/admin/zoho/status',
      logs:       '/admin/zoho/logs',
      syncAll:    '/admin/zoho/sync',
      syncModule: (module: string) => `/admin/zoho/sync/${module}`,
    },
  },

  // ── Future groups ─────────────────────────────────────────────────────────
  // Uncomment and fill in as new API endpoints go live.
  //
  // shop: {
  //   base: 'new' as ApiBase,
  //   endpoints: {
  //     products: '/products',
  //     product: (id: string) => `/products/${id}`,
  //   },
  // },
  //
  // diamond: {
  //   base: 'new' as ApiBase,
  //   endpoints: {
  //     list: '/diamonds',
  //     detail: (id: string) => `/diamonds/${id}`,
  //   },
  // },
} as const;
