import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExistException extends HttpException {
  constructor(public name: string) {
    super(`User with name "${name}" already exist`, HttpStatus.CONFLICT);
  }
}
