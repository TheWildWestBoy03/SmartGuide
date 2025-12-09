import { db } from '../config/DatabaseConfig.js'
import { OkPacket, RowDataPacket } from 'mysql2'
export interface User {
    firstName : String;
    lastName : String;
    password : String;
    email : String;
    options : String[];
}

export const UserModel = {
    async getAll() : Promise<User[]> {
        const [rows] = await db.query("select * from users");
        return rows as User[];
    },

  async create(user: User): Promise<OkPacket> {
    const [result] = await db.query<OkPacket>("insert into users (firstname, lastname, email, password) values (?, ?, ?, ?) ", [
      user.firstName, user.lastName, user.email, user.password
    ]);

    return result as OkPacket;
  },

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]) as RowDataPacket[];
      const user = rows[0] as User;
      return user;
    } catch (error) {
      return null;
    }
  }
}