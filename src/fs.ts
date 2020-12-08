import { Milliseconds } from '@src/date';
import { access, readFile, unlink, writeFile } from 'fs/promises';
import { deepStrictEqual } from 'assert';
import path from 'path';

export async function exists(filePath: string): Promise<Boolean> {
  try {
    await access(filePath);
    return true;
  } catch (_) {
    return false;
  }
}

export async function deleteFile(filePath: string): Promise<Boolean> {
  try {
    await unlink(filePath);
    return true;
  } catch (_) {
    return false;
  }
}

const folderLocation = path.join(__filename, '../../.cache');

export function filePath(key: string) {
  return path.join(folderLocation, key);
}

export async function setJson(key: string, value: object, cacheTill?: Milliseconds) {
  try {
    const fileData = { value, cacheTill };
    await writeFile(filePath(key), JSON.stringify(fileData));
    return value;
  } catch (_) {
    return;
  }
}

export async function getJson(key: string) {
  try {
    const { value, cacheTill } = JSON.parse((await readFile(filePath(key))).toString());
    return cacheTill && cacheTill < Date.now() ? undefined : value;
  } catch (_) {
    return;
  }
}

export async function deleteJson(key: string) {
  try {
    await unlink(filePath(key));
    return;
  } catch (_) {
    return;
  }
}

export async function functionCache(func: Function, variablesData: any[] = [], cacheTill: Milliseconds) {
  try {
    const { variables, results } = await getJson(func.name);
    deepStrictEqual(variablesData, variables);
    return results;
  } catch (_) {
    const results = await func(...variablesData);
    await setJson(func.name, { results, variables: variablesData }, cacheTill);
    return results;
  }
}
