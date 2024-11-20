import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { UsersService } from '@users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, JwtStrategy, RefreshTokenStrategy } from './strategies';
import { RolesGuard } from '@common/guards/role.guard';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AccessTokenStrategy,
    // JwtStrategy,
    // { provide: APP_GUARD, useClass: JwtAuthGuard },
    // { provide: APP_GUARD, useClass: RolesGuard },
    RefreshTokenStrategy,
    AuthService,
    UsersService,
  ],
})
export class AuthModule {}
