import React, { ReactElement, ReactNode } from 'react';
import RModal from 'react-modal';

import styles from './styles.module.scss';

import cn from 'classnames';

interface IProps {
  children: ReactNode
  isOpen: boolean;
  onRequestClose: () => void
  className?: string;
}

export const Modal = ({ className, ...props }: IProps) => {
  return <RModal
    className={cn(styles.Modal, className)}
    overlayClassName={styles.Modal_overlay}

    {...props}
  />
};
