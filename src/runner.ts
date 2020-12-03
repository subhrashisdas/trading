import { Candle, groupByCandles } from '@src/candle';
import { DayInMs, Milliseconds, MinuteInMs } from '@src/date';
import { Instrument, filteredInstruments } from '@src/instrument';
import { PlaceOrderOptions, createPlaceOrderOption } from '@src/order';
import { getAlgo } from '@src/algo';
import { getOptimizedHistory } from '@src/history';

export async function runAlgo(from: Milliseconds, to: Milliseconds, algoName: string, quantity: number) {
  const instruments = await filteredInstruments(['2']);
  for (const instrument of instruments) {
    const history = await getOptimizedHistory(from, to, instrument.id);
    const groupedCandles = groupByCandles(history, DayInMs);
    for (const candles of groupedCandles) {
      await runCandlesInAGroup({ candles, algoName, instrument, quantity });
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

interface runCandlesInAGroupOptions {
  candles: Candle[];
  algoName: string;
  instrument: Instrument;
  quantity: number;
}

export async function runCandlesInAGroup(options: runCandlesInAGroupOptions) {
  let ordersToBePlaced: PlaceOrderOptions | undefined;

  for (const candle of options.candles) {
    if (!ordersToBePlaced) {
      const priceToTrade = await runAlgoEachCandle({
        candle,
        algoName: options.algoName,
        type: 'trade',
        instrument: options.instrument,
      });
      if (priceToTrade) {
        ordersToBePlaced = createPlaceOrderOption(options.instrument, priceToTrade, options.quantity);
      }
    }

    if (ordersToBePlaced) {
      await runAlgoEachCandle({
        candle,
        algoName: options.algoName,
        type: 'squareoff',
        instrument: options.instrument,
      });
    }
  }
}
