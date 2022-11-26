import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from '@requests/dto/create.request.dto';
import { WeatherRequestEntity } from '@requests/entities/weather.request.entity';
import { REQUESTS } from '@requests/constants/request.constants';
import { AwsDynamodbService } from '@workshop/lib-nest-aws/dist/services/dynamodb';

@Injectable()
export class RequestService {
  constructor(private readonly awsDynamodbService: AwsDynamodbService) {}

  async create({ latitude, email, longitude }: CreateRequestDto): Promise<WeatherRequestEntity> {
    console.log('skaljfsdlkfjklds', WeatherRequestEntity.buildRequestId({ longitude, latitude }));
    try {
      return await this.awsDynamodbService.getEntityManager(REQUESTS).create(
        new WeatherRequestEntity({
          id: WeatherRequestEntity.buildRequestId({ longitude, latitude }),
          email,
          // createdAt: Utils.getCurrentTimestamp(),
          payload: { latitude, longitude },
        }),
      );
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  delete(id: string): Promise<{ success: boolean }> {
    console.log(id);
    return this.awsDynamodbService.getEntityManager(REQUESTS).delete(WeatherRequestEntity, { id });
  }
}
