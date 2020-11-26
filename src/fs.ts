import { access, unlink } from 'fs/promises';

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
