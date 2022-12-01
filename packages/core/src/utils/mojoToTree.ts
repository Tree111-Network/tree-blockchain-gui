import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';
import treeFormatter from './treeFormatter';

export default function mojoToTree(mojo: string | number | BigNumber): BigNumber {
  return treeFormatter(mojo, Unit.MOJO).to(Unit.TREE).toBigNumber();
}
