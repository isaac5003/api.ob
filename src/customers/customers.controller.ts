import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ResponseListDTO, ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { CustomersService } from './customers.service';
import { CustomerValidateDTO } from './dtos/customer-validator-dto';
import { CustomerFilterDTO } from './dtos/customer-filter.dto';
import { Customer } from './entities/Customer.entity';
import { CustomerValidateStatusDTO } from './dtos/status-validator-dto';

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
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCustomer(
    @Body() validatorCustomerDto: CustomerValidateDTO,
  ): Promise<{ message: string; id: string }> {
    return this.customersService.createCustomer(validatorCustomerDto);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomer(
    id: string,
    @Body() validatorCustomerDto: CustomerValidateDTO,
  ): Promise<{ message: string }> {
    return this.customersService.updateCustomer(id, validatorCustomerDto);
  }

  @Put('/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomerStatus(
    @Param('id') id: string,
    @Body() validatorCustomerStatusDto: CustomerValidateStatusDTO,
  ): Promise<{ message: string }> {
    return this.customersService.updateCustomerStatus(
      id,
      validatorCustomerStatusDto,
    );
  }

  @Get('/:id/integrations')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomerIntegration(
    @Param('id') id: string,
  ): Promise<{ integrations: any | null }> {
    return await this.customersService.getCustomerIntegration(id);
  }
}
