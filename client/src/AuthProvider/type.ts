import { Nullable } from "../../../utils/typescript";

export interface IAuthState {
  userId: Nullable<string>;
  update: ()=>Promise<void>
}