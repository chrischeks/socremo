import { Router } from 'express';
import Route from '@/@universal/interfaces/route.interface';
import authMiddleware from '@/@universal/middlewares/auth.middleware';
import CustomerController from '@/customer/customer.controller';
import validationMiddleware from '@/@universal/middlewares/validation.middleware';
import { ChangeMPinDTO, EntityInformationDTO } from './customer.dto';
import { AccountNumberDTO } from '@/@universal/dto/account.dto';

class CustomerRoute implements Route {
  public path = '/customer';

  public router = Router();
  public customerController = new CustomerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.post(
    //   `${this.path}/account/open-account`,
    //   authMiddleware,
    //   validationMiddleware(AccountOpenDTO, 'body'),
    //   this.customerController.openAccount,
    // );
    this.router.get(
      `${this.path}/name-enquiry/:accountNumber`,
      authMiddleware,
      validationMiddleware(AccountNumberDTO, 'params'),
      this.customerController.getCustomerByAccountNumber,
    );
    this.router.post(`${this.path}/change-mpin`, validationMiddleware(ChangeMPinDTO, 'body'), this.customerController.changeMpin);

    this.router.post(`${this.path}/existing`, validationMiddleware(EntityInformationDTO, 'body'), this.customerController.onboardExistingCustomer);
  }
}

export default CustomerRoute;
