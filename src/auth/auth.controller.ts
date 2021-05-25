import { ResponseMinimalDTO, ResponseUserDTO } from '../_dtos/responseList.dto';
import { Body, Controller, Delete, Get, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserRecoveryDTO } from './dtos/auth-recovery.dto';
import { updatePassWordDTO } from './dtos/auth-update-password.dto';
import { AuthDTO } from './dtos/auth.dto';
import { RefreshfTokenDTO } from './dtos/refresh-token.dto';
import { WorkSpaceDTO } from './dtos/workspace-data.dto';
import { Profile } from './entities/Profile.entity';
import { User } from './entities/User.entity';
import { GetAuthData } from './get-auth-data.decorator';
import { Branch } from 'src/companies/entities/Branch.entity';
import { Company } from 'src/companies/entities/Company.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async processLogin(@Body() authDto: AuthDTO): Promise<{ access_token: string; refresh_token: string }> {
    return this.authService.processLogin(authDto);
  }

  @Post('refresh')
  @UsePipes(new ValidationPipe({ transform: true }))
  async processRefresh(@Body() refresh_token: RefreshfTokenDTO): Promise<{ access_token: string }> {
    return this.authService.processRefresh(refresh_token);
  }

  @Get('/user')
  @UseGuards(AuthGuard())
  async getUser(
    @GetAuthData('user') user: User,
    @GetAuthData('branch') branch: Branch,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseUserDTO> {
    return await this.authService.getUser(user, branch, company);
  }

  @Delete('/logout')
  @UseGuards(AuthGuard())
  async logout(): Promise<ResponseMinimalDTO> {
    return this.authService.logOut();
  }

  @Put('/update-workspace')
  @UseGuards(AuthGuard())
  async updateWorkSpace(
    @GetAuthData('user') user: User,
    @GetAuthData('profile') profile: Profile,
    @Body() data: WorkSpaceDTO,
  ): Promise<{ access_token: string }> {
    return await this.authService.updateWorkSpace(data, user, profile);
  }

  @Put('/password')
  @UseGuards(AuthGuard())
  async updatePassword(@GetAuthData('user') user: User, @Body() data: updatePassWordDTO): Promise<ResponseMinimalDTO> {
    return await this.authService.updatePassWord(data, user);
  }

  @Post('/recovery-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  async recoveryPassword(@Body() user: UserRecoveryDTO): Promise<ResponseMinimalDTO> {
    return this.authService.recoveryPassword(user);
  }
}
