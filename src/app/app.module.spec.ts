import dayjs from 'dayjs';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@app/app.module';
import { default as supertest } from 'supertest';
import { CreateWeatherRequestDto } from '@requests/dto/create.weather-request.dto';
import {
  createWeatherRequestFixture,
  WEATHER_DATE_DEFAULT_FORMAT,
  WeatherRequestStatus,
} from '@workshop/lib-nest-weather-request';

let app: INestApplication;

beforeAll(async () => {
  // Start app
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleRef.createNestApplication({ logger: false });
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true, whitelist: true }));
  await app.init();
});

afterAll(async () => {
  // MockDate.reset();
  await app.close();
});

describe('weather-requests', () => {
  const weatherRequest = createWeatherRequestFixture();

  const request = <CreateWeatherRequestDto>{
    email: weatherRequest.email,
    latitude: weatherRequest.payload.latitude,
    longitude: weatherRequest.payload.longitude,
    targetDate: dayjs().add(1, 'days').format(WEATHER_DATE_DEFAULT_FORMAT),
  };

  const testCreate = async () => {
    const response = await supertest(app.getHttpServer())
      .post('/requests')
      .set({ 'content-type': 'application/json' })
      .send(request)
      .expect(HttpStatus.OK);

    expect(response.body.id).toBeDefined();
    expect(response.body.targetDate).toBe(request.targetDate);
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
    expect(response.body.nextTime).toBeDefined();
    expect(response.body.email).toBe(request.email);
    expect(response.body.payload).toEqual({ latitude: request.latitude, longitude: request.longitude });
    expect(response.body.status).toBe(WeatherRequestStatus.DONE);

    return response.body;
  };

  const testDelete = async (id: string, targetDate: string) => {
    const response = await supertest(app.getHttpServer())
      .delete(`/requests/${id}_${targetDate}`)
      .set({ 'content-type': 'application/json' })
      .send()
      .expect(HttpStatus.OK);

    expect(response.body.success).toBeTruthy();
  };

  test('scenarios', async () => {
    const createResult = await testCreate();

    await testDelete(createResult.id, createResult.targetDate);
  }, 200000);
});
