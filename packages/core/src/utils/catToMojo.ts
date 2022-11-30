import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';
import treeFormatter from './treeFormatter';

export default function catToMojo(cat: string | number | BigNumber): BigNumber {
  return treeFormatter(cat, Unit.CAT).to(Unit.MOJO).toBigNumber();
}
