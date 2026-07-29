import { Schema, model, models, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  userId: string;
  email: string;
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

// Index for "My Bookings" queries
BookingSchema.index({ userId: 1, createdAt: -1 });

// Prevent duplicate bookings: one user, one event
BookingSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;