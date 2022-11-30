import { WalletType } from '@tree/api';
import type { Wallet } from '@tree/api';

export default function getWalletPrimaryTitle(wallet: Wallet): string {
  switch (wallet.type) {
    case WalletType.STANDARD_WALLET:
      return 'Tree';
    default:
      return wallet.meta?.name ?? wallet.name;
  }
}
