import fetch from 'node-fetch';
import path from 'path';
import querystring from 'querystring';

export interface jsonRequestOptions {
  url: string;
  path: string;
  method: string;
  form?: any;
  headers?: any;
  body?: any;
  params?: any;
}

export async function jsonRequest(options: jsonRequestOptions) {
  let completeUrl = options.url;

  if (options.path) {
    completeUrl = path.join(completeUrl, options.path);
  }

  if (options.params) {
    const params = querystring.stringify(options.params);
    completeUrl = completeUrl + '?' + params;
  }

  const fetchOptions: any = {
    method: options.method,
    headers: {},
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
    // TODO
    fetchOptions.headers['Content-Type'] = ['application/json'];
  }

  if (options.form) {
    fetchOptions.body = JSON.stringify(options.body);
    fetchOptions.headers['Content-Type'] = ['application/json'];
  }

  const response = await fetch(completeUrl, fetchOptions);

  return {
    body: response.json(),
    statusCode: response.status,
    // TODO
    headers: response.headers,
  };
}
