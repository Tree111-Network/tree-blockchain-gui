import { useGetFarmedAmountQuery } from '@tree/api-react';
import { useCurrencyCode, mojoToTreeLocaleString, CardSimple, useLocale } from '@tree/core';
import { Trans } from '@lingui/macro';
import React, { useMemo } from 'react';

export default function FarmCardTotalTreeFarmed() {
  const currencyCode = useCurrencyCode();
  const [locale] = useLocale();
  const { data, isLoading, error } = useGetFarmedAmountQuery();

  const farmedAmount = data?.farmedAmount;

  const totalTreeFarmed = useMemo(() => {
    if (farmedAmount !== undefined) {
      return (
        <>
          {mojoToTreeLocaleString(farmedAmount, locale)}
          &nbsp;
          {currencyCode}
        </>
      );
    }
  }, [farmedAmount, locale, currencyCode]);

  return (
    <CardSimple title={<Trans>Total Tree Farmed</Trans>} value={totalTreeFarmed} loading={isLoading} error={error} />
  );
}
