import { useCallback } from 'react';
import { Api } from '../../Api';

import { IRoomShape } from '../../../../interfaces/room';
import { useRequest } from '../../utils/useRequest';
import { AxiosError } from 'axios';

import { EUserRole } from '../../../../interfaces/user';
import { useNavigate } from 'react-router-dom';
import { useWebsockets } from '../../utils/useWebsockets';
import { useErrorToast } from '../../utils/useErrorToast';
import { EMessageType, IMessage } from '../../../../interfaces/api';

import styles from './styles.module.scss';
interface IProps {
}

export const RoomsPage = (props: IProps) => {
  const { data = [], isLoading, refetch } = useRequest<IRoomShape[]>('/rooms');
  const navigate = useNavigate();
  const toastError = useErrorToast()
  
  const onMessage = useCallback((message: IMessage<unknown>)=>{
    if (message.type === EMessageType.RoomsChange) {
      refetch()
    }
    
  },[])
  const onError = useCallback((error: any)=> {
    toastError(error);
  },[])

  useWebsockets(onMessage, onError)

  const createRoomRequest = async () => {
    try {
      const response = await Api.post<IRoomShape>('/rooms/create');
      navigate(response.data.id)
      
    } catch (error) {
      toastError(error as unknown as AxiosError<string>)
    }
  }

  const handleEnterRoomClick = (roomId: string) => () => {
    navigate(`${roomId}`)
  }

  return !data ? <span> ...loading </span> : <div className={styles.Page}>
    <div className={styles.Page_header}>
      <h1>Rooms</h1>
      <button onClick={createRoomRequest}>Create Room</button>
    </div>
    <div className={styles.RoomsList}>
      {
        data.map((room) => {
          return <div key={room.id} className={styles.Room}>
            <div className={styles.Room_content}>
              <span className={styles.Room_name}>{room.name}</span>
              <span>{room.state}</span>
              <span>Players: {room.users.filter((user) => user.role === EUserRole.Player).length}</span>
            </div>
            <div className={styles.Room_controls}>
              <button onClick={handleEnterRoomClick(room.id)}>Enter</button>
            </div>
          </div>
        })
      }
    </div>
  </div>;
};
