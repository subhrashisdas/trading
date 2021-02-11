import { Candle } from "@src/candle";
import { Pivot, calculatePivot } from "@src/pivot";
import { deepStrictEqual } from "assert";

export async function pivotTest() {
  const candle: Candle = {
    timestamp: Date.now(),
    open: 90,
    high: 95,
    low: 85,
    close: 98,
    volume: 0
  };
  const pivotData: Pivot = {
    resistance4: 122.67,
    resistance3: 112.67,
    resistance2: 102.67,
    resistance1: 100.33,
    pivotPoint: 92.67,
    support1: 90.33,
    support2: 82.67,
    support3: 72.67,
    support4: 62.67
  };
  deepStrictEqual(calculatePivot(candle), pivotData);
}
