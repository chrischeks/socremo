import { NextFunction, Response, Request } from 'express';
import UniversalController from '../controller/universal.controller';
import { ICustomer } from '../interfaces/customer.interface';

const notFound = async (req: Request, res: Response, next: NextFunction) => {
  return await new UniversalController().controllerResponseHandler({ message: 'Route not found.', status: false, statusCode: 404 }, req, res);
};

export default notFound;
