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
}

export default ArrivalController;
