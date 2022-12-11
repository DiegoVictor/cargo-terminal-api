import { celebrate, Joi, Segments } from 'celebrate';

export const store = celebrate({
  [Segments.BODY]: Joi.object().keys({
    vehicle_id: Joi.string().required(),
    driver_id: Joi.string().required(),
    origin: Joi.object()
      .keys({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      })
      .required(),
    destination: Joi.object()
      .keys({
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      })
      .required(),
  }),
});
