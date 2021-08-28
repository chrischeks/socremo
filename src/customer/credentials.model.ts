import { model, Schema, Document } from 'mongoose';
import { ICredentials } from './credentials.interface';

const credentialSchema: Schema = new Schema(
  {
    primaryTelephone: String,
    userId: String,
    credentialHistory: [
      {
        mPin: String,
        pin: String,
        dateCreated: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  },
  { timestamps: true },
);

const credentialHistoryModel = model<ICredentials & Document>('credentialHistory', credentialSchema);

export default credentialHistoryModel;
