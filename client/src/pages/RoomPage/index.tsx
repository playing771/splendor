import { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { IRoomUsersDTO } from '../../../../interfaces/api';
import { Nullable } from '../../../../utils/typescript';
import { Api } from '../../Api';
import { useRequest } from '../../utils/useRequest';

export function RoomPage() {
  const navigate = useNavigate()
  const { data: usersData } = useRequest<IRoomUsersDTO>('room/users');

  const handleStart = (e: any) => {
    (async function request() {
      try {
        await Api.get<IRoomUsersDTO>('game/start');
        navigate('/game');


      } catch (error: unknown) {
        const axiosError = error as AxiosError<string>;
        const text = axiosError.response?.data ? axiosError.response?.data : axiosError.message;
        toast(text, { style: { backgroundColor: '#c12e35', color: 'white' }, duration: 3000 });
      }
    })();
  };


  const handleResumeGame = () => {
    navigate('/game');
  }

  const handleSpectateGame = async () => {
    try {
      await Api.get('game/spectate');
      navigate('/game');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<string>;
      const text = axiosError.response?.data ? axiosError.response?.data : axiosError.message;
      toast(text, { style: { backgroundColor: '#c12e35', color: 'white' }, duration: 3000 });
    }
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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button onClick={handleStart}>Start</button>
        <button onClick={handleResumeGame}>Resume game</button>
        <button onClick={handleSpectateGame}>Spectate game</button>
      </div>
    </div>
  );
}
