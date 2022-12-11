import { celebrate, Joi, Segments } from 'celebrate';

export default celebrate({
  [Segments.QUERY]: Joi.object().keys({
    active: Joi.string().valid('0', '1').optional(),
    vehicle: Joi.string().valid('0', '1').optional(),
    page: Joi.number().optional(),
  }),
});
