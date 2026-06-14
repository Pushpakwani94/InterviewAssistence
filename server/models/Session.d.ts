import mongoose, { Document, Types } from 'mongoose';
export interface ISession extends Document {
    sessionName: string;
    candidateName: string;
    technology: string;
    startTime: Date;
    endTime: Date;
    sessionCode: string;
    isActive: boolean;
    createdBy: Types.ObjectId;
}
declare const _default: mongoose.Model<ISession, {}, {}, {}, mongoose.Document<unknown, {}, ISession, {}, mongoose.DefaultSchemaOptions> & ISession & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISession>;
export default _default;
//# sourceMappingURL=Session.d.ts.map