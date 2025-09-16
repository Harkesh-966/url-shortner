import { Schema, model, Document, Types } from 'mongoose';

export interface IClick extends Document {
    url: Types.ObjectId;
    date: Date;
    referrer?: string;
    country?: string;
    ipHash?: string;
    userAgent?: string;
}

const clickSchema = new Schema<IClick>({
    url: { type: Schema.Types.ObjectId, ref: 'Url', required: true, index: true },
    date: { type: Date, default: () => new Date(), index: true },
    referrer: { type: String },
    country: { type: String },
    ipHash: { type: String },
    userAgent: { type: String }
}, { timestamps: false });

export const Click = model<IClick>('Click', clickSchema);
