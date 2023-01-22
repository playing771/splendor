import React from 'react';
import { EGemColor } from '../../../../../interfaces/gem';
import { TPlayerGems } from '../../../../../interfaces/player';
import { PlayerGemsList, GemsToTakeList } from '../../../components/GemsList';
import { Modal } from '../../../components/Modal';

interface IProps {
  onSubmit: () => void;
  onClear: () => void;
  handleClose: () => void;
  gemsToTakeCount: number;
  handleGemTakeClick: (color: EGemColor) => void;
  handleGemGiveBack: (color: EGemColor) => void;
  gemsRemaining: TPlayerGems;
  gemsToTake: Partial<TPlayerGems>;
}

export const TokensModal = ({
  handleClose,
  handleGemTakeClick,
  onClear,
  onSubmit,
  handleGemGiveBack,
  gemsRemaining,
  gemsToTake,
  gemsToTakeCount,
}: IProps) => {
  console.log('gemsToTake',gemsToTake);
  
  return (
    <Modal isOpen={true} onRequestClose={handleClose}>
      <div style={{ maxWidth: 500, display: 'flex' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <PlayerGemsList
            gems={gemsRemaining}
            isActive={true}
            onClick={handleGemTakeClick}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <GemsToTakeList
            gems={gemsToTake}
            isActive={true}
            onClick={handleGemGiveBack}
          />
        </div>
        <div>
          <button onClick={onClear}>Clear</button>
          <button
            disabled={!gemsToTakeCount}
            style={{ width: 130 }}
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};
