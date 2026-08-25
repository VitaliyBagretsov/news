import { Module } from '@nestjs/common';

import { RolesGuard } from '#common/guards/role.guard';
import { SessionAuthGuard } from '#common/guards/session-auth.guard';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, SessionAuthGuard, RolesGuard],
  exports: [AuthService, SessionAuthGuard, RolesGuard],
})
export class AuthModule {}
