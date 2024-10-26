// import { DatabaseLibrary } from '../database/DatabaseLibrary';

export class UserService {

//   constructor(private dbLib: DatabaseLibrary) {}

  public async createUser(username: string, password: string) {
    console.log('createee')
    return true
  }

  public async authenticateUser(username: string, password: string) {
    
    console.log('AUTHss')
    return true
  }

}