import { ceilToNearestMilliseconds, DayInMs, Milliseconds, MinuteInMs } from '@src/date';
import { filteredInstruments } from '@src/instrument';
import { getOptimizedHistory } from '@src/history';
import { getAlgo } from '@src/algo';
import { PlaceOrderOptions, TransactionType } from './order';

export async function runAlgo(from: Milliseconds, to: Milliseconds, algoName: string, quantity: number) {
  const instruments = await filteredInstruments(['2']);
  for (const instrument of instruments) {
    const candles = await getOptimizedHistory(from, to, instrument.id);
    let ordersToBePlaced: PlaceOrderOptions[] = [];
    for (const candle of candles) {
      const algo = getAlgo(algoName);
      const algoFrom = candle.timestamp - algo.timeInterval;
      const algoTo = candle.timestamp + MinuteInMs;
      const algoCandles = await getOptimizedHistory(algoFrom, algoTo, instrument.id);
      await algo.trade(algoCandles);
      const priceToSell = await algo.trade(algoCandles);
      if (priceToSell) {
        const ordersToBePlacedData: PlaceOrderOptions = {
          exchange: instrument.segment,
          tradingSymbol: instrument.tradingsymbol,
          transactionType: priceToSell > 0 ? TransactionType.buy : TransactionType.sell,
          quantity: quantity,
          price: priceToSell,
          triggerPrice: 0,
        };
        ordersToBePlaced.push(ordersToBePlacedData);
      }
      // TODO: push to trades
      // TODO: convert candles to trades
      // TODO: filter candles
      // TODO: based on order API place order
      if (candle.timestamp < ceilToNearestMilliseconds(candle.timestamp, DayInMs)) {
        ordersToBePlaced = [];
      }
    }
  }
}
