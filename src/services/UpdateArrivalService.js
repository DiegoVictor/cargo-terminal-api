import { notFound } from '@hapi/boom';

class UpdateArrivalService {
  constructor(arrivalRepository, driverRepository, vehicleRepository) {
    this.arrivalRepository = arrivalRepository;
    this.driverRepository = driverRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async run({ id, vehicle_id, driver_id, filled, ...rest }) {
    const arrival = await this.arrivalRepository.findById(id);
    if (!arrival) {
      throw notFound('Arrival not found', { code: 146 });
    }

    if (vehicle_id) {
      if (!(await this.vehicleRepository.findById(vehicle_id))) {
        throw notFound('Vehicle not found', { code: 147 });
      }

      arrival.vehicle_id = vehicle_id;
    }

    if (driver_id) {
      if (!(await this.driverRepository.findById(driver_id))) {
        throw notFound('Driver not found', { code: 148 });
      }

      arrival.driver_id = driver_id;
    }

    ['origin', 'destination'].forEach(field => {
      if (rest[field]) {
        const { longitude, latitude } = rest[field];
        arrival[field] = [longitude, latitude];
      }
    });

    if (filled) {
      arrival.filled = filled;
    }

    await arrival.save();

    return arrival;
  }
}

export default UpdateArrivalService;
