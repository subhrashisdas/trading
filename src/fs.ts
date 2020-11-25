import { access } from 'fs/promises';

export async function exists(filePath: string): Promise<Boolean> {
  try {
    await access(filePath);
    return true;
  } catch (_) {
    return false;
  }
}
