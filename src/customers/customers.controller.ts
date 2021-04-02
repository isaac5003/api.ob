import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  ResponseListDTO,
  ResponseMinimalDTO,
  ResponseSingleDTO,
} from 'src/_dtos/responseList.dto';
import { CustomersService } from './customers.service';
import { CustomerValidateDTO } from './dtos/customer-validator.dto';
import { CustomerFilterDTO } from './dtos/customer-filter.dto';
import { Customer } from './entities/Customer.entity';
import { CustomerStatusDTO } from './dtos/status-validator-dto';
import { CustomerIntegrationDTO } from './dtos/customer-integration.dto';
import { GetCompany } from 'src/auth/get-company.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('customers')
@UseGuards(AuthGuard())
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomers(
    @Query() filterDto: CustomerFilterDTO,
    @GetCompany() company: Company,
  ): Promise<ResponseListDTO<Customer>> {
    const customers = await this.customersService.getCustomers(
      company,
      filterDto,
    );
    return new ResponseListDTO(plainToClass(Customer, customers));
  }

  @Get('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomer(
    @Param('id') id: string,
    @GetCompany() company: Company,
  ): Promise<ResponseSingleDTO<Customer>> {
    const customer = await this.customersService.getCustomer(company, id);
    return new ResponseSingleDTO(plainToClass(Customer, customer));
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCustomer(
    @Body()
    validatorCustomerDto: CustomerValidateDTO,
    @GetCompany() company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.createCustomer(company, validatorCustomerDto);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomer(
    @Param('id') id: string,
    @Body()
    validatorCustomerDto:
      | CustomerValidateDTO
      | CustomerStatusDTO
      | CustomerIntegrationDTO,
    @GetCompany() company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.updateCustomer(
      company,
      id,
      validatorCustomerDto,
    );
  }

  @Put('/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomerStatus(
    @Param('id') id: string,
    @GetCompany() company: Company,
    @Body() validatorCustomerStatusDto: CustomerStatusDTO,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.updateCustomer(
      company,
      id,
      validatorCustomerStatusDto,
    );
  }

  // @Get('/:id/integrations')
  // @UsePipes(new ValidationPipe({ transform: true }))
  // async getCustomerIntegration(
  //   @Param('id') id: string,
  // ): Promise<{ integrations: any | null }> {
  //   return await this.customersService.getCustomerIntegration(id);
  // }

  @Put('/:id/integrations')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomerIntegration(
    @Param('id') id: string,
    @GetCompany() company: Company,
    @Body() validatorCustomerAccountingDto: CustomerIntegrationDTO,
  ): Promise<{ message: string }> {
    return await this.customersService.updateCustomer(
      company,
      id,
      validatorCustomerAccountingDto,
    );
  }
}
