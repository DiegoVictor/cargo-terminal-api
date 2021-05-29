import 'dotenv/config';
import Express from 'express';
import Mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';

import routes from './routes';

const App = Express();

Mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

App.use(cors());
App.use(helmet());

App.use(routes);

App.listen(process.env.APP_PORT);
