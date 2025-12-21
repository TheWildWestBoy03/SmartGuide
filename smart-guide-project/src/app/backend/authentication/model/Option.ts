import { db } from '../config/DatabaseConfig.js';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface OptionDto {
  description: string;
  userId: number;
  ranking: number;
  name: string;
}
export interface Option {
  optionId: number,
  description: string;
  userId: number;
  ranking: number;
  name: string;
}

export const OptionModel = {
  async getUserOptions(userId: number): Promise<Option[]> {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM options WHERE userId = ?",
      [userId]
    );

    return rows as Option[];
  },

  async getUserOption(userId: number, optionName: string): Promise<Option | null> {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM options WHERE userId = ? AND name = ?",
      [userId, optionName]
    );

    if (rows.length === 0) return null;

    return rows[0] as Option;
  },

  async insertOption(option: OptionDto): Promise<OkPacket> {
    const [result] = await db.query<OkPacket>(
      'INSERT INTO options (userId, name, description, ranking) VALUES (?, ?, ?, ?)',
      [option.userId, option.name, option.description, option.ranking]
    );

    return result;
  },

  async insertUserOption(option: OptionDto): Promise<OkPacket> {
    const [result] = await db.query<OkPacket>(
      'INSERT INTO options (userId, name, description, ranking) VALUES (?, ?, ?, ?)',
      [option.userId, option.name, option.description, option.ranking]
    );

    return result;
  },

  async deleteAll(userId: number): Promise<OkPacket> {
    const [result] = await db.query<OkPacket>(
      'delete from options where userId = ?', [userId]
    );

    return result;
  }
};
