import BigNumber from 'bignumber.js';

const MOJO_PER_TREE = new BigNumber('1000000000000');
const BLOCKS_PER_YEAR = 1681920;
const POOL_REWARD = '0.875'; // 7 / 8
const FARMER_REWARD = '0.125'; // 1 /8
const _tree_per_block = '0.002'
const _tree_prefarm = new BigNumber('10000000000000') // 10,000,000,000,000

export function calculatePoolReward(height: number): BigNumber {
  if (height === 0) {
    return MOJO_PER_TREE.times(_tree_prefarm).times(POOL_REWARD);
  }
  // if (height < 3 * BLOCKS_PER_YEAR) {
  //   return MOJO_PER_TREE.times('2').times(POOL_REWARD);
  // }
  // if (height < 6 * BLOCKS_PER_YEAR) {
  //   return MOJO_PER_TREE.times('1').times(POOL_REWARD);
  // }
  // if (height < 9 * BLOCKS_PER_YEAR) {
  //   return MOJO_PER_TREE.times('0.5').times(POOL_REWARD);
  // }
  // if (height < 12 * BLOCKS_PER_YEAR) {
  //   return MOJO_PER_TREE.times('0.25').times(POOL_REWARD);
  // }

  return MOJO_PER_TREE.times(_tree_per_block).times(POOL_REWARD);
}

export function calculateBaseFarmerReward(height: number): BigNumber {
  if (height === 0) {
    return MOJO_PER_TREE.times(_tree_prefarm).times(FARMER_REWARD);
  }
  // if (height < 3 * BLOCKS_PER_YEAR) {
  //   return MOJO_PER_TREE.times('2').times(FARMER_REWARD);
  // }
  // if (height < 6 * BLOCKS_PER_YEAR) {
  //   return MOJO_PER_TREE.times('1').times(FARMER_REWARD);
  // }
  // if (height < 9 * BLOCKS_PER_YEAR) {
  //   return MOJO_PER_TREE.times('0.5').times(FARMER_REWARD);
  // }
  // if (height < 12 * BLOCKS_PER_YEAR) {
  //   return MOJO_PER_TREE.times('0.25').times(FARMER_REWARD);
  // }

  return MOJO_PER_TREE.times(_tree_per_block).times(FARMER_REWARD);
}
