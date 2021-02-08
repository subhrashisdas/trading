import { DayInMs, MinuteInMs } from '@src/date';
import { runAlgo } from '@src/runner';
import program from 'commander';

program
  .option('-l, --limit <number>', 'Run algo limit in days')
  .option('-o, --offset <number>', 'Run algo offset in days')
  .option('-a, --algo <string>', 'Algo name')
  .option('-q, --quantity <number>', 'Quantity')
  .option('-p, --live', 'Live')
  .option('-r, --recurring <number>', 'Recurring frequency in minutes')
  .option('-i, --instruments <string...>', 'Instruments name')
  .parse(process.argv);

async function main() {
  if (program.live) {
    await runAlgo({
      from: Date.now() - program.offset * DayInMs,
      to: Date.now() - program.limit * DayInMs,
      algoName: program.algo,
      quantity: program.quantity,
      isLive: program.live,
      recurring: program.recurring * MinuteInMs,
      instrumentNames: program.instruments,
    });
  } else {
  }
}

main().then(console.log).catch(console.error);
