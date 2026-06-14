import mongoose, { Document, Types } from 'mongoose';
export interface IQuestion extends Document {
    question: string;
    answer: string;
    explanation?: string;
    example?: string;
    keywords: string[];
    difficulty: 'Easy' | 'Medium' | 'Hard';
    technology: string;
    category: Types.ObjectId;
}
declare const _default: mongoose.Model<IQuestion, {}, {}, {}, mongoose.Document<unknown, {}, IQuestion, {}, mongoose.DefaultSchemaOptions> & IQuestion & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IQuestion>;
export default _default;
//# sourceMappingURL=Question.d.ts.map