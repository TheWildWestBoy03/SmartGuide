import { ReviewModel } from '../model/ReviewModel.js';
export const reviewController = {
    async createReview(req, res) {
        const { userId, buildingId, title, description, rating } = req.body;
        const newReview = {
            userId, buildingId, title, description, rating
        };
        await ReviewModel.saveReview(newReview);
        res.json("Review saved successfully");
    },
    async getReviewsByMonumentName(req, res) {
        const id = req.body.id;
        console.log(id);
        const results = await ReviewModel.getById(id);
        res.json(results);
    }
};
