import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ResponseMinimalDTO } from '../_dtos/responseList.dto';
import { AuthService } from './auth.service';
import { UserRecoveryDTO } from './dtos/auth-recovery.dto';
import { AuthDTO } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async processLogin(@Body() authDto: AuthDTO): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.processLogin(authDto);
  }

  @Post('/recovery-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  async recoveryPassword(@Body() user: UserRecoveryDTO): Promise<ResponseMinimalDTO> {
    return this.authService.recoveryPassword(user);
  }
}
