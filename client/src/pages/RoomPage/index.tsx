import axios, { AxiosError } from 'axios';
import { ChangeEventHandler, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ILoginDTO, IRoomUsersDTO } from '../../../../interfaces/api';
import { IUser } from '../../../../server/services/UserService';
import { Nullable } from '../../../../utils/typescript';
import { Api } from '../../Api';
import { useGlobalState } from '../../context';

export function RoomPage() {
  const [error, setError] = useState<Nullable<string>>(null);
  const [users, setUsers] = useState<IUser[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    (async function request() {
      try {
        const response = await Api.get<IRoomUsersDTO>('room/users');
        setUsers(response.data.users);
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        setError(axiosError.message);
      }
    })();
  }, []);


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
        {users.map(({ id, name }) => <li key={id}>
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
