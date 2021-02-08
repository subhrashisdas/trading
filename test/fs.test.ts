import { deepStrictEqual } from "assert";
import { deleteJson, functionCache, getJson, setJson } from "@src/fs";

export async function setAndGetJsonTest() {
  const now = Date.now();
  const key = "foo";
  const data = { foo: "bar" };

  await setJson(key, data, now + 1000);
  deepStrictEqual(await getJson(key), data);

  await deleteJson(key);
  deepStrictEqual(await getJson(key), undefined);

  await setJson(key, data, now - 1000);
  deepStrictEqual(await getJson(key), undefined);

  await setJson(key, data);
  deepStrictEqual(await getJson(key), data);
}

async function addTimeToNow(ms: number) {
  return Date.now() + ms;
}

export async function functionCacheTest() {
  const now = Date.now();
  deepStrictEqual(
    await functionCache(addTimeToNow, [1000], now + 1000),
    await functionCache(addTimeToNow, [1000], now + 1000)
  );
}
