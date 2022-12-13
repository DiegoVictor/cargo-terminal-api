import { Router } from 'express';

import vehicles from './vehicles';
import arrivals from './arrivals';
import travels from './travels';

const app = Router();

app.use('/vehicles', vehicles);
app.use('/arrivals', arrivals);
app.use('/travels', travels);

export default app;
