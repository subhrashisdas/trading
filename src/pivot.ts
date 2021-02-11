import { Candle } from "@src/candle";
import { round } from "lodash";

export interface Pivot {
  resistance4: number;
  resistance3: number;
  resistance2: number;
  resistance1: number;
  pivotPoint: number;
  support1: number;
  support2: number;
  support3: number;
  support4: number;
}

export function calculatePivot(candle: Candle): Pivot {
  const pivotPoint = (candle.high + candle.low + candle.close) / 3;
  const range = candle.high - candle.low;

  const resistance1 = round(2 * pivotPoint - candle.low, 2);
  const resistance2 = round(pivotPoint + range, 2);
  const resistance3 = round(pivotPoint + range * 2, 2);
  const resistance4 = round(pivotPoint + range * 3, 2);

  const support1 = round(2 * pivotPoint - candle.high, 2);
  const support2 = round(pivotPoint - range, 2);
  const support3 = round(pivotPoint - range * 2, 2);
  const support4 = round(pivotPoint - range * 3, 2);
  return {
    resistance4,
    resistance3,
    resistance2,
    resistance1,
    pivotPoint: round(pivotPoint, 2),
    support1,
    support2,
    support3,
    support4
  };
}
