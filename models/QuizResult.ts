import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuizResult extends Document {
  userId: mongoose.Types.ObjectId;
  topic: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // 0–100 percentage
  createdAt: Date;
}

const QuizResultSchema = new Schema<IQuizResult>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    score: { type: Number, required: true },
  },
  { timestamps: true },
);

const QuizResult: Model<IQuizResult> =
  mongoose.models.QuizResult ||
  mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);

export default QuizResult;
