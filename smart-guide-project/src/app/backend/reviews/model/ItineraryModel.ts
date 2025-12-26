import { db } from '../config/DatabaseConfig.js'
import { OkPacket, RowDataPacket } from 'mysql2'

export interface ItineraryDto {
  userId: number,
  numberOfBuildings: number,
  distance: number,
  ranking: number,
  optionBased: string,
}
export interface Itinerary {
  itineraryId: number,
  userId: number,
  numberOfBuildings: number,
  distance: number,
  ranking: number,
  optionBased: string,
}

export interface ItineraryBuildingDto {
  itineraryId: number,
  buildingId: number
}

export interface ItineraryBuilding {
  itineraryId: number,
  buildingId: number,
  itineraryBuildingId: number;
}

export const ItineraryModel = {
  async saveItinerary(itinerary: ItineraryDto): Promise<OkPacket> {
    const [result] = await db.query<OkPacket>("insert into itineraries (userId, numberOfBuildings, distance, ranking, optionBased) \
        values (?, ?, ?, ?, ?)", [itinerary.userId, itinerary.numberOfBuildings, itinerary.distance, itinerary.ranking, itinerary.optionBased]);
    return result;
  },

  async getItinerariesByUser(userId: number): Promise<Itinerary[]> {
    const [rows] = await db.query("select * from itineraries where userId = ?", [userId]);
    return rows as Itinerary[];
  },

  async saveItineraryBuilding(itineraryBuilding: ItineraryBuildingDto) {
    const [result] = await db.query<OkPacket>("insert into itineraryBuilding (itineraryId, buildingId) \
                values (?, ?)", [itineraryBuilding.itineraryId, itineraryBuilding.buildingId]);

    return result;
  },

  async getItineraryBuildingsByItineraryId(itineraryId: number) {
    const [result] = await db.query("select * from itineraryBuilding where itineraryId = ?", [itineraryId]);
    return result;
  }
}
