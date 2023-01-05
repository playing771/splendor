import { v4 as uuidv4 } from 'uuid';


export interface IUser {
  id: string,
  name: string
}

export class UserService {
  public users: IUser[]

  constructor(users: IUser[] = []) {
    this.users = users;
  }

  add(username: string) {
    const user = this.getByUsername(username);
    if (user) {
      return user;
    }
    
    this.users.push({ id: uuidv4(), name: username })
    return this.users[this.users.length -1];
  }

  remove(id: string) {
    this.users = this.users.filter((usr)=>usr.id !== id);
  }

  get(id: string) {
    const user = this.users.find((usr)=>usr.id === id);
    return user;
  }

  getByUsername(username: string) {
    const user = this.users.find((usr)=>usr.name === username);
    return user;
  }
}

export const userService = new UserService();