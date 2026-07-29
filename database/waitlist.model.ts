import { Schema, model, models, Document, Types } from 'mongoose';

export interface IWaitlist extends Document {
    eventId: Types.ObjectId;
    userId: string;
    email: string;
    createdAt: Date;
}

const WaitlistSchema = new Schema<IWaitlist>(
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
            index: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
    },
    { timestamps: true }
);

WaitlistSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const Waitlist = models.Waitlist || model<IWaitlist>('Waitlist', WaitlistSchema);
export default Waitlist;