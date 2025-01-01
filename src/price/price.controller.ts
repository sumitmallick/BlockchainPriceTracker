import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PriceService } from './price.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { SwapRateDto } from './dto/swap-rate.dto';

@ApiTags('prices')
@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('hourly')
  @ApiOperation({ summary: 'Get hourly prices for the last 24 hours' })
  @ApiResponse({
    status: 200,
    description: 'Returns hourly price data for the specified chain'
  })
  async getHourlyPrices(
    @Query('chain') chain: string
  ) {
    return this.priceService.getHourlyPrices(chain);
  }

  @Post('alerts')
  @ApiOperation({ summary: 'Create a new price alert' })
  @ApiResponse({
    status: 201,
    description: 'Price alert has been created successfully'
  })
  async createAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.priceService.createAlert(createAlertDto);
  }

  @Get('swap-rate')
  @ApiOperation({ summary: 'Get ETH to BTC swap rate' })
  @ApiResponse({
    status: 200,
    description: 'Returns the swap rate and fees'
  })
  async getSwapRate(@Query() swapRateDto: SwapRateDto) {
    return this.priceService.getSwapRate(swapRateDto.ethAmount);
  }
}
