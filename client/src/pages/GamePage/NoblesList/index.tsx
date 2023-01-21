import React from 'react';
import { INobleShape } from '../../../../../interfaces/noble';
import { NobleCard } from '../../../components/NobleCard';

import styles from './styles.module.scss';

interface IProps {
  nobles: INobleShape[]
}

export const NoblesList = ({ nobles }: IProps) => {
  return <div className={styles.NoblesList}>
    {nobles.map((noble) => {
      return <NobleCard {...noble} key={noble.id} className={styles.NobleCard}/>
    })}
  </div>;
};
