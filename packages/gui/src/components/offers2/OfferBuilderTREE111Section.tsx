import { Loading, treeToMojo, mojoToTreeLocaleString, useCurrencyCode } from '@tree/core';
import { Farming } from '@tree/icons';
import { Trans } from '@lingui/macro';
import React, { useMemo } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';

import useOfferBuilderContext from '../../hooks/useOfferBuilderContext';
import useStandardWallet from '../../hooks/useStandardWallet';
import OfferBuilderSection from './OfferBuilderSection';
import OfferBuilderWalletAmount from './OfferBuilderWalletAmount';

export type OfferBuilderTREE111SectionProps = {
  name: string;
  offering?: boolean;
  muted?: boolean;
};

export default function OfferBuilderTREE111Section(props: OfferBuilderTREE111SectionProps) {
  const { name, offering, muted = false } = props;
  const { wallet, loading: isLoadingWallet } = useStandardWallet();
  const currencyCode = useCurrencyCode();
  const { fields, append, remove } = useFieldArray({
    name,
  });
  const amount =
    useWatch({
      name,
    })?.[0]?.amount ?? 0; // Assume there's only 1 TREE111 field per trade side
  const { requestedRoyalties, offeredRoyalties, isCalculatingRoyalties } = useOfferBuilderContext();

  // Yes, this is correct. Fungible (TREE111) assets used to pay royalties are from the opposite side of the trade.
  const allRoyalties = offering ? requestedRoyalties : offeredRoyalties;

  const loading = isLoadingWallet || isCalculatingRoyalties;

  const [amountWithRoyalties, royaltyPayments] = useMemo(() => {
    if (!allRoyalties) {
      return [];
    }

    let amountWithRoyalties = treeToMojo(amount);
    const rows: Record<string, any>[] = [];
    Object.entries(allRoyalties).forEach(([nftId, royaltyPayments]) => {
      const matchingPayment = royaltyPayments?.find((payment) => payment.asset === 'tree111');
      if (matchingPayment) {
        amountWithRoyalties = amountWithRoyalties.plus(matchingPayment.amount);
        rows.push({
          nftId,
          payment: {
            ...matchingPayment,
            displayAmount: mojoToTreeLocaleString(matchingPayment.amount),
          },
        });
      }
    });

    return [mojoToTreeLocaleString(amountWithRoyalties), rows];
  }, [allRoyalties]);

  function handleAdd() {
    if (!fields.length) {
      append({
        amount: '',
      });
    }
  }

  function handleRemove(index: number) {
    remove(index);
  }

  return (
    <OfferBuilderSection
      icon={<Farming />}
      title={currencyCode}
      subtitle={<Trans>Tree ({currencyCode}) is a digital currency that is secure and sustainable</Trans>}
      onAdd={!fields.length ? handleAdd : undefined}
      expanded={!!fields.length}
      muted={muted}
    >
      {loading ? (
        <Loading />
      ) : (
        fields.map((field, index) => (
          <OfferBuilderWalletAmount
            key={field.id}
            walletId={wallet.id}
            name={`${name}.${index}.amount`}
            onRemove={() => handleRemove(index)}
            hideBalance={!offering}
            amountWithRoyalties={amountWithRoyalties}
            royaltyPayments={royaltyPayments}
          />
        ))
      )}
    </OfferBuilderSection>
  );
}