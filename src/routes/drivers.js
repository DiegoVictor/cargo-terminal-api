import { Router } from 'express';

import DriverController from '../controllers/DriverController';
import idValidator from '../validators/idValidator';
import * as driverValidator from '../validators/driverValidator';
import activeVehiclePageValidator from '../validators/activeVehiclePageValidator';

const app = Router();
const driverController = new DriverController();

app.get('/', activeVehiclePageValidator, driverController.index);
app.post('/', driverValidator.store, driverController.store);
app.put('/:id', idValidator, driverValidator.update, driverController.update);

export default app;
