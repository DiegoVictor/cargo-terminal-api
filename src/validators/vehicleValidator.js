import { celebrate, Joi, Segments } from 'celebrate';

export default celebrate({
  [Segments.BODY]: Joi.object().keys({
    model: Joi.string().required(),
    type: Joi.number().min(1).max(5).required(),
  }),
});
