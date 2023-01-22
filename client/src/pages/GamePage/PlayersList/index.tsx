import { memo } from 'react';
import { IPlayerShape } from '../../../../../interfaces/player';
import { PlayerInfo } from '../PlayerInfo';


interface IProps {
  players?: IPlayerShape[];
}



export const PlayersList = memo(({ players = [] }: IProps) => {
  return (
    <div>
      {players.map((player) => {
        return <PlayerInfo key={player.id} {...player} size='xs'/>;
      })}
    </div>
  );
});
