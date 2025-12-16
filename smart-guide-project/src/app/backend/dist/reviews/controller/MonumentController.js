import { MonumentModel } from '../model/MonumentModel.js';
export const monumentController = {
    async getMonumentsInformation(req, res) {
        const monuments = await MonumentModel.getAll();
        res.json(monuments);
    },
    async getMonumentByName(req, res) {
        const monument = await MonumentModel.findOneByName(req.body.name);
        res.json(monument);
    }
};
