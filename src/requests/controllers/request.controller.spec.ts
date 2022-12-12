import { RequestService } from '@requests/services/request.service';
import { Test } from '@nestjs/testing';
import { default as supertest } from 'supertest';
import { RequestController } from '@requests/controllers/request.controller';
import { HttpException, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { createWeatherRequestFixture, WEATHER_DATE_DEFAULT_FORMAT } from '@workshop/lib-nest-weather-request';
import { CreateWeatherRequestDto } from '@requests/dto/create.weather-request.dto';
import dayjs from 'dayjs';

const weatherRequest = createWeatherRequestFixture();

let requestService: RequestService;
let app: INestApplication;

// eslint-disable-next-line @typescript-eslint/naming-convention
const _beforeEach = async () => {
  requestService = {
    create: jest.fn(),
    delete: jest.fn(),
  } as any;

  const moduleRef = await Test.createTestingModule({
    controllers: [RequestController],
    providers: [
      {
        provide: RequestService,
        useValue: requestService,
      },
    ],
  }).compile();
  app = moduleRef.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true, whitelist: true }));

  await app.init();
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const _afterEach = async () => {
  jest.clearAllMocks();
  await app.close();
};

describe('create', () => {
  beforeEach(_beforeEach);

  afterEach(_afterEach);

  const request = <CreateWeatherRequestDto>{
    email: weatherRequest.email,
    latitude: weatherRequest.payload.latitude,
    longitude: weatherRequest.payload.longitude,
    targetDate: dayjs().add(1, 'days').format(WEATHER_DATE_DEFAULT_FORMAT),
  };

  test('happy path', async () => {
    (requestService.create as any).mockImplementation(() => Promise.resolve(weatherRequest));

    const response = await supertest(app.getHttpServer())
      .post('/requests')
      .set({ 'content-type': 'application/json' })
      .send(request)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(weatherRequest);
    expect(requestService.create).toHaveBeenCalledWith(request);
  });

  test('error 400', async () => {
    (requestService.create as any).mockImplementation(() => Promise.resolve(weatherRequest));

    await supertest(app.getHttpServer())
      .post('/requests')
      .set({ 'content-type': 'application/json' })
      .send({ ...request, latitude: undefined })
      .expect(HttpStatus.BAD_REQUEST);
  });

  test('error 500', async () => {
    const message = 'Test error';
    (requestService.create as any).mockImplementation(() => {
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    });

    const response = await supertest(app.getHttpServer())
      .post('/requests')
      .set({ 'content-type': 'application/json' })
      .send(request)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);

    expect(response.body.message).toBe(message);
    expect(requestService.create).toHaveBeenCalledWith(request);
  });
});

describe('delete', () => {
  beforeEach(_beforeEach);

  afterEach(_afterEach);

  test('happy path', async () => {
    const result = { success: true };

    (requestService.delete as any).mockImplementation(() => Promise.resolve(result));

    const response = await supertest(app.getHttpServer())
      .delete(`/requests/${weatherRequest.id}_${weatherRequest.targetDate}`)
      .set({ 'content-type': 'application/json' })
      .send()
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(result);
    expect(requestService.delete).toHaveBeenCalledWith(weatherRequest.id, weatherRequest.targetDate);
  });

  test('error 500', async () => {
    const result = { success: false };

    (requestService.delete as any).mockImplementation(() => Promise.resolve(result));

    await supertest(app.getHttpServer())
      .delete(`/requests/${weatherRequest.id}_${weatherRequest.targetDate}`)
      .set({ 'content-type': 'application/json' })
      .send()
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);

    expect(requestService.delete).toHaveBeenCalledWith(weatherRequest.id, weatherRequest.targetDate);
  });
});
