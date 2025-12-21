import { Request, Response } from 'express'
import { MonumentModel, Monument } from '../model/MonumentModel.js'

export const monumentController = {
  async getMonumentsInformation(req: Request, res: Response) {
    const monuments = await MonumentModel.getAll();
    res.json(monuments);
  },
  async getMonumentByName(req: Request, res: Response) {
    const monument = await MonumentModel.findOneByName(req.body.name);
    res.json(monument);
  },
  async getMonumentsByUser(req: Request, res: Response) {
    const monuments = await MonumentModel.getAllByUser(req.body.email);
    res.json(monuments);
  }
}
