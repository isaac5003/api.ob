import { Controller, Get } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ResponseListDTO } from '../_dtos/responseList.dto';
import { City } from './entities/City.entity';
import { Country } from './entities/Country.entity';
import { State } from './entities/State.entity';
import { SystemService } from './system.service';

@Controller('others')
export class SystemController {
  constructor(private system: SystemService) {}

  @Get('/countries')
  async getCountries(): Promise<ResponseListDTO<Country, number, number, number>> {
    const { data, count } = await this.system.getCountries();
    return new ResponseListDTO(plainToClass(Country, data), count);
  }

  @Get('/states')
  async getStates(): Promise<ResponseListDTO<State, number, number, number>> {
    const { data, count } = await await this.system.getStates();
    return new ResponseListDTO(plainToClass(State, data), count);
  }

  @Get('/cities')
  async getCitites(): Promise<ResponseListDTO<City, number, number, number>> {
    const { data, count } = await this.system.getCities();
    return new ResponseListDTO(plainToClass(City, data), count);
  }
}
