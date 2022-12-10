import { celebrate, Joi, Segments } from 'celebrate';

export default celebrate({
  [Segments.QUERY]: Joi.object().keys({
    filled: Joi.string().valid('0', '1').optional(),
    date_start: Joi.date().optional(),
    date_end: Joi.date().optional(),
    page: Joi.number().optional(),
  }),
});
