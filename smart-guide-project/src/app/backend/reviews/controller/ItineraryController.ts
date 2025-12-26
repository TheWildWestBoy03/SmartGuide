import { Request, Response } from 'express';
import { ItineraryDto, Itinerary, ItineraryModel, ItineraryBuildingDto, ItineraryBuilding } from '../model/ItineraryModel.js'

export const ItineraryController = {
  async saveItinerary(request: Request, response: Response) {
    const { userId, distance, numberOfBuildings, ranking, optionBased } = request.body;
    const newItinerary: ItineraryDto = {
      userId, distance, numberOfBuildings, ranking, optionBased
    };

    try {
      const result = await ItineraryModel.saveItinerary(newItinerary);
      response.json(result);
    } catch (error) {
      response.json(error);
    }
  },

  async getItinerariesByUser(request: Request, response: Response) {
    const result = await ItineraryModel.getItinerariesByUser(request.body.userId);
    response.json(result);
  },

  async saveItineraryBuilding(request: Request, response: Response) {
    try {
      const itineraryBuilding: ItineraryBuildingDto = {
        buildingId: request.body.buildingId,
        itineraryId: request.body.itineraryId
      };

      const result = await ItineraryModel.saveItineraryBuilding(itineraryBuilding);
      response.json(result);
    } catch (error) {
      console.log(error);
    }
  },

  async getItineraryBuildingsByItineraryId(request: Request, response: Response) {
    const itineraryBuildings = await ItineraryModel.getItineraryBuildingsByItineraryId(request.body.itineraryId);
    response.json(itineraryBuildings);
  }
}
