import program from 'commander';

program
  .option('-l, --live', 'Execute Algo in production')
  .option('-f, --from', 'Run algo from')
  .option('-t, --to', 'Run algo to')
  .option('-p, --paper', 'Paper trading')
  .option('-a, --token <string>', 'Paper trading');

program.parse(process.argv);

if (program.token) {
  console.log(program.token);
}

if (program.live) {
  console.log('I am live');
}
