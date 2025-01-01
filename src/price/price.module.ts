import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { Price } from '../database/entities/price.entity';
import { Alert } from '../database/entities/alert.entity';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Price, Alert]),
    BlockchainModule,
    EmailModule,
  ],
  controllers: [PriceController],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}