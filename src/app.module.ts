import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceModule } from './price/price.module';
import { EmailModule } from './email/email.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { Price } from './database/entities/price.entity';
import { Alert } from './database/entities/alert.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [Price, Alert],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    PriceModule,
    EmailModule,
    BlockchainModule,
  ],
})
export class AppModule {}