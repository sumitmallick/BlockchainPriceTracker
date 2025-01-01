import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/prices/hourly (GET)', () => {
    return request(app.getHttpServer())
      .get('/prices/hourly?chain=ETH')
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('/prices/swap-rate (GET)', () => {
    return request(app.getHttpServer())
      .get('/prices/swap-rate?ethAmount=1')
      .expect(200)
      .expect('Content-Type', /json/);
  });

  afterAll(async () => {
    await app.close();
  });
});