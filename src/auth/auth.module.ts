import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessRepository } from './repositories/Access.repository';
import { ProfileRepository } from './repositories/Profile.repository';
import { UserRepository } from './repositories/User.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccessRepository,
      ProfileRepository,
      UserRepository,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
