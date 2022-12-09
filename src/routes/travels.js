import { Router } from 'express';

import TravelController from '../controllers/TravelController';

const app = Router();
const travelController = new TravelController();

app.get('/', travelController.index);

export default app;
