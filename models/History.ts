import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  query: string;
  result: string;
  intent: string;
  label: string;
  emoji: string;
  createdAt: Date;
}

const HistorySchema = new Schema<IHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    query: { type: String, required: true },
    result: { type: String, required: true },
    intent: { type: String, required: true },
    label: { type: String, required: true },
    emoji: { type: String, default: '✨' },
  },
  { timestamps: true }
);

const History: Model<IHistory> =
  mongoose.models.History || mongoose.model<IHistory>('History', HistorySchema);

export default History;
