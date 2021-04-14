import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Profile } from '../entities/Profile.entity';

@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {
  async getProfileById(id: string): Promise<Profile> {
    try {
      const profile = await this.createQueryBuilder('p').where({ id }).getOne();
      return profile;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener el perfil seleccionado.',
      );
    }
  }
}
