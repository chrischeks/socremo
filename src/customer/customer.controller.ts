import { NextFunction, Request, Response } from 'express';
import { ChangeMPinDTO, EntityInformationDTO } from './customer.dto';
import CustomerService from './customer.service';
import UniversalController from '@/@universal/controller/universal.controller';

class CustomerController extends UniversalController {
  public customerService = new CustomerService();

  // public openAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const { body, customer } = req;
  //     const userData: AccountOpenDTO = body;
  //     const response = await this.customerService.processAccountOpening(customer, userData);
  //     await this.controllerResponseHandler(response, req, res);
  //   } catch (error) {
  //     await this.controllerErrorHandler(req, res, error);
  //   }
  // };

  public getCustomerByAccountNumber = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { params } = req;
      const userData: string = params.accountNumber;
      const response = await this.customerService.processGetCustomerByAccountNumber(userData);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
    }
  };

  public changeMpin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { customer, body } = req;
    try {
      const userData: ChangeMPinDTO = body;
      const response = await this.customerService.processChangeMpin(customer, userData);
      await this.controllerResponseHandler(response, req, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
    }
  };

  public onboardExistingCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: EntityInformationDTO = req.body;
      const response = await this.customerService.processOnboardExistingCustomer(userData);
      res.send();
    } catch (error) {
      await this.controllerErrorHandler(req, res, error);
    }
  };
}

export default CustomerController;
