import { createContext, useContext } from "react";
import { IAuthState } from "./type";

export const authContext = createContext<IAuthState>({} as IAuthState);

export const useAuth = () => {

  const context = useContext(authContext);

  return context;
}