import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CreateRequestDto } from '@requests/dto/create.request.dto';
import { WeatherRequestEntity } from '@requests/entities/weather.request.entity';
import { REQUESTS } from '@requests/constants/request.constants';
import { AwsDynamodbService } from '@workshop/lib-nest-aws/dist/services/dynamodb';

@Injectable()
export class RequestService {
  private readonly logger = new Logger(RequestService.name);

  constructor(private readonly awsDynamodbService: AwsDynamodbService) {}

  async create({ latitude, email, longitude }: CreateRequestDto): Promise<WeatherRequestEntity> {
    try {
      return await this.awsDynamodbService.getEntityManager(REQUESTS).create(
        new WeatherRequestEntity({
          id: WeatherRequestEntity.buildRequestId({ longitude, latitude }),
          email,
          payload: { latitude, longitude },
        }),
      );
    } catch (err) {
      this.logger.error(err.stack);
      throw new HttpException('Error during request creation', err.$metadata.httpStatusCode, { cause: err });
    }
  }

  delete(id: string): Promise<{ success: boolean }> {
    return this.awsDynamodbService.getEntityManager(REQUESTS).delete(WeatherRequestEntity, { id });
  }
}
