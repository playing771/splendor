import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { IRoomUsersDTO } from '../../../../interfaces/api';
import { IRoomShape } from '../../../../interfaces/room';
import { EUserRole } from '../../../../interfaces/user';
import { Nullable } from '../../../../utils/typescript';
import { Api } from '../../Api';
import { useErrorToast } from '../../utils/useErrorToast';
import { useRequest } from '../../utils/useRequest';
import { useWebsockets } from '../../utils/useWebsockets';

import styles from './styles.module.scss';

export function RoomPage() {
  const navigate = useNavigate()
  const { roomId } = useParams<{ roomId: string }>();
  const toastError = useErrorToast()

  const { data: roomData, isLoading, refetch } = useRequest<IRoomShape>(`rooms?roomId=${roomId}`);

  const onMessage = useCallback(() => {
    refetch()
  }, [])
  const onError = useCallback((error: any) => {
    toastError(error);
  }, [])

  useWebsockets(onMessage, onError)

  // console.log(params);


  const handleJoinClick = async () => {
    const body = { roomId, role: EUserRole.Player };
    try {
      await Api.post('/rooms/join', body);
      refetch()
    } catch (error) {
      toastError(error as unknown as AxiosError<string>);
    }
  }

  const handleSpectateClick = async () => {
    const body = { roomId, role: EUserRole.Spectator };
    try {
      await Api.post('/rooms/join', body);
      refetch()
    } catch (error) {
      toastError(error as unknown as AxiosError<string>);
    }
  }


  const handleLeaveClick = async () => {
    const body = { roomId };
    try {
      await Api.post('/rooms/leave', body);
      navigate('/rooms')
    } catch (error) {
      toastError(error as unknown as AxiosError<string>);
    }
  }

  const handleStartGameClick = async () => {
    const body = { roomId };
    try {
      const { data: gameId } = await Api.post<string>('/rooms/start', body);
      navigate(`/games/${gameId}`);
    } catch (error) {
      toastError(error as unknown as AxiosError<string>);
    }
  }

  return (
    !roomData ? <span> ...loading</span> :
      <div className={styles.Page}>
        <div className={styles.Page_header}>
          <h1 className={styles.RoomName}>{roomData.name}</h1>
          <button onClick={handleLeaveClick}>Leave room</button>
        </div>


        <div className={styles.Room}>
          <div className={styles.Room_content}>

            <span>{roomData.state}</span>
            <span>Spectators: {roomData.users.filter((user) => user.role === EUserRole.Spectator).length}</span>
          </div>
          <div className={styles.Room_content}>
            <span className={styles.Room_name}>Players:</span>
            <div>
              {roomData.users.filter((user) => user.role === EUserRole.Player).map((user) => {
                return <div key={user.id}>
                  {user.name}
                </div>
              })}
            </div>
          </div>
          <div className={styles.Room_controls}>
            <button onClick={handleJoinClick}>Join</button>
            <button onClick={handleSpectateClick}>Spectate</button>
            <button onClick={handleStartGameClick}>Start game</button>
          </div>
        </div>


      </div>
  );
}
