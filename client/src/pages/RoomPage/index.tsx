import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EMessageType, IMessage } from '../../../../interfaces/api';
import { ERoomState, IRoomShape } from '../../../../interfaces/room';
import { EUserRole } from '../../../../interfaces/user';
import { Api } from '../../Api';
import { useAuth } from '../../AuthProvider/context';
import { useErrorToast } from '../../utils/useErrorToast';
import { useRequest } from '../../utils/useRequest';
import { useWebsockets } from '../../utils/useWebsockets';
import { RoomsPage } from '../RoomsPage';

import styles from './styles.module.scss';

export function RoomPage() {
  const navigate = useNavigate()
  const { roomId } = useParams<{ roomId: string }>();
  const toastError = useErrorToast();

  const { userId } = useAuth();



  const { data: roomData, isLoading, refetch } = useRequest<IRoomShape>(`rooms?roomId=${roomId}`);

  const spectators = roomData?.users.filter((user) => user.role === EUserRole.Spectator) || [];
  const players = roomData?.users.filter((user) => user.role === EUserRole.Player) || [];

  const onMessage = useCallback((message: IMessage<unknown>) => {
    if (message.type === EMessageType.RoomStateChange) {
      refetch()
    }

    if (message.type === EMessageType.GameStarted) {
      const gameId = message.data;
      navigate(`/games/${gameId}`)
    }

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
      const response = await Api.post<{ gameId?: string }>('/rooms/join', body);

      if (roomData?.state === ERoomState.Started && response.data.gameId) {
        navigate(`/games/${response.data.gameId}`)
      }
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
      await Api.post<string>('/rooms/start', body);

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
            <span>Spectators: {spectators.length}</span>
          </div>
          <div className={styles.Room_content}>
            <span className={styles.Room_name}>Players:</span>
            <div>
              {players.map((user) => {
                return <div key={user.id}>
                  {user.name}
                </div>
              })}
            </div>
          </div>
          <div className={styles.Room_controls}>
            {players.every((player) => player.id !== userId) && <button onClick={handleJoinClick}>Join</button>}
            {spectators.every((player) => player.id !== userId) && <button onClick={handleSpectateClick}>Spectate</button>}
            {roomData.owner.id === userId && <button onClick={handleStartGameClick}>Start game</button>}
          </div>
        </div>


      </div>
  );
}
