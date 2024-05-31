import { HttpStatus } from './http-status.util';

export class CustomError {
  statusCode: number;
  message: string;
  reason?: any;

  constructor(message: string, reason?: any) {
    this.message = message;
  }
}

export class BadRequestException extends CustomError {
  constructor(message: string = 'BadRequestException', reason: Object = {}) {
    super(message, reason);
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.reason = reason;
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
