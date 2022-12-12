import dayjs from 'dayjs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateWeatherRequestDto } from '@requests/dto/create.weather-request.dto';
import {
  TRequest,
  WEATHER_DATE_DEFAULT_FORMAT,
  WeatherPayload,
  WeatherRequestEntity,
  WeatherRequestService,
  WeatherRequestStatus,
} from '@workshop/lib-nest-weather-request';

@Injectable()
export class RequestService {
  private readonly logger = new Logger(RequestService.name);

  constructor(private readonly weatherRequestService: WeatherRequestService) {}

  async create({ latitude, email, longitude, targetDate }: CreateWeatherRequestDto): Promise<WeatherRequestEntity> {
    try {
      const id = WeatherRequestEntity.buildRequestId(email, { longitude, latitude });
      const primaryKeyAttributes: Partial<WeatherRequestEntity> = { id, targetDate };
      await this.weatherRequestService.create(
        new WeatherRequestEntity(primaryKeyAttributes as TRequest<WeatherPayload>),
      );

      return await this.weatherRequestService.update({
        primaryKeyAttributes,
        body: {
          email,
          status: WeatherRequestStatus.DONE,
          nextTime: dayjs().add(0.5, 'hours').unix(),
          payload: { latitude, longitude },
          expireAt: Math.floor(dayjs(targetDate, WEATHER_DATE_DEFAULT_FORMAT).add(1, 'days').unix()),
        },
      });
    } catch (err) {
      this.logger.error(err.stack);
      throw new HttpException(
        'Error during request creation',
        err.$metadata?.httpStatusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: err },
      );
    }
  }

  delete(id: string, targetDate: string): Promise<{ success: boolean }> {
    return this.weatherRequestService.delete(id, targetDate);
  }
}
