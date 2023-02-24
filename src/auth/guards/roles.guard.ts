import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requireStatuses = this.reflector.get<string[]>(
      'statuses',
      ctx.getHandler(),
    );

    if (!requireStatuses) return true;

    const { user } = ctx.switchToHttp().getRequest();
    return requireStatuses.some((status) => user.status.includes(status));
  }
}
