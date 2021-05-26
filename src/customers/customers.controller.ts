import {
  Body,
  Controller,
  Delete,
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
import { ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from '../_dtos/responseList.dto';
import { CustomersService } from './customers.service';
import { CustomerDataDTO } from './dtos/customer-data.dto';
import { CustomerFilterDTO } from './dtos/customer-filter.dto';
import { Customer } from './entities/Customer.entity';
import { CustomerStatusDTO } from './dtos/customer-status.dto';
import { AccountignCatalogIntegrationDTO } from './dtos/customer-integration.dto';
import { GetAuthData } from '../auth/get-auth-data.decorator';
import { Company } from '../companies/entities/Company.entity';
import { AuthGuard } from '@nestjs/passport';
import { CustomerBranch } from './entities/CustomerBranch.entity';
import { CustomerType } from './entities/CustomerType.entity';
import { CustomerTaxerType } from './entities/CustomerTaxerType.entity';
import { CustomerTypeNatural } from './entities/CustomerTypeNatural.entity';
import { IsProviderDTO } from './dtos/customers-isprovider.dto';
@Controller('customers')
@UseGuards(AuthGuard())
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get('/types')
  async getTypes(): Promise<ResponseListDTO<CustomerType>> {
    const types = await this.customersService.getCustomerTypes();
    return new ResponseListDTO(plainToClass(CustomerType, types));
  }

  @Get('/taxer-types')
  async getTaxerTypes(): Promise<ResponseListDTO<CustomerTaxerType>> {
    const taxerTypes = await this.customersService.getCustomerTaxerTypes();
    return new ResponseListDTO(plainToClass(CustomerTaxerType, taxerTypes));
  }

  @Get('/type-naturals')
  async getTypeNaturals(): Promise<ResponseListDTO<CustomerTypeNatural>> {
    const typeNatural = await this.customersService.getCustomerTypeNaturals();
    return new ResponseListDTO(plainToClass(CustomerTypeNatural, typeNatural));
  }

  @Get('/setting/integrations')
  async getSettingIntegrations(@GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return await this.customersService.getCustomerSettingIntegrations(company);
  }

  @Put('/setting/integrations')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSettingIntegrations(
    @Body() data: AccountignCatalogIntegrationDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.updateCustomerSettingsIntegrations(company, data);
  }

  @Put('/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomerStatus(
    @Param('id') id: string,
    @Body() data: CustomerStatusDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.UpdateStatusCustomer(id, data, company);
  }

  @Get('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomer(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<Customer>> {
    const customer = await this.customersService.getCustomer(company, id);
    return new ResponseSingleDTO(plainToClass(Customer, customer));
  }

  @Get('/:id/integrations')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomerIntegration(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return await this.customersService.getCustomerIntegration(id, company);
  }

  @Get('/:id/tributary')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomerTributary(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<Customer>> {
    return await this.customersService.getCustomerTributary(id, company);
  }

  @Get('/:id/branches')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomerBranches(@Param('id') id: string): Promise<ResponseListDTO<CustomerBranch>> {
    const branches = await this.customersService.getCustomerBranches(id);
    return new ResponseListDTO(plainToClass(CustomerBranch, branches));
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomer(
    @Param('id') id: string,
    @Body() data: CustomerDataDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.updateCustomer(id, data, company);
  }

  @Put('/:id/integrations')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomerIntegration(
    @Param('id') id: string,
    @Body() data: AccountignCatalogIntegrationDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return await this.customersService.UpdateCustomerIntegration(id, data, company);
  }

  @Delete('/:id')
  async deleteCustomer(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return this.customersService.deleteCustomer(company, id);
  }

  @Get('/report/general')
  async getReportGeneral(@GetAuthData('company') company: Company): Promise<ResponseListDTO<Customer>> {
    return await this.customersService.generateReportGeneral(company);
  }

  @Get('/report/:id')
  async getReportIndividual(@GetAuthData('company') company: Company, @Param('id') id: string): Promise<Customer> {
    return await this.customersService.generateReportIndividual(company, id);
  }

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomers(
    @Query() filter: CustomerFilterDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseListDTO<Customer>> {
    const customers = await this.customersService.getCustomers(company, filter);
    return new ResponseListDTO(plainToClass(Customer, customers));
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCustomer(
    @Body() isProvider: IsProviderDTO,
    @Body()
    data: CustomerDataDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.createCustomer(company, { ...data, isProvider });
  }
}
