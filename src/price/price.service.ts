import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Price } from '../database/entities/price.entity';
import { Alert } from '../database/entities/alert.entity';
import { BlockchainService } from '../blockchain/blockchain.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    private blockchainService: BlockchainService,
    private emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async trackPrices() {
    const chains = ['ETH', 'MATIC'];

    for (const chain of chains) {
      try {
        const price = await this.blockchainService.getPrice(chain);
        await this.savePriceAndCheckAlerts(chain, price);
        await this.checkPriceIncrease(chain);
      } catch (error) {
        if (error instanceof Error) {
          this.logger.error(`Failed to track ${chain} price: ${error.message}`);
        } else {
          this.logger.error(`Failed to track ${chain} price: ${String(error)}`);
        }
      }
    }
  }

  private async savePriceAndCheckAlerts(chain: string, price: number) {
    await this.priceRepository.save({
      chain,
      price,
    });

    const alerts = await this.alertRepository.find({
      where: {
        chain,
        triggered: false,
      },
    });

    for (const alert of alerts) {
      if (alert.targetPrice >= price && !alert.triggered) {
        await this.emailService.sendPriceAlert(chain, price, alert.email);
        await this.alertRepository.update(alert.id, { triggered: true });
      }
    }
  }

  private async checkPriceIncrease(chain: string) {
    const latestPrice = await this.priceRepository.findOne({
      where: { chain },
      order: { timestamp: 'DESC' },
    });

    if (!latestPrice) {
      return;
    }

    const previousPrice = await this.priceRepository.findOne({
      where: {
        chain,
        timestamp: LessThanOrEqual(latestPrice.timestamp),
      },
      order: { timestamp: 'DESC' },
    });

    if (previousPrice && latestPrice.price > previousPrice.price) {
      this.logger.log(`Price of ${chain} has increased from ${previousPrice.price} to ${latestPrice.price}`);
    }
  }
}