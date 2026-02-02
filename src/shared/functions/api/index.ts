import axs, {
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';

export const baseURL: string = import.meta.env.VITE_API_URL!;
// export const cdnURL: string | undefined = process.env.REACT_APP_CDN_URL;

console.log(baseURL);


const axios: AxiosInstance = axs.create({
  baseURL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept',
  },
});

const cancelTokenSource: Record<string, CancelTokenSource> = {};

export default {
  async get<T = any>(
    url: string,
    params?: Record<string, any>,
    headers?: AxiosRequestHeaders,
    cancelType: boolean | 'full' = false
  ): Promise<AxiosResponse<T>> {
    const requestKey =
      cancelType &&
      btoa(
        url + (cancelType === 'full' ? JSON.stringify(params) : '')
      );

    if (requestKey) {
      if (cancelTokenSource[requestKey]) {
        cancelTokenSource[requestKey].cancel();
      }
      cancelTokenSource[requestKey] = axs.CancelToken.source();
    }

    try {
      return await axios.get<T>(url, {
        params,
        cancelToken:
          cancelType && requestKey
            ? cancelTokenSource[requestKey].token
            : undefined,
        headers: { ...headers },
      });
    } catch (err) {
      throw err;
    }
  },

  async post<T = any>(
    url: string,
    params?: any,
    headers?: AxiosRequestHeaders
  ): Promise<AxiosResponse<T>> {
    return await axios.post<T>(url, params, {
      headers: { ...headers },
    });
  },

  async put<T = any>(
    url: string,
    params?: any,
    headers?: AxiosRequestHeaders
  ): Promise<AxiosResponse<T>> {
    try {
      return await axios.put<T>(url, params, {
        headers: { ...headers },
      });
    } catch (err) {
      throw err;
    }
  },

  async patch<T = any>(
    url: string,
    params?: any,
    headers?: AxiosRequestHeaders
  ): Promise<AxiosResponse<T>> {
    try {
      return await axios.patch<T>(url, params, {
        headers: { ...headers },
      });
    } catch (err) {
      throw err;
    }
  },

  async delete<T = any>(
    url: string,
    params?: Record<string, any>,
    headers?: AxiosRequestHeaders
  ): Promise<AxiosResponse<T>> {
    try {
      return await axios.delete<T>(url, {
        params,
        headers: { ...headers },
      });
    } catch (err) {
      throw err;
    }
  },

  async download(
    url: string,
    filename?: string,
    type?: string,
    params?: Record<string, any>,
    headers?: AxiosRequestHeaders
  ): Promise<void> {
    try {
      const response = await axios.get<Blob>(url, {
        params,
        headers: { ...headers },
        responseType: 'blob',
      });

      const fileType =
        type ||
        response.headers['content-type']
          ?.split(';')
          .join('')
          .split(' ')[0] ||
        'application/octet-stream';

      const fileName =
        filename ||
        response.headers['content-disposition']?.substring(21) ||
        'download';

      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: fileType })
      );

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

  axios,
};
