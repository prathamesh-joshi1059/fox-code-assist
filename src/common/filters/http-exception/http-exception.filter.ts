import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

interface ErrorObject {
  message: string;
  error: string;
  statusCode: number;
}
@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  private logger = new Logger(HttpExceptionFilter.name);

  // Handles HTTP exceptions and logs error details
  catch(exception: T, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error =
      typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as ErrorObject);

    const timestamp = new Date().toISOString();
    const path = ctx.getRequest().url;
    this.logger.warn(`${JSON.stringify({ timestamp, path, ...error })}`);

    response.status(status).json({
      status: 'Fail',
      statusCode: status,
      message: error.message,
    });
  }
}
