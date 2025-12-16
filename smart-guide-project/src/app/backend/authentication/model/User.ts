
import { db } from '../config/DatabaseConfig.js'
import { OkPacket, RowDataPacket } from 'mysql2'
export interface UserDto {
  firstName: String;
  lastName: String;
  password: String;
  email: String;
  options: String[];
}
export interface User {
  userId: number,
  firstName: String;
  lastName: String;
  password: String;
  email: String;
  options: String[];
}


export const UserModel = {
  async getAll(): Promise<UserDto[]> {
    const [rows] = await db.query("select * from users");
    return rows as User[];
  },

  async create(user: UserDto): Promise<OkPacket> {
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
  },

  async findById(userId: number): Promise<User | null> {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE userId = ?", [userId]) as RowDataPacket[];
      const user = rows[0] as User;
      return user;
    } catch (error) {
      return null;
    }
  }
}
