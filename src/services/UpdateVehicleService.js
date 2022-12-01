import { notFound } from '@hapi/boom';

class UpdateVehicleService {
  constructor(vehicleRepository) {
    this.vehicleRepository = vehicleRepository;
  }

  async run({ id, type, model }) {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw notFound('Vehicle not found', { code: 344 });
    }

    vehicle.type = type;
    vehicle.model = model;

    await vehicle.save();

    return vehicle;
  }
}

export default UpdateVehicleService;
