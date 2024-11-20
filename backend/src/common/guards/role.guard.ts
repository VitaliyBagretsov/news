import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!roles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    console.log('RolesGuard',user)

    if (!user) throw new BadRequestException('User does not exist in context');

    if (!roles.some((role) => user.roles.includes(role)))
      throw new ForbiddenException(
        `Not enough authority for username #${user.username}`,
      );

    return true;
  }
}
