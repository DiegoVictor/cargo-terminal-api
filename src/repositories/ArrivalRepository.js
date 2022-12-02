import Arrival from '../models/Arrival';

class ArrivalRepository {
  async find(conditions, { page, limit }) {
    return Arrival.find(conditions)
      .populate('driver', 'active cnh_number cnh_type cpf name phone')
      .populate('vehicle', 'model type')
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async count({ conditions }) {
    return Arrival.countDocuments(conditions);
  }

  async findById(id) {
    return Arrival.findById(id);
  }

  async findTravels() {
    return Arrival.aggregate([
      {
        $lookup: {
          from: 'vehicles',
          localField: 'vehicle_id',
          foreignField: '_id',
          as: 'vehicle',
        },
      },
      {
        $project: {
          _id: 0,
          vehicle: 1,
          origin: 1,
          destination: 1,
        },
      },
      {
        $unwind: {
          path: '$vehicle',
        },
      },
      {
        $group: {
          _id: '$vehicle.type',
          origins: {
            $push: '$origin',
          },
          destinations: {
            $push: '$destination',
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          origins: 1,
          destinations: 1,
        },
      },
    ]);
  }

  async create({ driver_id, filled, vehicle_id, origin, destination }) {
    return Arrival.create({
      driver_id,
      filled,
      vehicle_id,
      origin,
      destination,
    });
  }
}

export default ArrivalRepository;
