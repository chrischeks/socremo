import { ICustomer } from '@/@universal/interfaces/customer.interface';
import { Schema, model, Document } from 'mongoose';

export const customerSchema: Schema = new Schema(
  {
    name: String,
    password: String,
    pin: String,
    email: { unique: true, type: String },
    account: [
      {
        accountType: { type: String, default: 'mono-savings' },
        accountNumber: String,
        balance: { type: Number, default: 0.0 },
        denomination: { type: String, default: 'kobo' },
        createdAt: { type: Date, default: new Date() },
      },
    ],
  },
  { timestamps: true },
);

const customerModel = model<ICustomer & Document>('customers', customerSchema);

export default customerModel;
