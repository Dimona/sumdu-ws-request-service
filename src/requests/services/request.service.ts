import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateRequestDto } from '@requests/dto/create.request.dto';
import { WeatherRequestEntity } from '@requests/entities/weather.request.entity';
import { REQUESTS } from '@requests/constants/request.constants';
import { AwsDynamodbService } from '@workshop/lib-nest-aws/dist/services/dynamodb';
import { RequestStatus } from '@requests/enums/request.enums';
import { EntityManager } from '@typedorm/core';
import dayjs from 'dayjs';

@Injectable()
export class RequestService {
  private readonly logger = new Logger(RequestService.name);

  private readonly entityManager: EntityManager;

  constructor(private readonly awsDynamodbService: AwsDynamodbService) {
    this.entityManager = this.awsDynamodbService.getEntityManager(REQUESTS);
  }

  async create({ latitude, email, longitude, targetDate }: CreateRequestDto): Promise<WeatherRequestEntity> {
    try {
      return await this.entityManager.create(
        new WeatherRequestEntity({
          id: WeatherRequestEntity.buildRequestId(email, { longitude, latitude }),
          email,
          targetDate,
          status: RequestStatus.DONE,
          nextTime: dayjs().add(0.5, 'hours').unix(),
          payload: { latitude, longitude },
          expireAt: Math.floor(dayjs(targetDate).add(1, 'days').unix() / 1000),
        }),
      );
    } catch (err) {
      this.logger.error(err.stack);
      throw new HttpException('Error during request creation', err.$metadata.httpStatusCode, { cause: err });
    }
  }

  delete(id: string): Promise<{ success: boolean }> {
    return this.entityManager.delete(WeatherRequestEntity, { id });
  }
}
