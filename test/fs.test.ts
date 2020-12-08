import { deepStrictEqual } from 'assert';
import { deleteJson, getJson, setJson } from '@src/fs';

export async function setAndGetJsonTest() {
  const now = Date.now();
  const key = 'foo';
  const data = { foo: 'bar' };

  await setJson(key, data, now + 1000);
  deepStrictEqual(await getJson(key), data);

  await deleteJson(key);
  deepStrictEqual(await getJson(key), undefined);

  await setJson(key, data, now - 1000);
  deepStrictEqual(await getJson(key), undefined);

  await setJson(key, data);
  deepStrictEqual(await getJson(key), data);
}
