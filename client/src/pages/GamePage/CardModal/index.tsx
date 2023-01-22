import React from 'react';
import { ICardShape } from '../../../../../interfaces/card';
import { Nullable } from '../../../../../utils/typescript';
import { Card } from '../../../components/Card';
import { Modal } from '../../../components/Modal';


import styles from './styles.module.scss';


interface IProps {
  activeCard: Nullable<ICardShape>;
  handleClose: () => void;
  handleBuyClick?: ()=>void;
  handleHoldClick?: ()=>void;
}

export const CardModal = ({ activeCard, handleClose, handleBuyClick, handleHoldClick }: IProps) => {
  return <Modal
    isOpen={!!activeCard}
    onRequestClose={handleClose}
    className={styles.CardModal}
  >
    <div className={styles.CardModal_content}>
      <div className={styles.CardModal_cardColumn}>
        {activeCard && <Card {...activeCard} size='lg' />}
      </div>
      <div className={styles.CardModal_controlsColumn}>
        <div className={styles.CardModal_controls}>
          {handleBuyClick && <button onClick={handleBuyClick}>Buy</button>}
          {handleHoldClick && <button onClick={handleHoldClick}>Hold</button>}
        </div>
      </div>
    </div>
  </Modal>;
};
