import Vehicle from '../models/Vehicle';

class VehicleRepository {
  async find({ page, limit }) {
    return Vehicle.find()
      .limit(limit)
      .skip((page - 1) * limit);
  }

  async count() {
    return Vehicle.countDocuments();
  }

  async findById(id) {
    return Vehicle.findById(id);
  }

  async create({ type, model }) {
    return Vehicle.create({ type, model });
  }
}

export default VehicleRepository;
