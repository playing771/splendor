import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { IUser } from '../../../interfaces/user';
import { useErrorToast } from '../utils/useErrorToast';
import { useRequest } from '../utils/useRequest';

import { authContext } from './context';
import { IAuthState } from './type';

interface IProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: IProps) => {
  const toastError = useErrorToast()
  // const [authState, setAuthState] = useState<IAuthState>({ userId: null });

  const { data, isLoading, error, refetch } = useRequest<IUser>('/auth/userInfo');

  useEffect(() => {
    if (error) {
      toastError(error);
    }
  }, [error])

  const update = useCallback(()=>{
    return refetch();
  },[])

  const contextValue: IAuthState = useMemo(() => {
    return {
      userId: data?.id || null,
      update
    }
  }, [data])

  return <authContext.Provider value={contextValue}>{children}</authContext.Provider>
};
