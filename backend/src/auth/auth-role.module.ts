import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { JwtStrategy } from './strategies';
import { RolesGuard } from '@common/guards/role.guard';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  providers: [
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthRoleModule {}
