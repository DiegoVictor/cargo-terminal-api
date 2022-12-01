import { notFound } from '@hapi/boom';
import dayjs from 'dayjs';

class StoreDriverService {
  constructor(driverRepository, vehicleRepository) {
    this.driverRepository = driverRepository;
    this.vehicleRepository = vehicleRepository;
  }

  async run({
    cpf,
    name,
    phone,
    birthday,
    gender,
    cnh_number,
    cnh_type,
    vehicle_id,
  }) {
    let vehicle;
    if (vehicle_id) {
      vehicle = await this.vehicleRepository.findById(vehicle_id);
      if (!vehicle) {
        throw notFound('Vehicle not found', { code: 244 });
      }
    }

    const driver = await this.driverRepository.create({
      cpf,
      name,
      phone,
      birthday: dayjs(birthday).format('YYYY-MM-DD'),
      gender,
      cnh_number,
      cnh_type,
      vehicle_id: vehicle ? vehicle_id : null,
    });

    return driver;
  }
}

export default StoreDriverService;
