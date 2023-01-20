import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../../interfaces/user';

export class UserService {
  public users: IUser[]

  constructor(users: IUser[] = []) {
    this.users = users;
  }

  add(username: string) {
    this.users.push({ id: uuidv4(), name: username, role: null })
    return this.users[this.users.length - 1];
  }

  remove(id: string) {
    this.users = this.users.filter((usr) => usr.id !== id);
  }

  getUnsafe(id?: string) {
    const user = this.users.find((usr) => usr.id === id);
    return user;
  }

  get(id?: string) {
    const user = this.getUnsafe(id);

    if (!user) {
      throw Error(`Cant find user with ID ${id}`);
    }
    return user;
  }

}

export const userService = new UserService();