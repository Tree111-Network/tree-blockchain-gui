import type { Wallet } from '@tree/api';
import { WalletType } from '@tree/api';
import { treeToMojo, catToMojo } from '@tree/core';
import { t } from '@lingui/macro';
import BigNumber from 'bignumber.js';

import type Driver from '../@types/Driver';
import type OfferBuilderData from '../@types/OfferBuilderData';
import findCATWalletByAssetId from './findCATWalletByAssetId';
import hasSpendableBalance from './hasSpendableBalance';
import { prepareNFTOfferFromNFTId } from './prepareNFTOffer';

// Amount exceeds spendable balance
export default async function offerBuilderDataToOffer(
  data: OfferBuilderData,
  wallets: Wallet[],
  validateOnly?: boolean
): Promise<{
  walletIdsAndAmounts?: Record<string, BigNumber>;
  driverDict?: Record<string, any>;
  feeInMojos: BigNumber;
  validateOnly?: boolean;
}> {
  const {
    offered: { tree111: offeredTREE111 = [], tokens: offeredTokens = [], nfts: offeredNfts = [], fee: [firstFee] = [] },
    requested: { tree111: requestedTREE111 = [], tokens: requestedTokens = [], nfts: requestedNfts = [] },
  } = data;

  const usedNFTs: string[] = [];

  const feeInMojos = firstFee ? treeToMojo(firstFee.amount) : new BigNumber(0);

  const walletIdsAndAmounts: Record<string, BigNumber> = {};
  const driverDict: Record<string, Driver> = {};

  const hasOffer = !!offeredTREE111.length || !!offeredTokens.length || !!offeredNfts.length;
  const hasRequest = !!requestedTREE111.length || !!requestedTokens.length || !!requestedNfts.length;

  if (!hasRequest) {
    throw new Error(t`Please specify at least one requested asset`);
  }

  if (!hasOffer) {
    throw new Error(t`Please specify at least one offered asset`);
  }

  await Promise.all(
    offeredTREE111.map(async (tree111) => {
      const { amount } = tree111;
      if (!amount || amount === '0') {
        throw new Error(t`Please enter an TREE111 amount`);
      }

      const wallet = wallets.find((w) => w.type === WalletType.STANDARD_WALLET);
      if (!wallet) {
        throw new Error(t`No standard wallet found`);
      }

      const mojoAmount = treeToMojo(amount);
      walletIdsAndAmounts[wallet.id] = mojoAmount.negated();

      const hasEnoughBalance = await hasSpendableBalance(wallet.id, mojoAmount);
      if (!hasEnoughBalance) {
        throw new Error(t`Amount exceeds TREE111 spendable balance`);
      }
    })
  );

  await Promise.all(
    offeredTokens.map(async (token) => {
      const { assetId, amount } = token;

      if (!assetId) {
        throw new Error(t`Please select an asset for each token`);
      }

      const wallet = findCATWalletByAssetId(wallets, assetId);
      if (!wallet) {
        throw new Error(t`No CAT wallet found for ${assetId} token`);
      }

      if (!amount || amount === '0') {
        throw new Error(t`Please enter an amount for ${wallet.meta?.name} token`);
      }

      const mojoAmount = catToMojo(amount);
      walletIdsAndAmounts[wallet.id] = mojoAmount.negated();

      const hasEnoughBalance = await hasSpendableBalance(wallet.id, mojoAmount);
      if (!hasEnoughBalance) {
        throw new Error(t`Amount exceeds spendable balance for ${wallet.meta?.name} token`);
      }
    })
  );

  await Promise.all(
    offeredNfts.map(async ({ nftId }) => {
      if (usedNFTs.includes(nftId)) {
        throw new Error(t`NFT ${nftId} is already used in this offer`);
      }
      usedNFTs.push(nftId);

      const { id, amount, driver } = await prepareNFTOfferFromNFTId(nftId, true);

      walletIdsAndAmounts[id] = amount;
      if (driver) {
        driverDict[id] = driver;
      }
    })
  );

  // requested
  requestedTREE111.forEach((tree111) => {
    const { amount } = tree111;
    if (!amount || amount === '0') {
      throw new Error(t`Please enter an TREE111 amount`);
    }

    const wallet = wallets.find((w) => w.type === WalletType.STANDARD_WALLET);
    if (!wallet) {
      throw new Error(t`No standard wallet found`);
    }

    if (wallet.id in walletIdsAndAmounts) {
      throw new Error(t`Cannot offer and request the same asset`);
    }

    walletIdsAndAmounts[wallet.id] = treeToMojo(amount);
  });

  requestedTokens.forEach((token) => {
    const { assetId, amount } = token;

    if (!assetId) {
      throw new Error(t`Please select an asset for each token`);
    }

    const wallet = findCATWalletByAssetId(wallets, assetId);
    if (!wallet) {
      throw new Error(t`No CAT wallet found for ${assetId} token`);
    }

    if (!amount || amount === '0') {
      throw new Error(t`Please enter an amount for ${wallet.meta?.name} token`);
    }

    walletIdsAndAmounts[wallet.id] = catToMojo(amount);
  });

  await Promise.all(
    requestedNfts.map(async ({ nftId }) => {
      if (usedNFTs.includes(nftId)) {
        throw new Error(t`NFT ${nftId} is already used in this offer`);
      }
      usedNFTs.push(nftId);

      const { id, amount, driver } = await prepareNFTOfferFromNFTId(nftId, false);

      walletIdsAndAmounts[id] = amount;
      if (driver) {
        driverDict[id] = driver;
      }
    })
  );

  return {
    walletIdsAndAmounts,
    driverDict,
    feeInMojos,
    validateOnly,
  };
}
