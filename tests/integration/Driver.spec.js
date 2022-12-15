import mongoose from 'mongoose';
import request from 'supertest';

import dayjs from 'dayjs';
import factory from '../utils/factory';
import Driver from '../../src/models/Driver';
import Vehicle from '../../src/models/Vehicle';
import app from '../../src/app';

const res = {
  status: jest.fn(() => res),
  json: jest.fn((response) => response),
};

describe('Driver controller', () => {
  beforeEach(async () => {
    await Driver.deleteMany();
    await Vehicle.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be able to get a list of drivers', async () => {
    const drivers = await factory.createMany('Driver', 3);

    const response = await request(app).get('/v1/drivers').expect(200).send();

    drivers.forEach((driver) => {
      expect(response.body).toContainEqual(driver);
    });
  });

  it('should be able to get a second page of drivers', async () => {
    const page = 20;

    await factory.createMany('Driver', page + 3);
    const response = await request(app)
      .get('/v1/drivers?page=2')
      .expect(200)
      .send();

    expect(response.body.length).toBe(3);
  });

  it('should be able to get a list of drivers filtered by vehicle', async () => {
    const vehicle = await factory.create('Vehicle');
    const drivers = await factory.createMany('Driver', 2, {
      vehicle_id: vehicle._id,
    });

    const response = await request(app)
      .get('/v1/drivers?vehicle=1')
      .expect(200)
      .send();

    const { existsVehicle, noVehicle } = drivers.reduce(
      (group, driver) => {
        if (driver.vehicle_id === vehicle._id) {
          group.existsVehicle.push(driver);
        } else {
          group.noVehicle.push(driver);
        }
        return group;
      },
      { existsVehicle: [], noVehicle: [] }
    );

    existsVehicle.forEach((driver) => {
      expect(response.body).toContainEqual(driver);
    });

    noVehicle.forEach((driver) => {
      expect(response.body).toContainEqual(driver);
    });
  });

  it('should be able to get a list of drivers filtered by active', async () => {
    const { _id } = await factory.create('Driver', { active: false });
    const drivers = await factory.createMany('Driver', 3);

    const response = await request(app)
      .get('/v1/drivers?active=1')
      .expect(200)
      .send();

    drivers.forEach((driver) => {
      expect(response.body).toContainEqual(driver);
    });
    expect(response.body.map((driver) => driver._id)).not.toContainEqual(_id);
  });

  it('should be able to store a new driver', async () => {
    const birthday = dayjs().subtract(3, 'hours').subtract(20, 'years');
    const vehicle = await factory.create('Vehicle');
    const driver = await factory.attrs('Driver', {
      vehicle_id: vehicle._id,
      birthday: birthday.format('YYYY-MM-DD[T]HH:mm:ss'),
    });

    const response = await request(app)
      .post('/v1/drivers')
      .expect(201)
      .send(driver);

    expect(response.body).toStrictEqual({
      _id: expect.any(String),
      active: true,
      ...driver,
      birthday: birthday.format('YYYY-MM-DD'),
    });
  });

  it('should not be able to store a new driver with a vehicle that not exists', async () => {
    const driver = await factory.attrs('Driver');

    const response = await request(app)
      .post('/v1/drivers')
      .expect(404)
      .send(driver);

    expect(response.body).toStrictEqual({
      message: 'Vehicle not found',
      code: 244,
      error: 'Not Found',
      statusCode: 404,
      docs: process.env.DOCS_URL,
    });
  });

  it('should be able to update a driver', async () => {
    const birthday = dayjs().subtract(3, 'hours').subtract(20, 'years');

    const vehicle = await factory.create('Vehicle');
    const { _id: driver_id } = await factory.create('Driver');
    const driver = await factory.attrs('Driver', {
      birthday: birthday.format('YYYY-MM-DD[T]HH:mm:ss'),
    });

    const response = await request(app)
      .put(`/v1/drivers/${driver_id}`)
      .expect(200)
      .send({
        ...driver,
        vehicle_id: vehicle._id,
      });

    expect(response.body).toStrictEqual({
      _id: driver_id,
      active: true,
      ...driver,
      vehicle_id: vehicle._id,
      birthday: birthday.format('YYYY-MM-DD'),
    });
  });

  it('should not be able to update a driver that not exists', async () => {
    const vehicle = await factory.create('Vehicle');
    const driver = await factory.attrs('Driver', { vehicle_id: vehicle._id });

    const response = await request(app)
      .put(`/v1/drivers/${new mongoose.Types.ObjectId()}`)
      .expect(404)
      .send(driver);

    expect(response.body).toStrictEqual({
      message: 'Driver not found',
      error: 'Not Found',
      statusCode: 404,
      code: 245,
      docs: process.env.DOCS_URL,
    });
  });

  it('should not be able to update a driver with a vehicle that not exists', async () => {
    const vehicle = await factory.create('Vehicle');
    const { _id: driver_id } = await factory.create('Driver', {
      vehicle_id: vehicle._id,
    });

    const vehicle_id = new mongoose.Types.ObjectId();
    const driver = await factory.attrs('Driver', {
      vehicle_id,
    });

    const response = await request(app)
      .put(`/v1/drivers/${driver_id}`)
      .expect(404)
      .send(driver);

    expect(response.body).toStrictEqual({
      message: 'Vehicle not found',
      error: 'Not Found',
      statusCode: 404,
      code: 246,
      docs: process.env.DOCS_URL,
    });
  });
});
