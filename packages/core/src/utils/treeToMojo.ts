import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';
import treeFormatter from './treeFormatter';

export default function treeToMojo(tree: string | number | BigNumber): BigNumber {
  return treeFormatter(tree, Unit.TREE).to(Unit.MOJO).toBigNumber();
}
