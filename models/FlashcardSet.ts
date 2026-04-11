import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFlashcard {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface IFlashcardSet extends Document {
  userId: mongoose.Types.ObjectId;
  topic: string;
  cards: IFlashcard[];
  createdAt: Date;
}

const FlashcardSetSchema = new Schema<IFlashcardSet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topic: { type: String, required: true },
    cards: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
      },
    ],
  },
  { timestamps: true },
);

const FlashcardSet: Model<IFlashcardSet> =
  mongoose.models.FlashcardSet ||
  mongoose.model<IFlashcardSet>('FlashcardSet', FlashcardSetSchema);

export default FlashcardSet;
