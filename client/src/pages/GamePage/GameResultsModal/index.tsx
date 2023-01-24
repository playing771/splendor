import { useNavigate } from 'react-router-dom';
import { IGameResult } from '../../../../../interfaces/game';
import { Modal } from '../../../components/Modal';

import styles from './styles.module.scss';

interface IProps {
  results: IGameResult;
}

export const GameResultsModal = ({ results }: IProps) => {
  const navigate = useNavigate();
  return (
    <Modal isOpen={true} onRequestClose={() => undefined} className={styles.GameResultsModal}>
      <div className={styles.GameResultsModal_content}>
        {results.winner === null ? <div>Draw!</div> : <div>Winner: {results.winner}</div>}
        <div>Round: {results.round}</div>
        <div>
          {results.players.map(
            ({ cardsBoughtCount, nobles, name, score }, index) => {
              return (
                <div className={styles.PlayerInfo}>
                  <span>{index + 1}</span>
                  Name: {name}
                  <div>Score: {score}</div>
                  <div>Cards bought: {cardsBoughtCount}</div>
                  <div>Noble cards: {nobles}</div>
                </div>
              );
            }
          )}
        </div>
      </div>
      <div>
        <button onClick={() => navigate('/rooms')}>Exit game</button>
      </div>
    </Modal>
  );
};
