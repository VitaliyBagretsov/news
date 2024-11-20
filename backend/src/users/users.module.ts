import { Module } from '@nestjs/common';
import { CommonService } from '@common/common.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CommonService],
})
export class UsersModule {}
