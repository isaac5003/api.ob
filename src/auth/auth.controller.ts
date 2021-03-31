import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async processLogin(
    @Body() authDto: AuthDTO,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.processLogin(authDto);
  }
}
