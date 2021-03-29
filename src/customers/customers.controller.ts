import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ResponseListDTO, ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { CustomersService } from './customers.service';
import { CustomerAddDTO } from './dtos/customer-add-dto';
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

  @Get('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomer(
    @Param('id') id: string,
  ): Promise<ResponseSingleDTO<Customer>> {
    const customer = await this.customersService.getCustomer(id);
    return new ResponseSingleDTO(plainToClass(Customer, customer));
  }

  @Post()
  async createCustomer(
    @Body() validatorCustomerDto: CustomerAddDTO,
  ): Promise<{ message: string }> {
    return this.customersService.createCustomer(validatorCustomerDto);
  }
}
