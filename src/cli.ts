import { DayInMs, MinuteInMs } from "@src/date";
import { runAlgo } from "@src/runner";
import cron from "node-cron";
import program from "commander";

interface ProgramData {
  limit: number;
  offset: number;
  algo: string;
  quantity: number;
  live: boolean;
  recurring: number;
  instruments: string[];
}

program
  .option("-l, --limit <number>", "Run algo limit in days")
  .option("-o, --offset <number>", "Run algo offset in days")
  .option("-a, --algo <string>", "Algo name")
  .option("-q, --quantity <number>", "Quantity")
  .option("-p, --live", "Live")
  .option("-r, --recurring <number>", "Recurring frequency in minutes")
  .option("-i, --instruments <string...>", "Instruments name")
  .parse(process.argv);

const programData: ProgramData = program as any;

async function main() {
  if (programData.live) {
    await runAlgo({
      from: Date.now() - programData.offset * DayInMs,
      to: Date.now() - programData.limit * DayInMs,
      algoName: programData.algo,
      quantity: programData.quantity,
      isLive: programData.live,
      recurring: programData.recurring * MinuteInMs,
      instrumentNames: programData.instruments
    });
  } else {
    cron.schedule(`*/${programData.recurring} * * * *`, async () => {
      await runAlgo({
        from: Date.now() - programData.recurring * MinuteInMs,
        to: Date.now(),
        algoName: programData.algo,
        quantity: programData.quantity,
        isLive: programData.live,
        recurring: programData.recurring * MinuteInMs,
        instrumentNames: programData.instruments
      });
    });
  }
}

main().then(console.log).catch(console.error);
