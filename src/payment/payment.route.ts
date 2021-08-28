import { Router } from 'express';
import Route from '@/@universal/interfaces/route.interface';
import authMiddleware from '@/@universal/middlewares/auth.middleware';
import validationMiddleware from '@/@universal/middlewares/validation.middleware';
import PaymentController from './payment.controller';
import { TransferDTO } from './payment.dto';
import { AccountNumberDTO } from '@/@universal/dto/account.dto';

class PaymentRoute implements Route {
  public path = '/payment';

  public router = Router();
  public paymentController = new PaymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/transfer`, authMiddleware, validationMiddleware(TransferDTO, 'body'), this.paymentController.localTransfer);
    this.router.get(
      `${this.path}/transactions/:accountNumber`,
      authMiddleware,
      validationMiddleware(AccountNumberDTO, 'params'),
      this.paymentController.transactionHistory,
    );
  }
}

export default PaymentRoute;
