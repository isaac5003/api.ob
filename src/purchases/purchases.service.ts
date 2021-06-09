import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchasesStatus } from './entities/PurchasesStatus.entity';

@Injectable()
export class PurchasesService {
  constructor() {}
}
