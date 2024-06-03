import { HttpStatus } from './http-status.util';

export class CustomError {
  statusCode: number;
  message: string;
  data?: any;

  constructor(message: string, data?: any) {
    this.message = message;
  }
}

export class BadRequestException extends CustomError {
  constructor(message: string = 'BadRequestException', data: Object = {}) {
    super(message, data);
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.data = data;
  }
}

export class UnauthorizedException extends CustomError {
  constructor(message: string = 'UnauthorizedException') {
    super(message);
    this.statusCode = HttpStatus.UNAUTHORIZED;
  }
}

export class NotFoundException extends CustomError {
  constructor(message: string = 'NotFoundException') {
    super(message);
    this.statusCode = HttpStatus.NOT_FOUND;
  }
}

export class ForbiddenException extends CustomError {
  constructor(message: string = 'ForbiddenException') {
    super(message);
    this.statusCode = HttpStatus.FORBIDDEN;
  }
}
