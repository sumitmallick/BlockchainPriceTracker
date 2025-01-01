import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendPriceAlert(chain: string, price: number, email: string) {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: `Price Alert for ${chain}`,
      text: `The price of ${chain} has reached ${price} USD`,
      html: `
        <h2>Price Alert</h2>
        <p>The price of ${chain} has reached ${price} USD</p>
      `,
    });
  }

  async sendPriceIncreaseAlert(chain: string, increasePercentage: number) {
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: 'hyperhire_assignment@hyperhire.in',
      subject: `${chain} Price Increase Alert`,
      text: `The price of ${chain} has increased by ${increasePercentage.toFixed(2)}% in the last hour`,
      html: `
        <h2>Price Increase Alert</h2>
        <p>The price of ${chain} has increased by ${increasePercentage.toFixed(2)}% in the last hour</p>
      `,
    });
  }
}