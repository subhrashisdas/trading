import { Milliseconds } from '@src/date';
import { filteredInstruments } from '@src/instrument';
import { getOptimizedHistory } from '@src/history';
import { Order } from '@src/order';

export async function runAlgo(from: Milliseconds, to: Milliseconds, algoName: string) {
  const instruments = await filteredInstruments(['2']);
  for (const instrument of instruments) {
    const candles = await getOptimizedHistory(from, to, instrument.id);
    const ordersToBePlaced: Order[] = [];
    for (const candle of candles) {
      // Run Algo
      console.log(candle);
      console.log(ordersToBePlaced);
    }
  }
}
