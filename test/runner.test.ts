import { Instrument } from "@src/instrument";
import { MinuteInMs, WeekInMs } from "@src/date";
import { OhlvcCandle, convertOhlvcCandlesToTradeJson } from "@src/candle";
import { deepStrictEqual } from "assert";
import { runAlgo, runAlgoEachCandle } from "@src/runner";

export async function runAlgoEachCandleTest() {
  const candle: OhlvcCandle[] = [["2020-11-12T15:15:00+0530", 12625.3, 12641.15, 12622.25, 12640.25, 0, 0]];

  const instrument: Instrument = {
    tradingSymbol: "RAIN",
    instrumentToken: 3926273,
    segment: "NSE"
  };
  const price = await runAlgoEachCandle({
    candle: convertOhlvcCandlesToTradeJson(candle)[0],
    algoName: "test",
    instrument,
    price: 100
  });
  deepStrictEqual(price, +100);
}

export async function runAlgoTest() {
  await runAlgo({
    from: Date.now() - 2 * WeekInMs,
    to: Date.now() - WeekInMs,
    algoName: "test",
    quantity: 1,
    isLive: false,
    recurring: 5 * MinuteInMs,
    instrumentNames: ["5"]
  });
}
