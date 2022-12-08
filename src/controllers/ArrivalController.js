import StoreArrivalService from '../services/StoreArrivalService';
import FindArrivalsService from '../services/FindArrivalsService';
import getRepositories from '../utils/getRepositories';
import paginationLinks from '../utils/paginationLinks';

class ArrivalController {
  async index(request, response) {
    const { currentUrl } = request;
    const { filled, date_start, date_end, page = 1 } = request.query;
    const limit = 20;

    const [arrivalRepository] = getRepositories('arrival');
    const findArrivalsService = new FindArrivalsService(arrivalRepository);
    const { arrivals, count } = await findArrivalsService.run({
      filled,
      date_start,
      date_end,
      page,
      limit,
    });

    response.header('X-Total-Count', count);

    const pagesTotal = Math.ceil(count / limit);
    if (pagesTotal > 1) {
      response.links(paginationLinks(page, pagesTotal, currentUrl));
    }

    return response.json(arrivals);
  }

  async store(request, response) {
    const { filled, vehicle_id, driver_id, origin, destination } = request.body;

    const [arrivalRepository, driverRepository, vehicleRepository] =
      getRepositories(['arrival', 'driver', 'vehicle']);
    const storeArrivalService = new StoreArrivalService(
      arrivalRepository,
      driverRepository,
      vehicleRepository
    );
    const arrival = await storeArrivalService.run({
      filled,
      vehicle_id,
      driver_id,
      origin,
      destination,
    });

    return response.status(201).json(arrival);
  }
}

export default ArrivalController;
