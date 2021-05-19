import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Branch } from '../companies/entities/Branch.entity';
import { Company } from '../companies/entities/Company.entity';
import { BranchRepository } from '../companies/repositories/Branch.repository';
import { CompanyRepository } from '../companies/repositories/Company.repository';
import { JwtPayloadDTO } from './dtos/jwtPayload.dto';
import { Profile } from './entities/Profile.entity';
import { User } from './entities/User.entity';
import { ProfileRepository } from './repositories/Profile.repository';
import { UserRepository } from './repositories/User.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,

    @InjectRepository(CompanyRepository)
    private companyRepository: CompanyRepository,

    @InjectRepository(BranchRepository)
    private branchRepository: BranchRepository,

    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        'mDsDkZcsjnux*bOBRfBaf%LN8sMkxf*2s7QSvUD1$RIlDJn0&GclG5#8BRV$KNqW4Zx@jo8j4sK7bmtPHqUTjD^rvc^%eIhdh4W',
    });
  }

  async validate(
    payload: JwtPayloadDTO,
  ): Promise<{
    company: Company;
    user: User;
    branch: Branch;
    profile: Profile;
  }> {
    const { uid, cid, bid, pid } = payload;
    const user = await this.userRepository.getUserById(uid);
    const company = await this.companyRepository.GetAuthDataById(cid);
    const branch = await this.branchRepository.getBranchById(bid);
    const profile = await this.profileRepository.getProfileById(pid);
    if (!user) {
      throw new UnauthorizedException('Debes iniciar sesión para poder realizar esta acción.');
    }
    return { user, company, branch, profile };
  }
}
