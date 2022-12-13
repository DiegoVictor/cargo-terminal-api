import { Router } from 'express';

import drivers from './drivers';
import vehicles from './vehicles';
import arrivals from './arrivals';
import travels from './travels';

const app = Router();

app.use('/drivers', drivers);
app.use('/vehicles', vehicles);
app.use('/arrivals', arrivals);
app.use('/travels', travels);

export default app;
