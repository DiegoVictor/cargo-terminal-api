import UpdateDriverService from '../services/UpdateDriverService';
import getRepositories from '../utils/getRepositories';
class DriverController {

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
