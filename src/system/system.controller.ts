import { Controller, Get } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ResponseListDTO } from 'src/_dtos/responseList.dto';
import { City } from './entities/City.entity';
import { Country } from './entities/Country.entity';
import { State } from './entities/State.entity';
import { SystemService } from './system.service';

@Controller('others')
export class SystemController {
  constructor(private system: SystemService) {}

  @Get('/countries')
  async getCountries(): Promise<ResponseListDTO<Country>> {
    const countries = await this.system.getCountries();
    return new ResponseListDTO(plainToClass(Country, countries));
  }

  @Get('/states')
  async getStates(): Promise<ResponseListDTO<State>> {
    const states = await this.system.getStates();
    return new ResponseListDTO(plainToClass(State, states));
  }

  @Get('/cities')
  async getCitites(): Promise<ResponseListDTO<City>> {
    const cities = await this.system.getCities();
    return new ResponseListDTO(plainToClass(City, cities));
  }
}
