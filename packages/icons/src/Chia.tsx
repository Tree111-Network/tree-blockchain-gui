import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import ChiaIcon from './images/tree_logo.svg';

export default function Keys(props: SvgIconProps) {
  return <SvgIcon component={ChiaIcon} viewBox="0 0 150 58" {...props} />;
}
