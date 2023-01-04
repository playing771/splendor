import React, { ReactElement, useContext, useMemo, useState } from 'react';

interface IGlobalState {
  username: string;
  userId: string;
  setUserState: React.Dispatch<
    React.SetStateAction<{
      username: string;
      userId: string;
    }>
  >;
}

export const globalStateContext = React.createContext({} as IGlobalState);

export const useGlobalState = () => {
  const context = useContext(globalStateContext);


  console.log('context',context);
  

  if (context.userId === undefined) {
    throw Error('cant user useGlobalState outside of globalStateContext');
  }
  return context;
};

export const GlobalStateProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [userState, setUserState] = useState<{
    username: string;
    userId: string;
  }>({
    username: '',
    userId: '',
  });

  console.log('userState',userState);
  

  const contextValue = useMemo(() => {
    return {
      ...userState,
      setUserState,
    };
  }, [userState]);

  return (
    <globalStateContext.Provider value={contextValue}>
      {children}
    </globalStateContext.Provider>
  );
};
