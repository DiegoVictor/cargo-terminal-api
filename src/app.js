import 'dotenv/config';
import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import { errors } from 'celebrate';
import { isBoom } from '@hapi/boom';

import './database/mongodb';
import routes from './routes';
import routeAliases from './middlewares/routeAliases';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(routeAliases);

app.use('/v1', routes);

app.use(errors());
app.use(async (error, _, response, next) => {
  if (isBoom(error)) {
    const { statusCode, payload } = error.output;

    return response.status(statusCode).json({
      ...payload,
      ...error.data,
      docs: process.env.DOCS_URL,
    });
  }

  return next(error);
});

export default app;
