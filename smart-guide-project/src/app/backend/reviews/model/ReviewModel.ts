import { db } from '../config/DatabaseConfig.js'
import { OkPacket, RowDataPacket } from 'mysql2'
export interface ReviewDto {
  userId: number,
  buildingId: number,
  title: string,
  description: string,
  rating: number;
};

export interface Review {
  reviewId: number,
  userId: number,
  buildingId: number,
  title: string,
  description: string,
  rating: number;
}

export const ReviewModel = {
  async getAll(): Promise<Review[]> {
    const [rows] = await db.query("select * from reviews");
    return rows as Review[];
  },
  async saveReview(review: ReviewDto): Promise<OkPacket> {
    console.log(review);
    const [result] = await db.query<OkPacket>("insert into reviews (userId, buildingId, title, description, rating) values(?, ?, ?, ?, ?)", [review.userId, review.buildingId, review.title, review.description, review.rating]);
    return result;
  },
  async getById(id: number): Promise<Review[]> {
    console.log(id);
    const [rows] = await db.query("select * from reviews where buildingId = ?", [id]);
    return rows as Review[];
  }
};
