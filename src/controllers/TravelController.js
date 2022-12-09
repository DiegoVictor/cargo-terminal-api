import getRepositories from '../utils/getRepositories';

class TravelController {
  async index(_, response) {
    const [arrivalRepository] = getRepositories('arrival');
    const travels = await arrivalRepository.findTravels();

    return response.json(travels);
  }
}

export default TravelController;
