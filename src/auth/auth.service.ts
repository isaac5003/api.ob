import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDTO } from './dtos/auth.dto';
import { UserRepository } from './repositories/User.repository';
import * as bcrypt from 'bcrypt';
import { AccessRepository } from './repositories/Access.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDTO } from './dtos/jwtPayload.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(AccessRepository)
    private accessRepository: AccessRepository,

    private jwtService: JwtService,
  ) {}

  async processLogin(
    authDto: AuthDTO,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { email, password } = authDto;
    const user = await this.userRepository.getUserByEmail(email);

    // If no user exists or wrong password
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Usuario y/o contraseña no valida.');
    }

    // If user is inactive
    if (!user.isActive) {
      throw new ForbiddenException(
        'Usuario inactivo, contacta con tu administrador.',
      );
    }

    // If user has no profile
    if (!user.profile) {
      throw new ForbiddenException(
        'El usuario no tiene un perfil asignado, contacta con tu administrador.',
      );
    }

    // Get first access to get company adn branch id
    const access = await this.accessRepository.getAccessByProfileId(
      user.profile.id,
    );

    if (!access) {
      throw new ForbiddenException(
        'El usuario no esta asignado a ninguna empresa, contacta con tu administrador.',
      );
    }

    // Generates token
    const payload: JwtPayloadDTO = {
      uid: user.id,
      pid: user.profile.id,
      cid: access.company.id,
      bid: access.branch.id,
    };
    const access_token = await this.jwtService.sign(payload);
    const refresh_token = await this.jwtService.sign(payload);

    return { access_token, refresh_token };
  }
}
