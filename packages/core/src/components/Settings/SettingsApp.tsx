import { type Shell } from 'electron';

import { Farming } from '@tree/icons';
import { Trans } from '@lingui/macro';
import {
  WbSunny as WbSunnyIcon,
  NightsStay as NightsStayIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
} from '@mui/icons-material';
import { ButtonGroup } from '@mui/material';
import React, { type ReactNode } from 'react';

import Mode from '../../constants/Mode';
import useDarkMode from '../../hooks/useDarkMode';
import useMode from '../../hooks/useMode';
import useShowError from '../../hooks/useShowError';
import Button from '../Button';
import Flex from '../Flex';
import Link from '../Link';
import LocaleToggle from '../LocaleToggle';
import SettingsLabel from './SettingsLabel';

export type SettingsAppProps = {
  children?: ReactNode;
};

export default function SettingsApp(props: SettingsAppProps) {
  const { children } = props;

  const [mode, setMode] = useMode();
  const showError = useShowError();
  const { enable, disable, isDarkMode } = useDarkMode();

  function handleSetFarmingMode() {
    setMode(Mode.FARMING);
  }

  function handleSetWalletMode() {
    setMode(Mode.WALLET);
  }

  async function handleOpenFAQURL(): Promise<void> {
    try {
      const { shell } = window as unknown as { shell: Shell };
      await shell.openExternal('https://github.com/Tree111-Network/tree-blockchain/wiki/FAQ');
    } catch (error: any) {
      showError(error);
    }
  }

  async function handleOpenSendFeedbackURL(): Promise<void> {
    try {
      const { shell } = window as unknown as { shell: Shell };
      await shell.openExternal('https://feedback.tree111.com/lightwallet');
    } catch (error: any) {
      showError(error);
    }
  }

  return (
    <Flex flexDirection="column" gap={3}>
      <Flex flexDirection="column" gap={1}>
        <SettingsLabel>
          <Trans>Mode</Trans>
        </SettingsLabel>
        <ButtonGroup fullWidth>
          <Button
            startIcon={<Farming />}
            selected={mode === Mode.FARMING}
            onClick={handleSetFarmingMode}
            data-testid="SettingsApp-mode-farming"
          >
            <Trans>Farming</Trans>
          </Button>
          <Button
            startIcon={<AccountBalanceWalletIcon />}
            selected={mode === Mode.WALLET}
            onClick={handleSetWalletMode}
            data-testid="SettingsApp-mode-wallet"
          >
            <Trans>Wallet</Trans>
          </Button>
        </ButtonGroup>
      </Flex>

      <Flex flexDirection="column" gap={1}>
        <SettingsLabel>
          <Trans>Appearance</Trans>
        </SettingsLabel>
        <ButtonGroup fullWidth>
          <Button
            startIcon={<WbSunnyIcon />}
            selected={!isDarkMode}
            onClick={() => disable()}
            data-testid="SettingsApp-appearance-light"
          >
            <Trans>Light</Trans>
          </Button>
          <Button
            startIcon={<NightsStayIcon />}
            selected={isDarkMode}
            onClick={() => enable()}
            data-testid="SettingsApp-appearance-dark"
          >
            <Trans>Dark</Trans>
          </Button>
        </ButtonGroup>
      </Flex>

      <Flex flexDirection="column" gap={1}>
        <SettingsLabel>
          <Trans>Language</Trans>
        </SettingsLabel>
        <LocaleToggle variant="outlined" />
      </Flex>

      {children}

      <Flex flexDirection="column" gap={1}>
        <SettingsLabel>
          <Trans>Help</Trans>
        </SettingsLabel>
        <Flex flexDirection="column">
          <Link onClick={handleOpenFAQURL} data-testid="SettingsApp-faq">
            <Trans>Frequently Asked Questions</Trans>
          </Link>
          <Link onClick={handleOpenSendFeedbackURL} data-testid="SettingsApp-send-feedback">
            <Trans>Send Feedback</Trans>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
