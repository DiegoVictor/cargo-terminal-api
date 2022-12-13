import { Router } from 'express';

import ArrivalController from '../controllers/ArrivalController';
import idValidator from '../validators/idValidator';
import * as arrivalValidator from '../validators/arrivalValidator';
import filledDateStartDateEndPageValidator from '../validators/filledDateStartDateEndPageValidator';

const app = Router();
const arrivalController = new ArrivalController();

app.get('/', filledDateStartDateEndPageValidator, arrivalController.index);
app.post('/', arrivalValidator.store, arrivalController.store);
app.put('/:id', idValidator, arrivalValidator.update, arrivalController.update);

export default app;
