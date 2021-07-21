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
import { BranchDataDTO } from './dtos/customer-branch.dto';
import { FilterDTO } from 'src/_dtos/filter.dto';
@Controller('customers')
@UseGuards(AuthGuard())
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get('/types')
  async getTypes(): Promise<ResponseListDTO<CustomerType, number, number, number>> {
    const { data, count } = await this.customersService.getCustomerTypes();
    return new ResponseListDTO(plainToClass(CustomerType, data), count);
  }

  @Get('/taxer-types')
  async getTaxerTypes(): Promise<ResponseListDTO<CustomerTaxerType, number, number, number>> {
    const { data, count } = await this.customersService.getCustomerTaxerTypes();
    return new ResponseListDTO(plainToClass(CustomerTaxerType, data), count);
  }

  @Get('/type-naturals')
  async getTypeNaturals(): Promise<ResponseListDTO<CustomerTypeNatural, number, number, number>> {
    const { data, count } = await this.customersService.getCustomerTypeNaturals();
    return new ResponseListDTO(plainToClass(CustomerTypeNatural, data), count);
  }

  @Get('/setting/integrations/:shortname')
  async getSettingIntegrations(
    @GetAuthData('company') company: Company,
    @Param('shortname') integratedValue: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.customersService.getCustomerSettingIntegrations(company, integratedValue);
  }

  @Put('/setting/integrations/:shortname')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSettingIntegrations(
    @Body() data: AccountignCatalogIntegrationDTO,
    @GetAuthData('company') company: Company,
    @Param('shortname') integratedModule: string,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.upsertCustomerSettingsIntegrations(company, data, integratedModule);
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

  @Get('/:id/integrations/:shortname')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomerIntegration(
    @Param('id') id: string,
    @GetAuthData('company') company: Company,
    @Param('shortname') integratedModule: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.customersService.getCustomerIntegration(id, company, integratedModule);
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
  async getCustomerBranches(
    @Param('id') id: string,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<CustomerBranch, number, number, number>> {
    const { data, count } = await this.customersService.getCustomerBranches(id, filter);
    return new ResponseListDTO(plainToClass(CustomerBranch, data), count, filter.page, filter.limit);
  }

  @Get('/:customerId/branches/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCustomerBranch(
    @Param('id') id: string,
    @Param('customerId') customer: string,
  ): Promise<ResponseSingleDTO<CustomerBranch>> {
    const branch = await this.customersService.getCustomerBranch(id, customer);
    return new ResponseSingleDTO(plainToClass(CustomerBranch, branch));
  }

  @Post('/:customerId/branches')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCustomerBranches(
    @Body('branches') data: BranchDataDTO[],
    @Param('customerId') customerId: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return await this.customersService.createBranches(data, customerId, company);
  }

  @Put('/:customerId/branches/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomerBranch(
    @Param('id') id: string,
    @Body('branch') data: BranchDataDTO,
    @Param('customerId') customer: string,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.updateBranch(id, data, customer);
  }

  @Put('/:customerId/branches/:id/default')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomerDefault(
    @Param('id') id: string,
    @Param('customerId') customer: string,
    @Query() filter: FilterDTO,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.updateBranchDefault(id, filter, customer);
  }

  @Delete('/:customerId/branches/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async deleteCustomerBranch(
    @Param('id') id: string,
    @Param('customerId') customerId: string,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.deleteBranch(id, customerId);
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

  @Put('/:id/integrations/:shortname')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCustomerIntegration(
    @Param('id') id: string,
    @Param('shortname') integratedModule: string,
    @Body() data: AccountignCatalogIntegrationDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return await this.customersService.UpdateCustomerIntegration(id, data, company, integratedModule);
  }

  @Delete('/:id')
  async deleteCustomer(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return this.customersService.deleteCustomer(company, id);
  }

  @Get('/report/general')
  async getReportGeneral(
    @GetAuthData('company') company: Company,
  ): Promise<ResponseListDTO<Customer, number, number, number>> {
    return this.customersService.generateReportGeneral(company);
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
  ): Promise<ResponseListDTO<Customer, number, number, number>> {
    const { data, count } = await this.customersService.getCustomers(company, filter);
    return new ResponseListDTO(plainToClass(Customer, data), count, filter.page, filter.limit);
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCustomer(
    @Body() { isProvider }: IsProviderDTO,
    @Body()
    data: CustomerDataDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.customersService.createCustomer(company, { ...data, isProvider });
  }
}
