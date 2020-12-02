import * as udts from '@src/algos/udts';

export function getAlgo(name: string) {
  if (name === 'udts') {
    return udts;
  }
  return udts;
}
