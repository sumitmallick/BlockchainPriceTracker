import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Price } from '../database/entities/price.entity';
import { Alert } from '../database/entities/alert.entity';
import { BlockchainService } from '../blockchain/blockchain.service';
import { EmailService } from '../email/email.service';
import { CreateAlertDto } from './dto/create-alert.dto';

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
        this.logger.error(`Failed to track ${chain} price: ${error.message}`);
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
      if ((alert.targetPrice >= price && !alert.triggered)) {
        await this.emailService.sendPriceAlert(chain, price, alert.email);
        await this.alertRepository.update(alert.id, { triggered: true });
      }
    }
  }

  private async checkPriceIncrease(chain: string) {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const [currentPrice, oldPrice] = await Promise.all([
      this.priceRepository.findOne({
        where: { chain },
        order: { timestamp: 'DESC' },
      }),
      this.priceRepository.findOne({
        where: {
          chain,
          timestamp: LessThanOrEqual(oneHourAgo),
        },
        order: { timestamp: 'DESC' },
      }),
    ]);

    if (currentPrice && oldPrice) {
      const priceIncrease = ((currentPrice.price - oldPrice.price) / oldPrice.price) * 100;
      
      if (priceIncrease > 3) {
        await this.emailService.sendPriceIncreaseAlert(chain, priceIncrease);
      }
    }
  }

  async getHourlyPrices(chain: string) {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    return this.priceRepository.find({
      where: {
        chain,
        timestamp: MoreThanOrEqual(twentyFourHoursAgo),
      },
      order: { timestamp: 'DESC' },
    });
  }

  async createAlert(createAlertDto: CreateAlertDto) {
    const alert = this.alertRepository.create(createAlertDto);
    return this.alertRepository.save(alert);
  }

  async getSwapRate(ethAmount: number) {
    return this.blockchainService.getSwapRate(ethAmount);
  }
}