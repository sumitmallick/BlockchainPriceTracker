import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface PriceResponse {
  usdPrice: number;
  nativePrice?: {
    value: string;
    decimals: number;
    name: string;
    symbol: string;
  };
}

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);

  constructor(private configService: ConfigService) {}

  async getPrice(chain: string): Promise<number> {
    const apiKey = this.configService.get<string>('MORALIS_API_KEY');
    const symbol = chain.toUpperCase();
    
    try {
      const response = await axios.get<PriceResponse>(
        `https://deep-index.moralis.io/api/v2/erc20/${symbol}/price`,
        {
          headers: {
            'X-API-Key': apiKey,
          },
        }
      );
      
      this.logger.log(`Fetched price for ${chain}: ${response.data.usdPrice}`);
      return response.data.usdPrice;
    } catch (error) {
      this.logger.error(`Failed to fetch price for ${chain}: ${error.message}`);
      throw new HttpException(
        `Failed to fetch price for ${chain}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSwapRate(ethAmount: number) {
    try {
      const [ethPrice, btcPrice] = await Promise.all([
        this.getPrice('ETH'),
        this.getPrice('BTC'),
      ]);
      
      const btcAmount = (ethAmount * ethPrice) / btcPrice;
      const feePercentage = 0.03;
      const feeInEth = ethAmount * feePercentage;
      const feeInUsd = feeInEth * ethPrice;

      const result = {
        btcAmount: Number(btcAmount.toFixed(8)),
        fee: {
          eth: Number(feeInEth.toFixed(8)),
          usd: Number(feeInUsd.toFixed(2)),
        },
        exchangeRate: Number((ethPrice / btcPrice).toFixed(8)),
      };

      this.logger.log(`Calculated swap rate for ${ethAmount} ETH`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to calculate swap rate: ${error.message}`);
      throw new HttpException(
        'Failed to calculate swap rate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}