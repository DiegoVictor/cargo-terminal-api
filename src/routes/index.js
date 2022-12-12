import { Router } from 'express';

import travels from './travels';

const app = Router();

app.use('/travels', travels);
export default app;
