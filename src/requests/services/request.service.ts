import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateRequestDto } from '@requests/dto/create.request.dto';
import { WeatherRequestEntity } from '@requests/entities/weather.request.entity';
import { REQUESTS, WEATHER_DATE_DEFAULT_FORMAT } from '@requests/constants/request.constants';
import { AwsDynamodbService } from '@workshop/lib-nest-aws/dist/services/dynamodb';
import { RequestStatus } from '@requests/enums/request.enums';
import { EntityManager } from '@typedorm/core';

dayjs.extend(customParseFormat);

@Injectable()
export class RequestService {
  private readonly logger = new Logger(RequestService.name);

  private readonly entityManager: EntityManager;

  constructor(private readonly awsDynamodbService: AwsDynamodbService) {
    this.entityManager = this.awsDynamodbService.getEntityManager(REQUESTS);
  }

  async create({ latitude, email, longitude, targetDate }: CreateRequestDto): Promise<WeatherRequestEntity> {
    try {
      const id = WeatherRequestEntity.buildRequestId(email, { longitude, latitude });
      const entity = await this.entityManager.create(new WeatherRequestEntity({ id, targetDate }));

      return await this.entityManager.update(
        WeatherRequestEntity,
        { id, targetDate },
        {
          email,
          status: RequestStatus.DONE,
          nextTime: dayjs().add(0.5, 'hours').unix(),
          payload: { latitude, longitude },
          expireAt: Math.floor(dayjs(targetDate, WEATHER_DATE_DEFAULT_FORMAT).add(1, 'days').unix()),
        },
      );
    } catch (err) {
      this.logger.error(err.stack);
      throw new HttpException(
        'Error during request creation',
        err.$metadata?.httpStatusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: err },
      );
    }
  }

  delete(id: string): Promise<{ success: boolean }> {
    return this.entityManager.delete(WeatherRequestEntity, { id });
  }
}
