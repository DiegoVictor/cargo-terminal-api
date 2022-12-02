import Driver from '../models/Driver';

class DriverRepository {
  async find(conditions, { page, limit }) {
    return Driver.find(conditions)
      .limit(limit)
      .skip((page - 1) * limit);
  }

  async count({ conditions }) {
    return Driver.countDocuments(conditions);
  }

  async findById(id) {
    return Driver.findById(id);
  }

  async create({
    cpf,
    name,
    phone,
    birthday,
    gender,
    cnh_number,
    cnh_type,
    vehicle_id,
  }) {
    return Driver.create({
      cpf,
      name,
      phone,
      birthday,
      gender,
      cnh_number,
      cnh_type,
      vehicle_id,
    });
  }
}

export default DriverRepository;
