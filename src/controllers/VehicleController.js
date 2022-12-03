import getRepositories from '../utils/getRepositories';
import paginationLinks from '../utils/paginationLinks';

class VehicleController {
  async index(request, response) {
    const { currentUrl } = request;
    const { page = 1 } = request.query;
    const limit = 20;

    const [vehicleRepository] = getRepositories('vehicle');
    const [vehicles, count] = await Promise.all([
      vehicleRepository.find({ page, limit }),
      vehicleRepository.count(),
    ]);

    response.header('X-Total-Count', count);

    const pagesTotal = Math.ceil(count / limit);
    if (pagesTotal > 1) {
      response.links(paginationLinks(page, pagesTotal, currentUrl));
    }

    return response.json(vehicles);
  }

  async store(request, response) {
    const { type, model } = request.body;

    const [vehicleRepository] = getRepositories('vehicle');
    const vehicle = await vehicleRepository.create({ type, model });

    return response.status(201).json(vehicle);
  }
}

export default VehicleController;
