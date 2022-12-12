import { celebrate, Joi, Segments } from 'celebrate';
import dayjs from 'dayjs';

export const store = celebrate({
  [Segments.BODY]: Joi.object().keys({
    cpf: Joi.string().length(11).regex(/\d+/).required(),
    name: Joi.string().min(3).required(),
    phone: Joi.string().regex(/\d+/).required(),
    birthday: Joi.date().max(dayjs().subtract(18, 'years')).required(),
    vehicle_id: Joi.string().required(),
    gender: Joi.string().valid('F', 'M').required(),
    cnh_number: Joi.string().required(),
    cnh_type: Joi.string().valid('A', 'B', 'C', 'D', 'E').required(),
  }),
});
