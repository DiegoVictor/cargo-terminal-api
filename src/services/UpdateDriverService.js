import { notFound } from '@hapi/boom';
import dayjs from 'dayjs';

class UpdateDriverService {
  constructor(driverRepository, vehicleRepository) {
    this.driverRepository = driverRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async run({ id, vehicle_id, ...rest }) {
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw notFound('Driver not found', { code: 245 });
    }

    if (vehicle_id) {
      if (!(await this.vehicleRepository.findById(vehicle_id))) {
        throw notFound('Vehicle not found', { code: 246 });
      }

      driver.vehicle_id = vehicle_id;
    }

    [
      'cpf',
      'name',
      'phone',
      'birthday',
      'gender',
      'cnh_number',
      'cnh_type',
      'active',
    ].forEach(field => {
      if (rest[field]) {
        driver[field] = rest[field];
      }
    });

    if (rest.birthday) {
      driver.birthday = dayjs(rest.birthday).format('YYYY-MM-DD');
    }

    await driver.save();

    return driver;
  }
}

export default UpdateDriverService;
