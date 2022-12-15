import mongoose from 'mongoose';
import request from 'supertest';

import factory from '../utils/factory';
import Vehicle from '../../src/models/Vehicle';
import app from '../../src/app';

describe('Vehicle', () => {
  beforeEach(async () => {
    await Vehicle.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be able to get a list of vehicles', async () => {
    const vehicles = await factory.createMany('Vehicle', 3);

    const response = await request(app).get('/v1/vehicles').expect(200).send();

    vehicles.forEach((vehicle) => {
      expect(response.body).toContainEqual(vehicle);
    });
  });

  it('should be able to get a second page of vehicles', async () => {
    const page = 20;
    await factory.createMany('Vehicle', page + 3);

    const response = await request(app)
      .get('/v1/vehicles?page=2')
      .expect(200)
      .send();

    expect(response.body.length).toBe(3);
  });

  it('should be able to store a new vehicle', async () => {
    const vehicle = await factory.attrs('Vehicle');

    const response = await request(app)
      .post('/v1/vehicles')
      .expect(201)
      .send(vehicle);

    const savedVehicle = await Vehicle.findOne();

    expect(response.body).toStrictEqual({
      _id: savedVehicle._id.toString(),
      ...vehicle,
    });
  });

  it('should be able to update a vehicle', async () => {
    const { _id } = await factory.create('Vehicle');
    const { type, model } = await factory.attrs('Vehicle');

    const response = await request(app)
      .put(`/v1/vehicles/${_id}`)
      .expect(200)
      .send({ type, model });

    expect(response.body).toStrictEqual({
      _id: _id.toString(),
      type,
      model,
    });
  });

  it('should not be able to update a vehicle that not exists', async () => {
    const id = new mongoose.Types.ObjectId();
    const { type, model } = await factory.attrs('Vehicle');
    const response = await request(app)
      .put(`/v1/vehicles/${id}`)
      .expect(404)
      .send({ type, model });

    expect(response.body).toStrictEqual({
      message: 'Vehicle not found',
      error: 'Not Found',
      statusCode: 404,
      code: 344,
      docs: process.env.DOCS_URL,
    });
  });
});
