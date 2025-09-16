import { Schema, model, Document, Types } from 'mongoose';

export interface IUrl extends Document {
    originalUrl: string;
    code: string;
    owner?: Types.ObjectId;
    expiresAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const urlSchema = new Schema<IUrl>({
    originalUrl: { type: String, required: true },
    code: { type: String, required: true, unique: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    expiresAt: { type: Date }
}, { timestamps: true });

export const Url = model<IUrl>('Url', urlSchema);
