import {
  REACT_APP_API_BASE_URL,
} from 'helpers/env';
import { DynamicObjType } from 'helpers/pl-types';
import storage, { AUTH_TOKEN } from 'helpers/storage';

const sortParams = (params: DynamicObjType): DynamicObjType  => {
  return Object.entries(params)
    .sort()
    .reduce((_sortedObj, [k, v]) => ({ ..._sortedObj, [k]: v }), {});
}

const transformRequest = (jsonData = {}): string => {
  const finalParams = {
    ...jsonData,
  };
  return Object.entries(sortParams(finalParams))
    .map(
      ([key, value]) =>
        `${decodeURIComponent(key)}=${value ? decodeURIComponent(value.toString()) : ''}`,
    )
    .join('&');
}

const httpOptions: { headers: DynamicObjType } = {
  headers: {
    'Content-Type': 'application/json',
  },
};

const setAuthHeader = async (): Promise<void> => {
  const token = await storage.get(AUTH_TOKEN);
  if (token) {
    httpOptions.headers.authorization = `bearer ${token}`;
  } else if (httpOptions.headers.authorization) {
    delete httpOptions.headers.authorization;
  }
};

const http = {
  async get<T> (url: string, params: DynamicObjType): Promise<T> {
    const query = transformRequest(params);
    const finalURL = `${REACT_APP_API_BASE_URL}/${url}${query ? `? + ${query}` : ''}`;
    await setAuthHeader();
    const options = {
      ...httpOptions,
      method: 'GET',
    };
    const resp = await fetch(finalURL, options as RequestInit);
    const response = await resp.json();

    // This is going to break because responses aren't consistent
    if(resp.status >= 400) throw new Error(response?.messages[0].data)
    return response;
  },
  async post<T> (url: string, body: DynamicObjType, params?: DynamicObjType): Promise<T> {
    const query = transformRequest(params);
    const finalURL = `${REACT_APP_API_BASE_URL}/${url}${query ? `? + ${query}` : ''}`;
    await setAuthHeader();
    const options = {
      ...httpOptions,
      method: 'POST',
      body: JSON.stringify(body),
    };
    const resp = await fetch(finalURL, options as any);

    const response = await resp.json();

    // This is going to break because responses aren't consistent
    if(resp.status >= 400) throw new Error(response?.messages[0].data)
    return response;
  },
  async delete<T> (url: string, params?: DynamicObjType, body?: DynamicObjType): Promise<T> {
    const query = transformRequest(params);
    const finalURL = `${REACT_APP_API_BASE_URL}/${url}${query ? `? + ${query}` : ''}`;
    await setAuthHeader();
    const options = {
      ...httpOptions,
      method: 'DELETE',
      body: JSON.stringify(body),
    };
    const resp = await fetch(finalURL, options as RequestInit);
    return resp.json();
  },
};

export default http;
