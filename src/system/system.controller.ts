import { Controller, Get } from '@nestjs/common';
import { ResponseListDTO } from '../_dtos/responseList.dto';
import { City } from './entities/City.entity';
import { Country } from './entities/Country.entity';
import { State } from './entities/State.entity';
import { SystemService } from './system.service';

@Controller('others')
export class SystemController {
  constructor(private system: SystemService) {}

  @Get('/countries')
  async getCountries(): Promise<ResponseListDTO<Country, number>> {
    return this.system.getCountries();
  }

  @Get('/states')
  async getStates(): Promise<ResponseListDTO<State, number>> {
    return await this.system.getStates();
  }

  @Get('/cities')
  async getCitites(): Promise<ResponseListDTO<City, number>> {
    return this.system.getCities();
  }
}
