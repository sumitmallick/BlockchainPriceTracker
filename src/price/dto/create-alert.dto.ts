import { IsString, IsNumber, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlertDto {
  @ApiProperty({
    description: 'Blockchain name (ETH or MATIC)',
    example: 'ETH'
  })
  @IsString()
  chain!: string;

  @ApiProperty({
    description: 'Target price for the alert in USD',
    example: 2000
  })
  @IsNumber()
  targetPrice!: number;

  @ApiProperty({
    description: 'Email address to receive the alert',
    example: 'user@example.com'
  })
  @IsEmail()
  email!: string;
}