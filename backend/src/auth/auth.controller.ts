import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { SessionAuthGuard } from '#common/guards/session-auth.guard';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() credentials: LoginDto, @Req() request: Request) {
    const user = await this.authService.login(credentials, request);
    return { authenticated: true, user };
  }

  @UseGuards(SessionAuthGuard)
  @Get('session')
  session(@Req() request: Request) {
    return { authenticated: true, user: request.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(request);
    response.clearCookie('news_session', { path: '/' });
    return { authenticated: false };
  }
}
