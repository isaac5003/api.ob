import { InternalServerErrorException } from '@nestjs/common';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/User.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.createQueryBuilder('u')
        .where({ id })
        .leftJoinAndSelect('u.profile', 'p')
        .leftJoinAndSelect('p.accesses', 'a')
        .leftJoinAndSelect('a.module', 'm')
        .leftJoinAndSelect('a.company', 'c')
        .leftJoinAndSelect('a.branch', 'b')
        .orderBy('c.name', 'ASC')
        .getOne();
      return user;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('Error al obtener el usuario seleccionado.');
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.createQueryBuilder('u').where({ email }).leftJoinAndSelect('u.profile', 'p').getOne();
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener el usuario seleccionado.');
    }
  }

  async updateUserPassword(id: string, data: string): Promise<any> {
    try {
      const user = this.update({ id }, { password: data, changePassword: false });
      return user;
    } catch (error) {
      logDatabaseError('user', error);
    }
  }
}
