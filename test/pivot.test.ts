import { deepStrictEqual } from "assert";
import { calculatePivot } from "@src/pivot";

export async function pivotTest() {
  deepStrictEqual(calculatePivot({}), {
    resistance4: 122.67,
    resistance3: 112.67,
    resistance2: 102.67,
    resistance1: 100.33,
    pivotPoint: 92.67,
    support1: 90.33,
    support2: 82.67,
    support3: 72.67,
    support4: 62.67
  });
}
