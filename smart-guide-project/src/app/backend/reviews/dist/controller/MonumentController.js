import { MonumentModel } from '../model/MonumentModel.js';
export const monumentController = {
    async getMonumentsInformation(req, res) {
        const monuments = await MonumentModel.getAll();
        res.json(monuments);
    }
};
