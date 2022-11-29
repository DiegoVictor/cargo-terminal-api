class FindArrivalsService {
  constructor(arrivalRepository) {
    this.arrivalRepository = arrivalRepository;
  }

  async run({ filled, date_start, date_end, page, limit }) {
    const where = {};

    if (filled && typeof filled === 'string') {
      where.filled = !!Number(filled);
    }

    if (date_start && typeof date_start === 'object') {
      where.createdAt = { $gte: date_start };
    }

    if (date_end && typeof date_end === 'object') {
      if (typeof where.createdAt !== 'object') {
        where.createdAt = {};
      }
      where.createdAt.$lte = date_end;
    }

    const [arrivals, count] = await Promise.all([
      this.arrivalRepository.find(where, { page, limit }),
      this.arrivalRepository.count({ ...where }),
    ]);

    return { arrivals, count };
  }
}

export default FindArrivalsService;
