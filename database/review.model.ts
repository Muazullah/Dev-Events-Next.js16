import { Schema, model, models, Document, Types } from 'mongoose';

export interface IReview extends Document {
    eventId: Types.ObjectId;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
            index: true,
        },
        userId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

ReviewSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const Review = models.Review || model<IReview>('Review', ReviewSchema);
export default Review;