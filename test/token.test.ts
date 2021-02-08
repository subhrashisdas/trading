import { createCredentials, getCredentials } from "@src/token";
import { ok } from "assert";

export async function createAndGetCredentialsTest() {
  await createCredentials();
  const credentials = await getCredentials();
  ok(credentials.authorization.includes("enctoken"));
}
