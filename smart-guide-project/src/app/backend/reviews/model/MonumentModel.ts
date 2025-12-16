
import { db } from '../config/DatabaseConfig.js'
import { OkPacket, RowDataPacket } from 'mysql2'

export interface MonumentDto {
  picturesPath: String;
  name: String;
  summary: String;
  year: number;
  category: String,
  address: String,
  rating: number
};

export interface Monument {
  buildingId: number,
  picturesPath: String;
  name: String;
  summary: String;
  year: number;
  category: String,
  address: String,
  rating: number
};

export const MonumentModel = {
  async getAll(): Promise<Monument[]> {
    const [rows] = await db.query("select * from buildings");
    return rows as Monument[];
  },

  async findOneByName(name: String): Promise<Monument | null> {
    try {
      const [rows] = await db.query("SELECT * FROM buildings WHERE name = ?", [name]) as RowDataPacket[];
      const monument = rows[0] as Monument;
      return monument;
    } catch (error) {
      return null;
    }
  }
}
