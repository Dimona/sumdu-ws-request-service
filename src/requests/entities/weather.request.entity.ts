import { TRequest, TWeatherPayload } from '@requests/types/request.types';
import { RequestType } from '@requests/enums/request.enums';
import { AwsDynamodbEntity } from '@aws/services/dynamodb/entities/aws.dynamodb.entity';
import { Attribute, AUTO_GENERATE_ATTRIBUTE_STRATEGY, AutoGenerateAttribute, Entity } from '@typedorm/common';
import { default as crypto } from 'crypto';

@Entity({
  name: `${process.env.MOCK_DYNAMODB_ENDPOINT ? 'ws-requests-test' : process.env.WS_REQUESTS_DYNAMODB_TABLE}`,
  primaryKey: {
    partitionKey: 'requestId',
  },
})
export class WeatherRequestEntity extends AwsDynamodbEntity<TRequest<TWeatherPayload>> {
  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.UUID4,
  })
  requestId: string;

  @Attribute()
  type?: RequestType;

  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
    autoUpdate: false, // this will make this attribute and any indexes referencing it auto update for any write operation
  })
  createdAt?: number;

  @Attribute()
  payload: TWeatherPayload;

  static buildRequestId({ latitude, longitude }: { latitude: number; longitude: number }): string {
    return crypto.createHash('shake256', { outputLength: 10 }).update(`${latitude}|${longitude}`).digest('hex')
  }
}
