import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(public id: string | number) {
    super(`Not found record with id "${id.toString()}"`, HttpStatus.NOT_FOUND);
  }
}
