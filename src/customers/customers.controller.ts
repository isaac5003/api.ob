import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ResponseListDTO } from 'src/_dtos/responseList.dto';
import { CustomersService } from './customers.service';
import { CustomerFilterDTO } from './dtos/customer-filter.dto';
import { Customer } from './entities/Customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomers(
    @Query() filterDto: CustomerFilterDTO,
  ): Promise<ResponseListDTO<Customer>> {
    const customers = await this.customersService.getCustomers(filterDto);
    return new ResponseListDTO(plainToClass(Customer, customers));
  }
}
