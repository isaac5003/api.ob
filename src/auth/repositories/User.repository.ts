import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/User.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.createQueryBuilder('u').where({ id }).leftJoinAndSelect('u.profile', 'p').getOne();
      return user;
    } catch (error) {
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
}
