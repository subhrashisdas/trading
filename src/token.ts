import { writeFile, readFile } from 'fs/promises';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

import envData from '../.env.json';

const folderLocation = '../.cache/token.txt';

interface Config {
  readonly userId: string;
  readonly password: string;
  readonly pin: string;
}

interface LoginData {
  readonly cookies: string;
  readonly requestId: string;
}

function objectToForm(params: object) {
  const form = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    form.append(key, value);
  }
  return form;
}

async function login(config: Config) {
  const response = await fetch('https://kite.zerodha.com/api/login', {
    method: 'POST',
    body: objectToForm({
      user_id: config.userId,
      password: config.password,
    }),
  });

  const body = await response.json();

  return {
    requestId: (body as any)?.data?.request_id,
    cookies: (response.headers as any)?.['set-cookie'],
  };
}

async function twoFa(config: Config, loginData: LoginData) {
  const response = await fetch('https://kite.zerodha.com/api/twofa', {
    method: 'POST',
    headers: {
      cookie: loginData.cookies as string,
    },
    body: objectToForm({
      user_id: config.userId,
      request_id: loginData.requestId,
      twofa_value: config.pin,
    }),
  });

  return {
    authorization: `enctoken ${JSON.stringify(response.headers).match('enctoken=(.*); path')?.[1]}`,
  };
}

async function generateCredentials(config: Config) {
  const loginData = await login(config);
  const twoFaData = await twoFa(config, loginData);
  return {
    ...config,
    ...twoFaData,
  };
}

export async function createCredentials() {
  await writeFile(folderLocation, JSON.stringify(await generateCredentials(envData)));
}

export async function getCredentials() {
  return JSON.parse((await readFile(folderLocation)).toString());
}

createCredentials().then().catch(console.log);
