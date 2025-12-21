import { Request, Response } from 'express'
import { ReviewModel, Review, ReviewDto } from '../model/ReviewModel.js'

export const reviewController = {
  async createReview(req: Request, res: Response) {
    const { userId, buildingId, title, description, rating } = req.body;

    const newReview: ReviewDto = {
      userId, buildingId, title, description, rating
    };

    await ReviewModel.saveReview(newReview);
    res.json("Review saved successfully");
  },

  async getReviewsByMonumentName(req: Request, res: Response) {
    const id = req.body.id;
    console.log(id);
    const results = await ReviewModel.getById(id);

    res.json(results);
  }
}
