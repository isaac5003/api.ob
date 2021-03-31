import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Company } from 'src/companies/entities/Company.entity';
import { CompanyRepository } from 'src/companies/repositories/Company.repository';
import { JwtPayloadDTO } from './dtos/jwtPayload.dto';
import { UserRepository } from './repositories/User.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(CompanyRepository)
    private companyRepository: CompanyRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        'mDsDkZcsjnux*bOBRfBaf%LN8sMkxf*2s7QSvUD1$RIlDJn0&GclG5#8BRV$KNqW4Zx@jo8j4sK7bmtPHqUTjD^rvc^%eIhdh4W',
    });
  }

  async validate(payload: JwtPayloadDTO): Promise<Company> {
    const { uid, cid } = payload;
    const user = await this.userRepository.getUserById(uid);
    const company = await this.companyRepository.getCompanyById(cid);
    if (!user) {
      throw new UnauthorizedException(
        'Debes iniciar sesión para poder realizar esta acción.',
      );
    }
    return company;
  }
}
