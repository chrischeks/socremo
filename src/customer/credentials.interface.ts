export interface ICredentials {
  primaryTelephone: string;
  userId: string;
  credentialHistory: {
    mPin?: string;
    pin?: string;
    dateCreated?: Date;
  }[];
}
