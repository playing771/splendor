import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IRoomUsersDTO } from '../../../../interfaces/api';
import { Nullable } from '../../../../utils/typescript';
import { Api } from '../../Api';
import { useRequest } from '../../utils/useRequest';

export function RoomPage() {
  const [error, setError] = useState<Nullable<string>>(null);
  const navigate = useNavigate()
  const {data: usersData} = useRequest<IRoomUsersDTO>('room/users');

  const handleStart = (e: any) => {
    (async function request() {
      try {
        await Api.get<IRoomUsersDTO>('game/start');
        navigate('/game');


      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        setError(axiosError.message);
      }
    })();
  };


  const handleResumeGame = ()=> {
    navigate('/game');
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >

      <button onClick={handleStart}>Start</button>
      <button onClick={handleResumeGame}>Resume game</button>
      {error && <h3>{error}</h3>}
      <ul>
        {usersData?.users.map(({ id, name }) => <li key={id}>
          <p>
            {id}
          </p>
          <p>
            {name}
          </p>
        </li>)}
      </ul>
    </div>
  );
}
