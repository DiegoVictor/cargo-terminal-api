import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { errors } from 'celebrate';

import routes from './routes';

const App = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

App.use(cors());
App.use(helmet());
App.use(express.json());

App.use('/v1', routes);

App.use(errors());
App.use(async (error, _, response, next) => {
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

export default App;
