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
      staff:          '/admin/staff',
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
      delete: (id: string) => `/configs/${id}`,
      create: '/configs',
      announcementBar: '/configs/announcement-bar',
    },
  },

  adminEmailTemplates: {
    base: 'new' as ApiBase,
    endpoints: {
      all: '/email-templates/all',
      list: '/email-templates',
      byId: (id: string) => `/email-templates/${id}`,
      create: '/email-templates',
    },
  },

  adminZoho: {
    base: 'new' as ApiBase,
    endpoints: {
      status:         '/admin/zoho/status',
      schedule:       '/admin/zoho/schedule',
      logs:           '/admin/zoho/logs',
      syncAll:        '/admin/zoho/sync',
      syncModule:     (module: string) => `/admin/zoho/sync/${module}`,
      triggerProductsSync:  '/admin/zoho/products/sync/trigger',
      syncDirectory:  '/admin/zoho/directory/sync',
      inventoryItems: '/admin/zoho/items',
    },
  },

  adminFilterConfig: {
    base: 'new' as ApiBase,
    endpoints: {
      status:  '/admin/filter-config/status',
      rebuild: '/admin/filter-config/rebuild',
    },
  },

  categories: {
    base: 'new' as ApiBase,
    endpoints: {
      all: '/categories',
      tree: '/categories/tree',
      one: (id: string) => `/categories/${id}`,
      create: '/categories',
      update: (id: string) => `/categories/${id}`,
      delete: (id: string) => `/categories/${id}`,
    },
  },

  products: {
    base: 'new' as ApiBase,
    endpoints: {
      all: '/products',
      diamonds: '/products/diamonds',
      currencies: '/products/currencies',
      currency: '/products/currency',
      allFilterData: '/products/all-filter-data',
      subcategories: '/products/subcategories',
      metals: '/products/metals',
      filterOptions: '/products/filter-options',
      byName: '/products/by-name',
      one: (id: string) => `/products/${id}`,
      create: '/products',
      update: (id: string) => `/products/${id}`,
      updateTags: (zohoId: string) => `/products/${zohoId}/tags`,
      delete: (id: string) => `/products/${id}`,
      uploadImage: (id: string) => `/products/${id}/image`,
      deleteImage: (id: string) => `/products/${id}/image`,
      media: (id: string) => `/products/${id}/media`,
      file: (fileId: string) => `/products/file/${fileId}`,
    },
  },

  cart: {
    base: 'new' as ApiBase,
    endpoints: {
      create: '/cart',
      get: (id: string) => `/cart/${id}`,
      update: (id: string) => `/cart/${id}`,
      removeItem: (id: string, lineItemId: string) => `/cart/${id}/items/${lineItemId}`,
      checkout: (id: string) => `/cart/${id}/checkout`,
      delete: (id: string) => `/cart/${id}`,
    },
  },

  orders: {
    base: 'new' as ApiBase,
    endpoints: {
      all: '/orders',
      one: (id: string) => `/orders/${id}`,
      create: '/orders',
      update: (id: string) => `/orders/${id}`,
      confirm: (id: string) => `/orders/${id}/confirm`,
      updateStatus: (id: string) => `/orders/${id}/status`,
      cancel: (id: string) => `/orders/${id}`,
    },
  },

  addresses: {
    base: 'new' as ApiBase,
    endpoints: {
      all: '/addresses',
      one: (id: string) => `/addresses/${id}`,
      create: '/addresses',
      update: (id: string) => `/addresses/${id}`,
      delete: (id: string) => `/addresses/${id}`,
      setDefault: (id: string) => `/addresses/${id}/set-default`,
    },
  },

  wishlist: {
    base: 'new' as ApiBase,
    endpoints: {
      get: '/wishlist',
      add: (productId: string) => `/wishlist/${productId}`,
      remove: (productId: string) => `/wishlist/${productId}`,
    },
  },

  profile: {
    base: 'new' as ApiBase,
    endpoints: {
      get: '/profile',
      update: '/profile',
      changePassword: '/profile/changePassword',
    },
  },

  users: {
    base: 'new' as ApiBase,
    endpoints: {
      accountManagers: '/users/account-managers',
    },
  },

  contact: {
    base: 'new' as ApiBase,
    endpoints: {
      message: '/message',
      newsletter: '/newsletter',
    },
  },

  orderForms: {
    base: 'new' as ApiBase,
    endpoints: {
      create: '/order-forms',
      one:    (id: string) => `/order-forms/${id}`,
    },
  },
} as const;
