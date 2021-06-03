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
import { BranchDataDTO } from 'src/customers/dtos/customer-branch.dto';
import { CustomerDataDTO } from 'src/customers/dtos/customer-data.dto';
import { CustomerFilterDTO } from 'src/customers/dtos/customer-filter.dto';
import { AccountignCatalogIntegrationDTO } from 'src/customers/dtos/customer-integration.dto';
import { Customer } from 'src/customers/entities/Customer.entity';
import { CustomerBranch } from 'src/customers/entities/CustomerBranch.entity';
import { CustomerTaxerType } from 'src/customers/entities/CustomerTaxerType.entity';
import { CustomerType } from 'src/customers/entities/CustomerType.entity';
import { CustomerTypeNatural } from 'src/customers/entities/CustomerTypeNatural.entity';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { IsCustomerDTO } from './dtos/provider-isCustomer.dto';
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
  async getCustomerBranches(
    @Param('id') id: string,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<CustomerBranch>> {
    const branches = await this.customersService.getCustomerBranches(id, filter);
    return new ResponseListDTO(plainToClass(CustomerBranch, branches));
  }

  @Get('/:providerId/branches/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomerBranch(
    @Param('id') id: string,
    @Param('providerId') provider: string,
  ): Promise<ResponseSingleDTO<CustomerBranch>> {
    const branch = await this.customersService.getCustomerBranch(id, provider, 'proveedor');
    return new ResponseSingleDTO(plainToClass(CustomerBranch, branch));
  }

  @Post('/:providerId/branches')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCustomerBranches(
    @Body('branches') data: BranchDataDTO[],
    @Param('providerId') providerId: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return await this.customersService.createBranches(data, providerId, company, 'proveedores');
  }

  @Put('/:providerId/branches/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomerBranch(
    @Param('id') id: string,
    @Body('branch') data: BranchDataDTO,
    @Param('providerId') provider: string,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.updateBranch(id, data, provider, 'proveedor');
  }

  @Put('/:providerId/branches/:id/default')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomerDefault(
    @Param('id') id: string,
    @Param('providerId') provider: string,
    @Query() filter: FilterDTO,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.updateBranchDefault(id, filter, provider, 'proveedor');
  }

  @Delete('/:providerId/branches/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async deleteCustomerBranch(
    @Param('id') id: string,
    @Param('providerId') providerId: string,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.deleteBranch(id, providerId, 'proveedor');
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
    isCustomer: IsCustomerDTO,
    @Body()
    data: CustomerDataDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.createCustomer(company, { ...data, isCustomer }, 'proveedor');
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
