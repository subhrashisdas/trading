import { Candle } from '@src/candle';
import { DayInMs, Milliseconds, MinuteInMs, ceilToNearestMilliseconds } from '@src/date';
import { Instrument, filteredInstruments } from '@src/instrument';
import { PlaceOrderOptions, createPlaceOrderOption } from '@src/order';
import { getAlgo } from '@src/algo';
import { getOptimizedHistory } from '@src/history';

export async function runAlgo(from: Milliseconds, to: Milliseconds, algoName: string, quantity: number) {
  const instruments = await filteredInstruments(['2']);
  for (const instrument of instruments) {
    const candles = await getOptimizedHistory(from, to, instrument.id);
    let ordersToBePlaced: PlaceOrderOptions | undefined;
    for (const candle of candles) {
      if (!ordersToBePlaced) {
        const priceToTrade = await runAlgoEachCandle({ candle, algoName, type: 'trade', instrument });
        if (priceToTrade) {
          ordersToBePlaced = createPlaceOrderOption(instrument, priceToTrade, quantity);
        }
      }

      if (ordersToBePlaced) {
        await runAlgoEachCandle({ candle, algoName, type: 'squareoff', instrument: instrument });
      }

      if (candle.timestamp < ceilToNearestMilliseconds(candle.timestamp, DayInMs)) {
        ordersToBePlaced = undefined;
      }
    }
  }
}

interface RunAlgoEachCandleOptions {
  candle: Candle;
  algoName: string;
  type: 'trade' | 'squareoff';
  instrument: Instrument;
}

export async function runAlgoEachCandle(options: RunAlgoEachCandleOptions) {
  const algo = getAlgo(options.algoName);
  const algoFrom = options.candle.timestamp - algo.timeInterval;
  const algoTo = options.candle.timestamp + MinuteInMs;
  const algoCandles = await getOptimizedHistory(algoFrom, algoTo, options.instrument.id);
  return options.type === 'trade' ? algo.trade(algoCandles) : algo.squareoff(algoCandles);
}
