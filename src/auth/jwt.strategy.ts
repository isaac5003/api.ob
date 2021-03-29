import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayloadDTO } from './dtos/jwtPayload.dto';
import { User } from './entities/User.entity';
import { UserRepository } from './repositories/User.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        'mDsDkZcsjnux*bOBRfBaf%LN8sMkxf*2s7QSvUD1$RIlDJn0&GclG5#8BRV$KNqW4Zx@jo8j4sK7bmtPHqUTjD^rvc^%eIhdh4W',
    });
  }

  async validate(payload: JwtPayloadDTO): Promise<User> {
    const { uid } = payload;
    const user = this.userRepository.getUserById(uid);
    if (!user) {
      throw new UnauthorizedException(
        'Debes iniciar sesión para poder realizar esta acción.',
      );
    }
    return user;
  }
}
