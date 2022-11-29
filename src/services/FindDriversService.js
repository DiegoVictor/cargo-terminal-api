class FindDriversService {
  constructor(driverRepository) {
    this.driverRepository = driverRepository;
  }

  async run({ active, vehicle, page, limit }) {
    const where = {};

    if (active && active === '1') {
      where.active = true;
    }

    if (vehicle && vehicle === '1') {
      where.vehicle_id = { $exists: true };
    }

    const [drivers, count] = await Promise.all([
      this.driverRepository.find(where, { page, limit }),
      this.driverRepository.count(where),
    ]);

    return { drivers, count };
  }
}

export default FindDriversService;
