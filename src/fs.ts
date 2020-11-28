import { access, unlink, writeFile, readFile } from 'fs/promises';
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

export async function setJson(key: string, value: object) {
  try {
    await writeFile(filePath(key), JSON.stringify(value));
    return value;
  } catch (_) {
    return;
  }
}

export async function getJson(key: string) {
  try {
    return JSON.parse((await readFile(filePath(key))).toString());
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
