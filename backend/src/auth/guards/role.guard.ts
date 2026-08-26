import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthenticatedUser } from '../auth-session.types.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles?.length) return true;

    const user = context.switchToHttp().getRequest().user as
      AuthenticatedUser | undefined;

    if (!user || !roles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException(`Role required: ${roles.join(' or ')}`);
    }

    return true;
  }
}
