import { model, Schema } from 'mongoose';

const ArrivalSchema = new Schema(
  {
    filled: {
      type: Boolean,
      default: false,
    },
    driver_id: Schema.Types.ObjectId,
    vehicle_id: Schema.Types.ObjectId,
    origin: [Number],
    destination: [Number],
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    versionKey: false,
  }
);

ArrivalSchema.virtual('driver', {
  ref: 'Driver',
  localField: 'driver_id',
  foreignField: '_id',
  justOne: true,
});
ArrivalSchema.virtual('vehicle', {
  ref: 'Vehicle',
  localField: 'vehicle_id',
  foreignField: '_id',
  justOne: true,
});

export default model('Arrival', ArrivalSchema);
