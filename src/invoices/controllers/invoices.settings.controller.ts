import { Body, Controller, Get, Param, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAuthData } from 'src/auth/get-auth-data.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import { ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { InvoiceIntegrationActiveDTO } from '../dtos/validate/invoice-integration-active.vdto';
import { InvoicesIntegrationsDTO } from '../dtos/validate/invoice-integration.vdto';
import { InvoicesSettingService } from '../services/invoices.settings.service';

@Controller('setting')
@UseGuards(AuthGuard())
export class InvoicesSettingController {
  constructor(private invoiceSettings: InvoicesSettingService) {}

  @Get('/integrations/:shortname')
  async getSettingIntegrations(
    @GetAuthData('company') company: Company,
    @Param('shortname') integratedModule: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoiceSettings.getInvoicesIntegrations(company, integratedModule);
  }

  @Put('/integrations/:shortname')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSettingIntegrations(
    @Body() data: InvoicesIntegrationsDTO,
    @GetAuthData('company') company: Company,
    @Param('shortname') integratedModule: string,
  ): Promise<ResponseMinimalDTO> {
    return this.invoiceSettings.upsertInvoicesIntegrations(company, data, integratedModule);
  }

  @Put('/integrations/:shortname/active')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSettingIntegrationsActive(
    @Body() data: InvoiceIntegrationActiveDTO,
    @GetAuthData('company') company: Company,
    @Param('shortname') integratedModule: string,
  ): Promise<ResponseMinimalDTO> {
    return this.invoiceSettings.updateInvoicesIntegrationsActive(company, data, integratedModule);
  }
}
