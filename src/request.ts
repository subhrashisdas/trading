import fetch from 'node-fetch';
import path from 'path';
import querystring from 'querystring';
import { URLSearchParams } from 'url';

export interface jsonRequestOptions {
  url: string;
  method: string;
  path?: string;
  form?: any;
  headers?: any;
  body?: any;
  params?: any;
}

export interface jsonRequestReturn {
  body: any;
  status: any;
  headers: any;
}

export async function jsonRequest(options: jsonRequestOptions): Promise<jsonRequestReturn> {
  let completeUrl = options.url;

  if (options.path) {
    completeUrl = path.join(completeUrl, options.path).replace(':/', '://');
  }

  if (options.params) {
    const params = querystring.stringify(options.params);
    completeUrl = completeUrl + '?' + params;
  }

  const fetchOptions: any = {
    method: options.method,
    headers: options.headers || {},
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
    fetchOptions.headers['Content-Type'] = 'application/json';
  }

  if (options.form) {
    fetchOptions.body = objectToForm(options.form);
    fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  const response = await fetch(completeUrl, fetchOptions);

  return {
    body: await response.json(),
    status: response.status,
    headers: response.headers.raw(),
  };
}

export function objectToForm(params: object) {
  const form = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    form.append(key, value);
  }
  return form;
}
