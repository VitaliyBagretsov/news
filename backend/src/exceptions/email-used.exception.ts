import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailUsedException extends HttpException {
  constructor(public email: string) {
    super(`Email "${email}" already uesd`, HttpStatus.CONFLICT);
  }
}
