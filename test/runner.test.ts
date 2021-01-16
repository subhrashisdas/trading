import { Instrument } from '@src/instrument';
import { OhlvcCandle, convertOhlvcCandlesToTradeJson } from '@src/candle';
import { deepStrictEqual } from 'assert';
import { runAlgoEachCandle } from '@src/runner';

export async function runAlgoEachCandleTest() {
  const candle: OhlvcCandle[] = [['2020-11-12T15:15:00+0530', 12625.3, 12641.15, 12622.25, 12640.25, 0, 0]];

  const instrument: Instrument = {
    id: 1091167511,
    weight: 1,
    tradingsymbol: 'RAIN',
    instrument_token: 3926273,
    last_price: 0,
    segment: 'NSE',
    expiry: '',
    strike: 0,
    lot_size: 1,
  };
  const price = await runAlgoEachCandle({
    candle: convertOhlvcCandlesToTradeJson(candle)[0],
    algoName: 'test',
    instrument,
    price: 100,
  });
  deepStrictEqual(price, +100);
}
