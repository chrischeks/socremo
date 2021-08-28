import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler, Request } from 'express';
import UniversalController from '../controller/universal.controller';
import { ICustomer } from '../interfaces/customer.interface';

const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req: Request & { customer: ICustomer }, res, next) => {
    validate(plainToClass(type, req[value]), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');

        new UniversalController().controllerResponseHandler({ message, status: false, statusCode: 400 }, req, res);
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;
