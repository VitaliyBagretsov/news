import { Module } from '@nestjs/common';
import { AuthModule } from '#auth/auth.module';
import { CommonService } from '#common/common.service';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, CommonService],
})
export class UsersModule {}
