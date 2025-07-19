import request from 'supertest';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import factory from '../utils/factory';
import Arrival from '../../src/models/Arrival';
import Driver from '../../src/models/Driver';
import Vehicle from '../../src/models/Vehicle';
import app from '../../src/app';

describe('Travel controller', () => {
  beforeEach(async () => {
    await Promise.all([
      Driver.deleteMany(),
      Vehicle.deleteMany(),
      Arrival.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be return a list of origins and destinations grouped by type', async () => {
    const { _id: driver_id } = await factory.create('Driver');
    const vehicles = await factory.createMany(
      'Vehicle',
      4,
      Array.from({ length: 4 }, () => ({
        type: faker.number.int({ min: 1, max: 2 }),
      }))
    );

    const arrivals = await factory.createMany(
      'Arrival',
      4,
      vehicles.map((vehicle) => ({ vehicle_id: vehicle._id, driver_id }))
    );

    arrivals.sort((a, b) => a._id - b._id);

    const response = await request(app).get('/v1/travels').expect(200).send();

    const groups = arrivals.reduce((group, arrival) => {
      vehicles.forEach((vehicle) => {
        if (vehicle._id.toString() === arrival.vehicle_id.toString()) {
          if (!group[vehicle.type]) {
            group[vehicle.type] = {
              destinations: [arrival.destination],
              origins: [arrival.origin],
            };
          } else {
            group[vehicle.type].destinations.push(arrival.destination);
            group[vehicle.type].origins.push(arrival.origin);
          }
        }
      });

      return group;
    }, {});

    Object.keys(groups).forEach((vehicleType) => {
      expect(response.body).toContainEqual({
        ...groups[vehicleType],
        type: Number(vehicleType),
      });
    });
  });
});
