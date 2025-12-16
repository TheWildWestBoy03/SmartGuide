import { db } from '../config/DatabaseConfig.js';
;
export const ReviewModel = {
    async getAll() {
        const [rows] = await db.query("select * from reviews");
        return rows;
    },
    async saveReview(review) {
        console.log(review);
        const [result] = await db.query("insert into reviews (userId, buildingId, title, description, rating) values(?, ?, ?, ?, ?)", [review.userId, review.buildingId, review.title, review.description, review.rating]);
        return result;
    },
    async getById(id) {
        console.log(id);
        const [rows] = await db.query("select * from reviews where buildingId = ?", [id]);
        return rows;
    }
};
