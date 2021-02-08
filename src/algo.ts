import * as test from "@src/algos/test";
import * as udts from "@src/algos/udts";

export function getAlgo(name: string) {
  switch (name) {
    case "udts":
      return udts;
    case "test":
      return test;
    default:
      return test;
  }
}
