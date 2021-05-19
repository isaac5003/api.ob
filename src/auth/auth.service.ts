import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDTO } from './dtos/auth.dto';
import { UserRepository } from './repositories/User.repository';
import * as bcrypt from 'bcrypt';
import { AccessRepository } from './repositories/Access.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDTO } from './dtos/jwtPayload.dto';
import { emailSender } from '../_tools';
import { v1 as uuidv1 } from 'uuid';
import { ResponseMinimalDTO } from '../_dtos/responseList.dto';
import { UserRecoveryDTO } from './dtos/auth-recovery.dto';
import { RecoveryRepository } from './repositories/Recovery.repository';
import { resetPassword } from '../emailsTemplate/resetPassword';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(AccessRepository)
    private accessRepository: AccessRepository,

    @InjectRepository(RecoveryRepository)
    private recoveryRepository: RecoveryRepository,

    private jwtService: JwtService,
  ) {}

  async processLogin(authDto: AuthDTO): Promise<{ access_token: string; refresh_token: string }> {
    const { email, password } = authDto;
    const user = await this.userRepository.getUserByEmail(email);

    // If no user exists or wrong password
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Usuario y/o contraseña no valida.');
    }

    // If user is inactive
    if (!user.isActive) {
      throw new ForbiddenException('Usuario inactivo, contacta con tu administrador.');
    }

    // If user has no profile
    if (!user.profile) {
      throw new ForbiddenException('El usuario no tiene un perfil asignado, contacta con tu administrador.');
    }

    // Get first access to get company adn branch id
    const access = await this.accessRepository.getAccessByProfileId(user.profile.id);

    if (!access) {
      throw new ForbiddenException('El usuario no esta asignado a ninguna empresa, contacta con tu administrador.');
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

  async recoveryPassword(userAuth: UserRecoveryDTO): Promise<ResponseMinimalDTO> {
    const { email } = userAuth;

    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException(
        'No podemos localizar la dirección de correo electronico ingresada. Ingresa nuevamente tu dirección de correo electronico.',
      );
    }

    const v1options = {
      node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
      clockseq: 0x1234,
      msecs: new Date().getTime(),
      nsecs: 5678,
    };

    let message = '';
    const token = uuidv1(v1options);
    const data = {
      user,
      token,
    };

    const recovery = await this.recoveryRepository.createToken(data);

    const url = `https://app.openbox.cloud/auth/login?reset-token=${recovery.token}`;

    try {
      const content = resetPassword(url);
      const email = await emailSender(user.email, 'OPENBOXCLOUD | Reinicio de contraseña.', content);
      message = email.message;
    } catch (error) {
      console.error(error);
      message =
        'No podemos localizar la dirección de correo electronico ingresada. Ingresa nuevamente tu dirección de correo electronico.';
    }

    return {
      message,
    };
  }
}
