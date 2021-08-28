import { Schema, model, Document } from 'mongoose';
import { ITransfer } from './payment.interface';

export const paymentSchema: Schema = new Schema(
  {
    amount: Number,
    creditAccount: String,
    debitAccount: String,
    narration: String,
    charge: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const paymentModel = model<ITransfer & Document>('payments', paymentSchema);

export default paymentModel;
