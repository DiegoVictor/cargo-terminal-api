import { Router } from 'express';

import arrivals from './arrivals';
import travels from './travels';

const app = Router();

app.use('/arrivals', arrivals);
app.use('/travels', travels);

export default app;
