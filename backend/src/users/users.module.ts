import { Module } from '@nestjs/common';
import { AuthModule } from '#auth';
import { CommonService } from '#common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, CommonService],
})
export class UsersModule {}
