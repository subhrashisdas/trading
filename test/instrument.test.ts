import { filteredInstruments } from "@src/instrument";
import { ok } from "assert";

export async function filteredInstrumentsTest() {
  const instrumentData = await filteredInstruments(["4"]);
  ok(instrumentData.length >= 0);
}
