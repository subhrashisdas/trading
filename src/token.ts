import { writeFile, readFile } from 'fs/promises';
import got from 'got';
import envData from '../.env.json';

const folderLocation = '../.cache/token.txt';

interface Config {
  userId: string;
  password: string;
  pin: string;
}

interface LoginData {
  cookies?: string[];
  requestId: string;
}

async function login(config: Config) {
  const { body, headers } = await got.post('https://kite.zerodha.com/api/login', {
    form: {
      user_id: config.userId,
      password: config.password,
    },
    responseType: 'json',
  });

  return {
    requestId: (body as any)?.data?.request_id,
    cookies: headers['set-cookie'],
  };
}

async function twoFa(config: Config, loginData: LoginData) {
  const { body, headers } = await got.post('https://kite.zerodha.com/api/twofa', {
    headers: {
      cookie: loginData.cookies,
    },
    form: {
      user_id: config.userId,
      request_id: loginData.requestId,
      twofa_value: config.pin,
    },
    responseType: 'json',
  });

  return {
    authorization: `enctoken ${JSON.stringify(headers).match('enctoken=(.*); path')?.[1]}`,
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

createCredentials().then().catch(console.log)