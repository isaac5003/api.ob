import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessRepository } from './repositories/Access.repository';
import { ProfileRepository } from './repositories/Profile.repository';
import { UserRepository } from './repositories/User.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { CompanyRepository } from 'src/companies/repositories/Company.repository';
import { BranchRepository } from 'src/companies/repositories/Branch.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'mDsDkZcsjnux*bOBRfBaf%LN8sMkxf*2s7QSvUD1$RIlDJn0&GclG5#8BRV$KNqW4Zx@jo8j4sK7bmtPHqUTjD^rvc^%eIhdh4W',
      signOptions: {
        expiresIn: '2h',
      },
    }),
    TypeOrmModule.forFeature([
      AccessRepository,
      ProfileRepository,
      UserRepository,
      CompanyRepository,
      BranchRepository,
      ProfileRepository,
    ]),
  ],
  exports: [JwtStrategy, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
