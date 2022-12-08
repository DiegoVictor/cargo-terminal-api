import StoreDriverService from '../services/StoreDriverService';
import UpdateDriverService from '../services/UpdateDriverService';
import getRepositories from '../utils/getRepositories';
class DriverController {

  async store(request, response) {
    const {
      cpf,
      name,
      phone,
      birthday,
      gender,
      cnh_number,
      cnh_type,
      vehicle_id,
    } = request.body;

    const [driverRepository, vehicleRepository] = getRepositories([
      'driver',
      'vehicle',
    ]);
    const storeDriverService = new StoreDriverService(
      driverRepository,
      vehicleRepository
    );
    const driver = await storeDriverService.run({
      cpf,
      name,
      phone,
      birthday,
      gender,
      cnh_number,
      cnh_type,
      vehicle_id,
    });

    return response.status(201).json(driver);
  }

  async update(request, response) {
    const { id } = request.params;
    const { vehicle_id } = request.body;

    const [driverRepository, vehicleRepository] = getRepositories([
      'driver',
      'vehicle',
    ]);
    const updateDriverService = new UpdateDriverService(
      driverRepository,
      vehicleRepository
    );
    const driver = await updateDriverService.run({
      id,
      vehicle_id,
      ...request.body,
    });

    return response.json(driver);
  }
}

export default DriverController;
