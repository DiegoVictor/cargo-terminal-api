import ArrivalRepository from '../repositories/ArrivalRepository';
import DriverRepository from '../repositories/DriverRepository';
import VehicleRepository from '../repositories/VehicleRepository';

const instances = {
  arrival: new ArrivalRepository(),
  driver: new DriverRepository(),
  vehicle: new VehicleRepository(),
};

export default (names) => {
  if (!Array.isArray(names)) {
    names = [names];
  }

  return names.map((name) => instances[name]);
};
