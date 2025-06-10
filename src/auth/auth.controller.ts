import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signin(@Body() data: { username: string; password: string }) {
    const result = await this.authService.signin(data);
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(@Body() data: { username: string; password: string }) {
    const result = await this.authService.signup(data);
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: { user: { sub: number } }) {
    const user = await this.userService.findOne(req.user.sub);
    return user;
  }
}
