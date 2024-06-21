import mongoose from 'mongoose';

const connection = mongoose.connect(
  `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`
);

export default connection;
