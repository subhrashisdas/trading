import { Candle } from "@src/candle";

interface Pivot {
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

  const resistance1 = 2 * pivotPoint - candle.low;
  const resistance2 = pivotPoint + range;
  const resistance3 = pivotPoint + range * 2;
  const resistance4 = pivotPoint + range * 3;

  const support1 = 2 * pivotPoint - candle.high;
  const support2 = pivotPoint - range;
  const support3 = pivotPoint - range * 2;
  const support4 = pivotPoint - range * 3;
  return {
    resistance4,
    resistance3,
    resistance2,
    resistance1,
    pivotPoint,
    support1,
    support2,
    support3,
    support4
  };
}
