import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from '@requests/dto/create.request.dto';
import { WeatherRequestEntity } from '@requests/entities/weather.request.entity';
import { RequestType } from '@requests/enums/request.enums';
import { AwsDynamodbService } from '@aws/services/dynamodb/services/aws.dynamodb.service';
import { REQUESTS } from '@requests/constants/request.constants';

@Injectable()
export class RequestService {
  constructor(private readonly awsDynamodbService: AwsDynamodbService) {}

  async create({ latitude, email, longitude }: CreateRequestDto): Promise<WeatherRequestEntity> {
    return this.awsDynamodbService.getEntityManager(REQUESTS).create(
      new WeatherRequestEntity({
        requestId: WeatherRequestEntity.buildRequestId({ longitude, latitude }),
        email,
        type: RequestType.WEATHER,
        // createdAt: Utils.getCurrentTimestamp(),
        payload: { latitude, longitude },
      }),
    );
  }

  delete(id: string): Promise<{ success: boolean }> {
    console.log(id);
    return this.awsDynamodbService.getEntityManager(REQUESTS).delete(WeatherRequestEntity, { requestId: id });
  }
}
