import { memo } from 'react';
import { IPlayerShape } from '../../../../../interfaces/player';
import { Nullable } from '../../../../../utils/typescript';
import { PlayerInfo } from '../PlayerInfo';

interface IProps {
  players?: IPlayerShape[];
  activePlayerId: Nullable<string>;
}

export const PlayersList = memo(({ players = [], activePlayerId }: IProps) => {
  return (
    <div>
      {players.map((player) => {
        return (
          <PlayerInfo
            key={player.id}
            {...player}
            size="xs"
            isActive={activePlayerId === player.id}
          />
        );
      })}
    </div>
  );
});
