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
import { GetAuthData } from '../auth/get-auth-data.decorator';
import { Company } from '../companies/entities/Company.entity';
import { FilterDTO } from '../_dtos/filter.dto';
import { ReportsEntriesDTO, ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from '../_dtos/responseList.dto';
import { AccountingCreateDTO } from './dtos/accounting-catalog/entries-accountingcatalog-create.dto';
import { AccountingUpdateDTO } from './dtos/accounting-catalog/entries-accountingcatalog-update.dto';
import { EstadoBalanceDTO } from './dtos/settings/entries-balanceestado-setting.vdto';
import { SettingGeneralDTO } from './dtos/settings/entries-setting-general.vdto';
import { SettingSignaturesDTO } from './dtos/settings/entries-setting-signatures.vdto';
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
import { AccountingSetting } from './entities/AccountingSetting.entity';
import { EntriesService } from './entries.service';
import { plainToClass } from 'class-transformer';

@Controller('entries')
@UseGuards(AuthGuard())
export class EntriesController {
  constructor(private entries: EntriesService) {}

  @Get('/report/print-entry/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getReportEntry(@GetAuthData('company') company: Company, @Param('id') id: string): Promise<ReportsEntriesDTO> {
    return await this.entries.generateReportEntry(company, id);
  }

  @Get('/catalog')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCatalog(
    @GetAuthData('company') company: Company,
    @Query() filter: FilterDTO,
  ): Promise<ResponseListDTO<AccountingCatalog, number, number, number>> {
    const { data, count } = await this.entries.getAccountingCatalogs(company, filter);
    return new ResponseListDTO(plainToClass(AccountingCatalog, data), count, filter.page, filter.limit);
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
  async getEntryTypes(): Promise<ResponseListDTO<AccountingEntryType, number, number, number>> {
    const { data, count } = await this.entries.getEntryTypes();
    return new ResponseListDTO(plainToClass(AccountingEntryType, data), count);
  }

  @Get('/serie')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getSeries(@GetAuthData('company') company: Company, @Query() data: SeriesDTO): Promise<ResponseMinimalDTO> {
    return await this.entries.getSeries(company, data);
  }

  @Get('/setting/general')
  async getSettingGeneral(@GetAuthData('company') company: Company): Promise<ResponseSingleDTO<AccountingSetting>> {
    return await this.entries.getSettings(company, 'general');
  }

  @Get('/setting/signatures')
  async getSettingSignatures(@GetAuthData('company') company: Company): Promise<ResponseSingleDTO<AccountingSetting>> {
    return await this.entries.getSettings(company, 'firmantes');
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

  @Get('/report/accounting-catalog')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAccount(@GetAuthData('company') company: Company): Promise<any> {
    return await this.entries.getReport(company, { date: null }, 'accounting-catalog');
  }
  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getEntries(
    @GetAuthData('company') company: Company,
    @Query() filter: EntriesFilterDTO,
  ): Promise<ResponseListDTO<Partial<AccountingEntry>, number, number, number>> {
    const { data, count, limit, page } = await this.entries.getEntries(company, filter);
    return new ResponseListDTO(plainToClass(AccountingEntry, data), count, page, limit);
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
