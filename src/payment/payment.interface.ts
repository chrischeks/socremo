export interface ITransfer {
  _id?: string;
  amount: number;
  creditAccount: string;
  debitAccount: string;
  narration?: string;
  charge?: number;
  pin: string;
}
