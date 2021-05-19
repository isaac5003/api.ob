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
import { FilterDTO } from 'src/_dtos/filter.dto';
import { ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { AccountingCreateDTO } from './dtos/accounting-catalog/entries-accountingcatalog-create.dto';
import { AccountingUpdateDTO } from './dtos/accounting-catalog/entries-accountingcatalog-update.dto';
import { EstadoBalanceDTO } from './dtos/settings/entries-balanceestado-seting.dto';
import { SettingGeneralDTO } from './dtos/settings/entries-setting-general.dto';
import { SettingIntegrationsDTO } from './dtos/settings/entries-setting-integration.dto';
import { SettingSignaturesDTO } from './dtos/settings/entries-setting-signatures.dto';
import { BalanceEstadoDTO } from './dtos/report/entries-balance-startdate.dto';
import { EntryDetailsDTO } from './dtos/entry-details/entries-details-create.dto';
import { EntryHeaderDataDTO } from './dtos/entry-header/entries-entry-header-create.dto';
import { EntryHeaderCreateDTO } from './dtos/entry-header/entries-header-create.dto';
import { EntriesFilterDTO } from './dtos/entries-filter.dto';
import { DiarioMayorDTO } from './dtos/report/entries-libromayor-report.dto';
import { AccountsMovementsDTO } from './dtos/report/entries-movements.dto';
import { SeriesDTO } from './dtos/serie/entries-series.dto';
import { AccountingCatalog } from './entities/AccountingCatalog.entity';
import { AccountingEntry } from './entities/AccountingEntry.entity';
import { AccountingEntryType } from './entities/AccountingEntryType.entity';
import { AccountingRegisterType } from './entities/AccountingRegisterType.entity';
import { AccountingSetting } from './entities/AccountingSetting.entity';
import { EntriesService } from './entries.service';

@Controller('entries')
@UseGuards(AuthGuard())
export class EntriesController {
  constructor(private entries: EntriesService) {}

  @Get('/catalog')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCatalog(
    @GetAuthData('company') company: Company,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<AccountingCatalog>> {
    const accountingCatalogs = await this.entries.getAccountingCatalogs(company, filter);
    return new ResponseListDTO(plainToClass(AccountingCatalog, accountingCatalogs));
  }

  @Post('/catalog')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createAccount(
    @Body('accounts') accounts: AccountingCreateDTO[],
    @Body('parentCatalog') parentCatalog: string,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return await this.entries.createAccount(accounts, parentCatalog, company);
  }

  @Put('/catalog/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateAccount(
    @Param('id') id: string,
    @Body() data: AccountingUpdateDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return await this.entries.updateAccountingCatalog(id, company, data);
  }

  @Delete('/catalog/:id')
  async deleteCustomer(@Param('id') id: string, @GetAuthData('company') company: Company): Promise<ResponseMinimalDTO> {
    return await this.entries.deleteAccount(company, id);
  }

  @Get('/types')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getEntryTypes(@GetAuthData('company') company: Company): Promise<ResponseListDTO<AccountingEntryType>> {
    const entryTypes = await this.entries.getEntryTypes(company);
    return new ResponseListDTO(plainToClass(AccountingEntryType, entryTypes));
  }

  @Get('/serie')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getSeries(@GetAuthData('company') company: Company, @Query() data: SeriesDTO): Promise<ResponseMinimalDTO> {
    return await this.entries.getSeries(company, data);
  }

  @Get('/register-type')
  async getRegisterType(@GetAuthData('company') company: Company): Promise<ResponseListDTO<AccountingRegisterType>> {
    const registerType = await this.entries.getResgisterType(company);
    return new ResponseListDTO(plainToClass(AccountingRegisterType, registerType));
  }

  @Get('/setting/general')
  async getSettingGeneral(@GetAuthData('company') company: Company): Promise<ResponseSingleDTO<AccountingSetting>> {
    return await this.entries.getSettings(company, 'general');
  }

  @Get('/setting/signatures')
  async getSettingSignatures(@GetAuthData('company') company: Company): Promise<ResponseSingleDTO<AccountingSetting>> {
    return await this.entries.getSettings(company, 'firmantes');
  }

  @Get('/setting/integrations')
  async getSettingIntegrations(
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<AccountingSetting>> {
    return await this.entries.getSettings(company, 'integraciones');
  }

  @Get('/setting/balance-general')
  async getSettingBalanceGeneral(
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<AccountingSetting>> {
    return await this.entries.getSettings(company, 'balance-general');
  }

  @Get('/setting/estado-resultados')
  async getSettingestadoResultado(
    @GetAuthData('company') company: Company,
  ): Promise<ResponseSingleDTO<AccountingSetting>> {
    return await this.entries.getSettings(company, 'estado-resultados');
  }

  @Put('/setting/general')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSettingGeneral(
    @GetAuthData('company') company: Company,
    @Body() data: SettingGeneralDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.entries.updateSettingGeneral(company, data, 'general');
  }

  @Put('/setting/signatures')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSettingSignatures(
    @GetAuthData('company') company: Company,
    @Body() data: SettingSignaturesDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.entries.updateSettingSignatures(company, data, 'firmantes');
  }

  @Put('/setting/integrations')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSettingIntegrations(
    @GetAuthData('company') company: Company,
    @Body() data: SettingIntegrationsDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.entries.updateSettingIntegrations(company, data, 'integraciones');
  }

  @Put('/setting/balance-general')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSettingBalance(
    @GetAuthData('company') company: Company,
    @Body() data: EstadoBalanceDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.entries.updateBalanceSettings(company, data, 'integraciones', 'balance-general');
  }

  @Put('/setting/estado-resultados')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSettingEstadoResultados(
    @GetAuthData('company') company: Company,
    @Body() data: EstadoBalanceDTO,
  ): Promise<ResponseMinimalDTO> {
    return await this.entries.updateBalanceSettings(company, data, 'integraciones', 'estado-resultados');
  }

  @Get('/report/diario-mayor')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getDiarioMayor(@GetAuthData('company') company: Company, @Query() date: DiarioMayorDTO): Promise<any> {
    return await this.entries.getReport(company, date, 'diarioMayor');
  }

  @Get('/report/auxiliares')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAuxiliares(@GetAuthData('company') company: Company, @Query() date: DiarioMayorDTO): Promise<any> {
    return await this.entries.getReport(company, date, 'auxiliares');
  }

  @Get('/report/balance-comprobacion')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getBalanceComprobacion(@GetAuthData('company') company: Company, @Query() date: DiarioMayorDTO): Promise<any> {
    return await this.entries.getReport(company, date, 'balanceComprobacion');
  }

  @Get('/report/estado-resultados')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getEstadoResultados(@GetAuthData('company') company: Company, @Query() date: BalanceEstadoDTO): Promise<any> {
    return await this.entries.getReport(company, date, 'estado-resultados');
  }

  @Get('/report/balance-general')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getBalanceGeneral(@GetAuthData('company') company: Company, @Query() date: BalanceEstadoDTO): Promise<any> {
    return await this.entries.getReport(company, date, 'balance-general');
  }

  @Get('/report/account-movements')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAccounMovements(
    @GetAuthData('company') company: Company,
    @Query() date: AccountsMovementsDTO,
  ): Promise<any> {
    return await this.entries.getReport(company, date, 'accountMovements');
  }

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getEntries(
    @GetAuthData('company') company: Company,
    @Query() filter: EntriesFilterDTO,
  ): Promise<ResponseListDTO<AccountingEntry>> {
    return await this.entries.getEntries(company, filter);
  }

  @Get('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getEntry(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
  ): Promise<ResponseSingleDTO<AccountingEntry>> {
    return await this.entries.getEntry(company, id);
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createEntry(
    @GetAuthData('company') company: Company,
    @Body('header') header: EntryHeaderCreateDTO,
    @Body('details') details: EntryDetailsDTO[],
  ): Promise<ResponseMinimalDTO> {
    return await this.entries.createUpdateEntry(company, header, details, 'create');
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateEntry(
    @GetAuthData('company') company: Company,
    @Body('header') header: EntryHeaderDataDTO,
    @Body('details') details: EntryDetailsDTO[],
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.entries.createUpdateEntry(company, header, details, 'update', id);
  }

  @Delete('/:id')
  async deleteEntry(@GetAuthData('company') company: Company, @Param('id') id: string): Promise<ResponseMinimalDTO> {
    return await this.entries.deleteEntry(company, id);
  }
}
