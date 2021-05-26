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
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { GetAuthData } from 'src/auth/get-auth-data.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import { CustomersService } from 'src/customers/customers.service';
import { CustomerDataDTO } from 'src/customers/dtos/customer-data.dto';
import { CustomerFilterDTO } from 'src/customers/dtos/customer-filter.dto';
import { AccountignCatalogIntegrationDTO } from 'src/customers/dtos/customer-integration.dto';
import { CustomerStatusDTO } from 'src/customers/dtos/customer-status.dto';
import { Customer } from 'src/customers/entities/Customer.entity';
import { CustomerBranch } from 'src/customers/entities/CustomerBranch.entity';
import { CustomerTaxerType } from 'src/customers/entities/CustomerTaxerType.entity';
import { CustomerType } from 'src/customers/entities/CustomerType.entity';
import { CustomerTypeNatural } from 'src/customers/entities/CustomerTypeNatural.entity';
import { ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { ProviderStatusDTO } from './dtos/provider-updateStatus.dto';

@Controller('providers')
@UseGuards(AuthGuard())
export class ProvidersController {
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
    return this.customersService.updateCustomerSettingsIntegrations(company, data, 'proveedor');
  }

  @Put('/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomerStatus(
    @Param('id') id: string,
    @Body() data: ProviderStatusDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.UpdateStatusCustomer(id, data, company, 'proveedor');
  }

  @Get('/:id/integrations')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomerIntegration(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return await this.customersService.getCustomerIntegration(id, company, 'proveedor');
  }

  @Get('/:id/tributary')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomerTributary(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<Customer>> {
    return await this.customersService.getCustomerTributary(id, company, 'proveedor');
  }

  @Get('/:id/branches')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomerBranches(@Param('id') id: string): Promise<ResponseListDTO<CustomerBranch>> {
    const branches = await this.customersService.getCustomerBranches(id, 'proveedor');
    return new ResponseListDTO(plainToClass(CustomerBranch, branches));
  }

  @Put('/:id/integrations')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomerIntegration(
    @Param('id') id: string,
    @Body() data: AccountignCatalogIntegrationDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return await this.customersService.UpdateCustomerIntegration(id, data, company, 'proveedor');
  }

  @Get('/report/general')
  async getReportGeneral(@GetAuthData('company') company: Company): Promise<ResponseListDTO<Customer>> {
    return await this.customersService.generateReportGeneral(company, 'proveedores');
  }

  @Get('/report/:id')
  async getReportIndividual(@GetAuthData('company') company: Company, @Param('id') id: string): Promise<Customer> {
    return await this.customersService.generateReportIndividual(company, id, 'proveedor');
  }

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomers(
    @Query() filter: CustomerFilterDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseListDTO<Customer>> {
    const customers = await this.customersService.getCustomers(company, filter, 'proveedores');
    return new ResponseListDTO(plainToClass(Customer, customers));
  }

  @Get('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomer(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<Customer>> {
    const customer = await this.customersService.getCustomer(company, id, 'proveedor');
    return new ResponseSingleDTO(plainToClass(Customer, customer));
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCustomer(
    @Body()
    data: CustomerDataDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.createCustomer(company, data, 'proveedor');
  }

  @Delete('/:id')
  async deleteCustomer(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return this.customersService.deleteCustomer(company, id, 'proveedor');
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomer(
    @Param('id') id: string,
    @Body() data: CustomerDataDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.updateCustomer(id, data, company, 'proveedor');
  }
}
