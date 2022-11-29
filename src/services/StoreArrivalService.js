import { notFound } from '@hapi/boom';

class StoreArrivalService {
  constructor(arrivalRepository, driverRepository, vehicleRepository) {
    this.arrivalRepository = arrivalRepository;
    this.driverRepository = driverRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async run({ filled, vehicle_id, driver_id, origin, destination }) {
    const [vehicle, driver] = await Promise.all([
      this.vehicleRepository.findById(vehicle_id),
      this.driverRepository.findById(driver_id),
    ]);

    if (!vehicle) {
      throw notFound('Vehicle not found', { code: 144 });
    }

    if (!driver) {
      throw notFound('Driver not found', { code: 145 });
    }

    const arrival = await this.arrivalRepository.create({
      driver_id,
      filled,
      vehicle_id,
      origin: [origin.longitude, origin.latitude],
      destination: [destination.longitude, destination.latitude],
    });

    return arrival;
  }
}

export default StoreArrivalService;
