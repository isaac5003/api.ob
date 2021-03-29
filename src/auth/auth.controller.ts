import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthDTO } from './dtos/auth.dto';
import { User } from './entities/User.entity';
import { GetUser } from './get-user.decorator';

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

  @Get('test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log('Usuario', user);
  }
}
