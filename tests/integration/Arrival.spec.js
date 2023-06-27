import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import request from 'supertest';

import factory from '../utils/factory';
import Arrival from '../../src/models/Arrival';
import Driver from '../../src/models/Driver';
import Vehicle from '../../src/models/Vehicle';
import app from '../../src/app';

const res = {
  status: jest.fn(() => res),
  json: jest.fn((response) => response),
};

describe('Arrival controller', () => {
  beforeEach(async () => {
    await Arrival.deleteMany();
    await Driver.deleteMany();
    await Vehicle.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be able to get a list of arrivals', async () => {
    const vehicles = await factory.createMany('Vehicle', 3);
    const drivers = await factory.createMany(
      'Driver',
      3,
      vehicles.map(({ _id }) => ({ vehicle_id: _id }))
    );
    const arrivals = await factory.createMany(
      'Arrival',
      3,
      drivers.map(({ _id, vehicle_id }) => ({
        driver_id: _id,
        vehicle_id,
      }))
    );

    const response = await request(app).get('/v1/arrivals').expect(200).send();

    arrivals.forEach((arrival) => {
      const vehicle = vehicles.find(({ _id }) => _id === arrival.vehicle_id);
      const driver = drivers.find(({ _id }) => _id === arrival.driver_id);

      ['birthday', 'gender', 'vehicle_id'].forEach((field) => {
        delete driver[field];
      });

      expect(response.body).toContainEqual({
        ...arrival,
        vehicle,
        driver,
      });
    });
  });

  it('should be able to get a second page of arrivals', async () => {
    const page = 20;
    const vehicles = await factory.createMany('Vehicle', page + 3);
    const drivers = await factory.createMany(
      'Driver',
      page + 3,
      vehicles.map(({ _id }) => ({ vehicle_id: _id }))
    );
    await factory.createMany(
      'Arrival',
      page + 3,
      drivers.map(({ _id, vehicle_id }) => ({
        driver_id: _id,
        vehicle_id,
      }))
    );

    const response = await request(app)
      .get('/v1/arrivals?page=2')
      .expect(200)
      .send();

    expect(response.body.length).toBe(3);
  });

  it('should be able to get a list of arrivals filtered by filled', async () => {
    const vehicle = await factory.create('Vehicle');
    const driver = await factory.create('Driver', { vehicle_id: vehicle._id });

    const attrs = {
      vehicle_id: vehicle._id,
      driver_id: driver._id,
    };

    const [filled, unfilled] = await factory.createMany('Arrival', 2, [
      { filled: true, ...attrs },
      { filled: false, ...attrs },
    ]);

    const response = await request(app).get('/v1/arrivals?filled=1').send();
    ['birthday', 'gender', 'vehicle_id'].forEach((field) => {
      delete driver[field];
    });

    expect(response.body).toContainEqual({
      ...filled,
      vehicle,
      driver,
    });
    expect(response.body).not.toContainEqual(unfilled);
  });

  it('should be able to get a list of arrivals filtered by date', async () => {
    const dateStart = faker.date.past();
    const dateEnd = faker.date.future();

    const vehicle = await factory.create('Vehicle');
    const driver = await factory.create('Driver', { vehicle_id: vehicle._id });

    const attrs = {
      vehicle_id: vehicle._id,
      driver_id: driver._id,
    };

    const [arrivalOutRange, arrivalInRange] = await factory.createMany(
      'Arrival',
      2,
      [
        { createdAt: dateStart, ...attrs },
        { createdAt: dateEnd, ...attrs },
      ]
    );

    const response = await request(app)
      .get(
        `/v1/arrivals?date_start=${dateEnd.toISOString()}&date_end=${dateEnd.toISOString()}`
      )
      .send();
    ['birthday', 'gender', 'vehicle_id'].forEach((field) => {
      delete driver[field];
    });

    expect(response.body).toContainEqual({
      ...arrivalInRange,
      vehicle,
      driver,
    });
    expect(response.body).not.toContainEqual(arrivalOutRange);
  });

  it('should be able to get a list of arrivals filtered by end date', async () => {
    const vehicle = await factory.create('Vehicle');
    const driver = await factory.create('Driver', { vehicle_id: vehicle._id });

    const dateEnd = faker.date.future();

    const arrival = await factory.create('Arrival', {
      createdAt: dateEnd,
      driver_id: driver._id,
      vehicle_id: vehicle._id,
    });

    const response = await request(app)
      .get(`/v1/arrivals?date_end=${dateEnd.toISOString()}`)
      .expect(200)
      .send();
    ['birthday', 'gender', 'vehicle_id'].forEach((field) => {
      delete driver[field];
    });

    expect(response.body).toContainEqual({
      ...arrival,
      vehicle,
      driver,
    });
  });

  it('should be able to store a new arrival', async () => {
    const { _id: driver_id } = await factory.create('Driver');
    const { _id: vehicle_id } = await factory.create('Vehicle');
    const arrival = await factory.attrs('Arrival', {
      driver_id,
      vehicle_id,
    });

    delete arrival.filled;

    const response = await request(app)
      .post('/v1/arrivals')
      .expect(201)
      .send({
        ...arrival,
        origin: {
          latitude: arrival.origin[1],
          longitude: arrival.origin[0],
        },
        destination: {
          latitude: arrival.destination[1],
          longitude: arrival.destination[0],
        },
      });

    expect(response.body).toStrictEqual({
      _id: expect.any(String),
      id: expect.any(String),
      filled: false,
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
      ...arrival,
    });
  });

  it('should not be able to store a new arrival with a vehicle that not exists', async () => {
    const vehicle_id = new mongoose.Types.ObjectId();
    const { _id: driver_id } = await factory.create('Driver', { vehicle_id });
    const arrival = await factory.attrs('Arrival', {
      driver_id,
      vehicle_id,
    });

    delete arrival.filled;

    const response = await request(app)
      .post('/v1/arrivals')
      .expect(404)
      .send({
        ...arrival,
        origin: {
          latitude: arrival.origin[1],
          longitude: arrival.origin[0],
        },
        destination: {
          latitude: arrival.destination[1],
          longitude: arrival.destination[0],
        },
      });

    expect(response.body).toStrictEqual({
      message: 'Vehicle not found',
      error: 'Not Found',
      statusCode: 404,
      code: 144,
      docs: process.env.DOCS_URL,
    });
  });

  it('should not be able to store a new arrival with a driver that not exists', async () => {
    const { _id: vehicle_id } = await factory.create('Vehicle');
    const arrival = await factory.attrs('Arrival', {
      driver_id: new mongoose.Types.ObjectId(),
      vehicle_id,
    });

    delete arrival.filled;

    const response = await request(app)
      .post('/v1/arrivals')
      .expect(404)
      .send({
        ...arrival,
        origin: {
          latitude: arrival.origin[1],
          longitude: arrival.origin[0],
        },
        destination: {
          latitude: arrival.destination[1],
          longitude: arrival.destination[0],
        },
      });

    expect(response.body).toStrictEqual({
      message: 'Driver not found',
      error: 'Not Found',
      code: 145,
      statusCode: 404,
      docs: process.env.DOCS_URL,
    });
  });

  it('should not be able to update an arrival with a vehicle that not exists', async () => {
    const vehicle_id = new mongoose.Types.ObjectId();
    const vehicle = await factory.create('Vehicle');
    const { _id: driver_id } = await factory.create('Driver', {
      vehicle_id: vehicle._id,
    });

    const arrival = await factory.create('Arrival', {
      driver_id,
      vehicle_id: vehicle._id,
    });

    delete arrival.filled;

    const response = await request(app)
      .put(`/v1/arrivals/${arrival._id}`)
      .expect(404)
      .send({
        vehicle_id,
        driver_id,
      });

    expect(response.body).toStrictEqual({
      message: 'Vehicle not found',
      error: 'Not Found',
      code: 147,
      statusCode: 404,
      docs: process.env.DOCS_URL,
    });
  });

  it('should not be able to update an arrival with a driver that not exists', async () => {
    const driver_id = new mongoose.Types.ObjectId();
    const driver = await factory.create('Driver');
    const { _id: vehicle_id } = await factory.create('Vehicle');

    const arrival = await factory.create('Arrival', {
      driver_id: driver._id,
      vehicle_id,
    });

    const response = await request(app)
      .put(`/v1/arrivals/${arrival._id}`)
      .expect(404)
      .send({
        driver_id,
      });

    expect(response.body).toStrictEqual({
      message: 'Driver not found',
      error: 'Not Found',
      code: 148,
      statusCode: 404,
      docs: process.env.DOCS_URL,
    });
  });

  it('should not be able to update an arrival that not exists', async () => {
    const arrival_id = new mongoose.Types.ObjectId();

    const response = await request(app)
      .put(`/v1/arrivals/${arrival_id}`)
      .expect(404)
      .send({
        origin: {
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        },
      });

    expect(response.body).toStrictEqual({
      message: 'Arrival not found',
      error: 'Not Found',
      code: 146,
      statusCode: 404,
      docs: process.env.DOCS_URL,
    });
  });

  it('should be able to update an arrival', async () => {
    const { _id: vehicle_id } = await factory.create('Vehicle');
    const [{ _id: driver_id }, driver] = await factory.createMany('Driver', 2, {
      vehicle_id,
    });

    const arrival = await factory.create('Arrival', {
      driver_id,
      vehicle_id,
      filled: false,
    });
    const { origin, destination } = await factory.attrs('Arrival');

    const response = await request(app)
      .put(`/v1/arrivals/${arrival._id}`)
      .expect(200)
      .send({
        driver_id: driver._id,
        filled: true,
        origin: {
          latitude: origin[1],
          longitude: origin[0],
        },
        destination: {
          latitude: destination[1],
          longitude: destination[0],
        },
        vehicle_id,
      });

    expect(response.body).toMatchObject({
      ...arrival,
      driver_id: driver._id,
      vehicle_id,
      filled: true,
      updatedAt: expect.any(String),
      origin,
      destination,
    });
  });
});
