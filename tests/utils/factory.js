import factory from 'factory-girl';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';

import Arrival from '../../src/models/Arrival';
import Driver from '../../src/models/Driver';
import Vehicle from '../../src/models/Vehicle';

factory.define(
  'Vehicle',
  Vehicle,
  {
    model: faker.vehicle.model,
    type: () => faker.number.int({ min: 1, max: 5 }),
  },
  {
    afterCreate: (vehicle) => ({
      ...vehicle.toJSON(),
      _id: vehicle._id.toString(),
    }),
  }
);

factory.define(
  'Driver',
  Driver,
  {
    cpf: () => String(faker.number.int({ min: 10000000000, max: 99999999999 })),
    name: faker.person.fullName,
    phone: faker.phone.number,
    birthday: () => faker.date.past({ years: 2000 }).toString(),
    gender: () => faker.helpers.arrayElement(['F', 'M']),
    vehicle_id: new mongoose.Types.ObjectId(),
    cnh_number: () =>
      String(faker.number.int({ min: 10000000000, max: 99999999999 })),
    cnh_type: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
  },
  {
    afterCreate: (driver) => ({
      ...driver.toJSON(),
      _id: driver._id.toString(),
      vehicle_id: driver.vehicle_id.toString(),
    }),
  }
);

factory.define(
  'Arrival',
  Arrival,
  {
    filled: faker.datatype.boolean,
    driver_id: () => new mongoose.Types.ObjectId(),
    vehicle_id: () => new mongoose.Types.ObjectId(),
    origin: () => [
      Number(faker.location.longitude()),
      Number(faker.location.latitude()),
    ],
    destination: () => [
      Number(faker.location.longitude()),
      Number(faker.location.latitude()),
    ],
  },
  {
    afterCreate: (arrival) => ({
      ...arrival.toJSON(),
      _id: arrival._id.toString(),
      vehicle_id: arrival.vehicle_id.toString(),
      driver_id: arrival.driver_id.toString(),
      createdAt: arrival.createdAt.toISOString(),
      updatedAt: arrival.updatedAt.toISOString(),
    }),
  }
);

export default factory;
