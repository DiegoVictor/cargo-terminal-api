import { MongoMemoryServer } from 'mongodb-memory-server';

module.exports = async () => {
  const mongod = new MongoMemoryServer();
  global.__MONGOD__ = mongod;

  await mongod.start();

  const config = mongod.instanceInfo;
  if (config) {
    const { port, dbName, ip } = config;

    process.env.MONGO_HOST = ip;
    process.env.MONGO_PORT = String(port);
    process.env.MONGO_DB = dbName;
  }
};
