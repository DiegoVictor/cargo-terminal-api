import { Router } from 'express';

import VehicleController from '../controllers/VehicleController';

import idValidator from '../validators/idValidator';
import pageValidator from '../validators/pageValidator';
import vehicleValidator from '../validators/vehicleValidator';

const app = Router();
const vehicleController = new VehicleController();

app.get('/', pageValidator, vehicleController.index);
app.post('/', vehicleValidator, vehicleController.store);
app.put('/:id', idValidator, vehicleValidator, vehicleController.update);

export default app;
