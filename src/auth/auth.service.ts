import {
  BadRequestException,
  Dependencies,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDTO } from './dtos/auth.dto';
import { UserRepository } from './repositories/User.repository';
import * as bcrypt from 'bcrypt';
import { AccessRepository } from './repositories/Access.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDTO } from './dtos/jwtPayload.dto';
import { emailSender } from '../_tools';
import { v1 as uuidv1 } from 'uuid';
import { ResponseMinimalDTO, ResponseUserDTO } from '../_dtos/responseList.dto';
import { UserRecoveryDTO } from './dtos/auth-recovery.dto';
import { RecoveryRepository } from './repositories/Recovery.repository';
import { resetPassword } from '../emailsTemplate/resetPassword';
import { RefreshfTokenDTO } from './dtos/refresh-token.dto';
import { User } from './entities/User.entity';
import { ExtractJwt } from 'passport-jwt';
import { Company } from 'src/companies/entities/Company.entity';
import { Branch } from 'src/companies/entities/Branch.entity';
import { TokenRepository } from 'src/system/repositories/Token.repository';
import { WorkSpaceDTO } from './dtos/workspace-data.dto';
import { BranchRepository } from 'src/companies/repositories/Branch.repository';
import { CompanyRepository } from 'src/companies/repositories/Company.repository';
import { Profile } from './entities/Profile.entity';
import { updatePassWordDTO } from './dtos/auth-update-password.dto';
import { ResetPasswordDTO } from './dtos/auth-reset-password.dto';
import { differenceInMinutes } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(AccessRepository)
    private accessRepository: AccessRepository,

    @InjectRepository(RecoveryRepository)
    private recoveryRepository: RecoveryRepository,

    @InjectRepository(TokenRepository)
    private tokenRepository: TokenRepository,

    @InjectRepository(BranchRepository)
    private branchRepository: BranchRepository,

    @InjectRepository(CompanyRepository)
    private companyRepository: CompanyRepository,

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

    console.log(
      await this.accessRepository.getCompaniesWithIntegrations(
        'cfb8addb-541b-482f-8fa1-dfe5db03fdf4',
        'a98b98e6-b2d5-42a3-853d-9516f64eade8',
      ),
    );
    return { access_token, refresh_token };
  }

  async processRefresh(refresh_token: RefreshfTokenDTO): Promise<{ access_token: string }> {
    try {
      const { uid, pid, cid, bid } = this.jwtService.verify(refresh_token.refresh_token.replace('Bearer ', ''));
      const access_token = await this.jwtService.sign({ uid, pid, cid, bid });

      // return token
      return { access_token };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Sesión no válida.');
    }
  }

  async logOut(): Promise<ResponseMinimalDTO> {
    const authorization = ExtractJwt.fromAuthHeaderAsBearerToken();

    const result = await this.tokenRepository.deleteToken(authorization);
    return {
      message: result ? 'Se ha cerrado la sesion correctamente.' : 'No se ha podido cerrar la sesión.',
    };
  }

  async getUser(user: User, branch: Branch, company: Company): Promise<ResponseUserDTO> {
    const userLogged = await this.userRepository.getUserById(user.id);

    const access = [];
    for (const acc of user.profile.accesses) {
      const foundCompany = access.find((a) => a.id == acc.company.id);
      if (!foundCompany) {
        access.push({
          ...acc.company,
          branches: [{ ...acc.branch, modules: [acc.module] }],
        });
      } else {
        const foundBranch = foundCompany.branches.find((b) => b.id == acc.branch.id);
        if (!foundBranch) {
          foundCompany.branches.push({ ...acc.branch, modules: [acc.module] });
        } else {
          foundBranch.modules.push(acc.module);
        }
      }
    }
    userLogged.profile.accesses = access;

    const userToShow = {
      user: {
        unique: userLogged.unique,
        email: userLogged.email,
        names: userLogged.names,
        lastnames: userLogged.lastnames,
        changePassword: userLogged.changePassword,
        avatarURL: userLogged.avatarUrl,
        profile: {
          id: userLogged.profile.id,
          name: userLogged.profile.name,
          admin: userLogged.profile.admin,
          access: access.map((a) => {
            return {
              id: a.id,
              unique: a.unique,
              name: a.name,
              branches: a.branches.map((b) => {
                return {
                  id: b.id,
                  name: b.name,
                  modules: b.modules.map((m) => {
                    return {
                      id: m.id,
                      name: m.name,
                    };
                  }),
                };
              }),
            };
          }),
        },
        workspace: (userLogged['workspace'] = {
          company: { id: company.id, unique: company.unique, name: company.name },
          branch: { id: branch.id, name: branch.name },
        }),
      },
    };
    return { ...userToShow };
  }

  async updateWorkSpace(data: WorkSpaceDTO, user: User, profile: Profile): Promise<{ access_token: string }> {
    const branch = await this.branchRepository.getBranchById(data.bid);
    const company = await this.companyRepository.getCompanyById(data.cid);

    if (!company || !branch) {
      throw new BadRequestException('No existe este espacio de trabajo, contacta con tu administrador.');
    }

    // Check if branch belongs to company
    if (!company.branches.find((b) => b.id == branch.id)) {
      throw new BadRequestException('Incorrecta combinación del espacio de trabajo.');
    }

    try {
      // Generates token
      const payload: JwtPayloadDTO = {
        uid: user.id,
        pid: profile.id,
        cid: data.cid,
        bid: data.bid,
      };
      const access_token = await this.jwtService.sign(payload);

      // return token
      return { access_token };
    } catch (error) {
      throw new InternalServerErrorException('Error al cambiar el espacio de trabajo.');
    }
  }

  async updatePassWord(data: updatePassWordDTO, user: User): Promise<ResponseMinimalDTO> {
    if (!bcrypt.compareSync(data.currentPassword, user.password)) {
      throw new BadRequestException('Contraseña actual incorrecta.');
    }

    const newPassword = bcrypt.hashSync(data.newPassword, 10);

    await this.userRepository.updateUserPassword(user.id, newPassword);

    return {
      message: 'Contraseña actualizada correctamente.',
    };
  }

  async recoveryPassword(userAuth: UserRecoveryDTO): Promise<ResponseMinimalDTO> {
    const { email } = userAuth;

    const user = await this.userRepository.getUserByEmail(email);

    if (!user || !user.isActive) {
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

  async resetPassword(data: ResetPasswordDTO): Promise<ResponseMinimalDTO> {
    const tokenData = await this.recoveryRepository.getTokenByToken(data.token);
    if (differenceInMinutes(Date.now(), new Date(tokenData.createdAt)) > 10 || tokenData.used) {
      throw new BadRequestException('El token ha expirado, debes solicitar un nuevo cambio de contraseña.');
    }

    const newPassword = bcrypt.hashSync(data.newPassword, 10);

    await this.userRepository.updateUserPassword(tokenData.user.id, newPassword);
    await this.recoveryRepository.updateRecovery(tokenData.id, { used: true });

    return {
      message: 'La contraseña ha sido actualizada correctamente.',
    };
  }

  async hasModules(modules: string[], user: User, branch: Branch, company: Company): Promise<boolean> {
    const found = await this.getUser(user, branch, company);

    const loggedCompany = found.user.profile.access.find((a) => a.id == found.user.workspace.company.id);
    const loggedBranch = loggedCompany.branches.find((b) => b.id == found.user.workspace.branch.id);
    const modulesAccess = loggedBranch.modules.map((m) => m.id);

    return modulesAccess.map((m) => modules.includes(m)).some((m) => m);
  }
}
@Dependencies(AuthService)
export class DependentController {
  constructor(authService) {
    authService = authService;
  }
}
