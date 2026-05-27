import { API_BASES, ApiBase } from './config';
import axs, {
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';

const authInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('henig-auth-token');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });
};

// Access-Control-* are server response headers — do not set them on the client request.
const legacyAxios: AxiosInstance = axs.create({ baseURL: API_BASES.legacy });
const newAxios: AxiosInstance = axs.create({ baseURL: API_BASES.new });

authInterceptor(legacyAxios);
authInterceptor(newAxios);

// Returns the correct axios instance for the given API base.
// Pass the `base` field from API_CONFIG.<feature>.base.
export const getAxiosInstance = (base: ApiBase): AxiosInstance =>
  base === 'new' ? newAxios : legacyAxios;

const cancelTokenSource: Record<string, CancelTokenSource> = {};

function buildClient(getInstance: (base?: ApiBase) => AxiosInstance) {
  return {
    async get<T = any>(
      url: string,
      params?: Record<string, any>,
      headers?: AxiosRequestHeaders,
      cancelType: boolean | 'full' = false,
      base?: ApiBase
    ): Promise<AxiosResponse<T>> {
      const axios = getInstance(base);
      const requestKey =
        cancelType && btoa(url + (cancelType === 'full' ? JSON.stringify(params) : ''));

      if (requestKey) {
        if (cancelTokenSource[requestKey]) cancelTokenSource[requestKey].cancel();
        cancelTokenSource[requestKey] = axs.CancelToken.source();
      }

      return await axios.get<T>(url, {
        params,
        cancelToken: cancelType && requestKey ? cancelTokenSource[requestKey].token : undefined,
        headers: { ...headers },
      });
    },

    async post<T = any>(url: string, params?: any, headers?: AxiosRequestHeaders, base?: ApiBase): Promise<AxiosResponse<T>> {
      return await getInstance(base).post<T>(url, params, { headers: { ...headers } });
    },

    async put<T = any>(url: string, params?: any, headers?: AxiosRequestHeaders, base?: ApiBase): Promise<AxiosResponse<T>> {
      return await getInstance(base).put<T>(url, params, { headers: { ...headers } });
    },

    async patch<T = any>(url: string, params?: any, headers?: AxiosRequestHeaders, base?: ApiBase): Promise<AxiosResponse<T>> {
      return await getInstance(base).patch<T>(url, params, { headers: { ...headers } });
    },

    async delete<T = any>(url: string, params?: Record<string, any>, headers?: AxiosRequestHeaders, base?: ApiBase): Promise<AxiosResponse<T>> {
      return await getInstance(base).delete<T>(url, { params, headers: { ...headers } });
    },

    async download(
      url: string,
      filename?: string,
      type?: string,
      params?: Record<string, any>,
      headers?: AxiosRequestHeaders,
      base?: ApiBase
    ): Promise<void> {
      try {
        const axios = getInstance(base);
        const response = await axios.get<Blob>(url, {
          params,
          headers: { ...headers },
          responseType: 'blob',
        });

        const fileType =
          type ||
          response.headers['content-type']?.split(';').join('').split(' ')[0] ||
          'application/octet-stream';

        const fileName =
          filename || response.headers['content-disposition']?.substring(21) || 'download';

        const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: fileType }));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        a.remove();
      } catch (err) {
        console.error(err);
      }
    },

    axios: legacyAxios,
    getAxiosInstance,
  };
}

export default buildClient((base) => getAxiosInstance(base ?? 'legacy'));
