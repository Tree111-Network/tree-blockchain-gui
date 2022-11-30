import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';
import treeFormatter from './treeFormatter';

export default function mojoToCATLocaleString(mojo: string | number | BigNumber, locale?: string) {
  return treeFormatter(mojo, Unit.MOJO).to(Unit.CAT).toLocaleString(locale);
}
