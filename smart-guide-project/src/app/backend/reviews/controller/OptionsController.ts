import { OptionModel, Option, OptionDto } from '../model/Option.js'
import { Request, Response } from 'express'

export const OptionsController = {
  async getOptionsByUserId(request: Request, response: Response) {
    const userId = request.body.userId;

    const options = await OptionModel.getUserOptions(userId);
    response.json(options);
  },

  async updateUserOptions(request: Request, response: Response) {
    const userId = request.body.userId;
    const finalOptions = request.body.options;

    await OptionModel.deleteAll(userId);
    const insertionPromises = finalOptions.map((optionName: string, index: number) => {
      const newOption: OptionDto = {
        description: "",
        name: optionName,
        userId: userId,
        ranking: 1
      };

      return OptionModel.insertOption(newOption);
    });

    try {
      await Promise.all(insertionPromises);

      response.json("All options updated properly (Parallelized)");
    } catch (error) {
      console.error("Error during batch insertion:", error);
      response.status(500).json({ message: "Failed to update all options." });
    }

    response.json("All options updated properly");
  }
}