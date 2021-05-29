import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';

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

App.use(routes);

App.listen(process.env.APP_PORT);
