import React, { ReactElement } from 'react';
import { EGemColor } from '../../../../interfaces/gem';

import { ReactComponent as BlackSvg } from '../../assets/icons/gems/gem_black.svg';
import { ReactComponent as GreenSvg } from '../../assets/icons/gems/gem_green.svg';
import { ReactComponent as GoldSvg } from '../../assets/icons/gems/gem_gold.svg';
import { ReactComponent as BlueSvg } from '../../assets/icons/gems/gem_blue.svg';
import { ReactComponent as WhiteSvg } from '../../assets/icons/gems/gem_white.svg';
import { ReactComponent as RedSvg } from '../../assets/icons/gems/gem_red.svg';

const ICONS_MAP: Record<EGemColor, ReactElement> = {
  [EGemColor.Black]: <BlackSvg />,
  [EGemColor.Gold]: <GoldSvg />,
  [EGemColor.Green]: <GreenSvg />,
  [EGemColor.Blue]: <BlueSvg />,
  [EGemColor.Red]: <RedSvg />,
  [EGemColor.White]: <WhiteSvg />,
};

interface IProps {
  color: EGemColor;
}

export const GemIcon = ({ color }: IProps) => {
  return ICONS_MAP[color];
};
