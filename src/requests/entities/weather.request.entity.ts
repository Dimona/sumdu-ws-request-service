import { TRequest, TWeatherPayload } from '@requests/types/request.types';
import { RequestStatus } from '@requests/enums/request.enums';
import { Attribute, AUTO_GENERATE_ATTRIBUTE_STRATEGY, AutoGenerateAttribute, Entity } from '@typedorm/common';
import { default as crypto } from 'crypto';
import { AwsDynamodbEntity } from '@workshop/lib-nest-aws/dist/services/dynamodb';

@Entity({
  name: 'WeatherRequest',
  primaryKey: {
    partitionKey: '{{id}}',
    sortKey: '{{targetDate}}',
  },
})
export class WeatherRequestEntity extends AwsDynamodbEntity<TRequest<TWeatherPayload>> {
  @Attribute({ unique: true })
  id: string;

  @Attribute()
  targetDate: string;

  @Attribute()
  email: string;

  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
    autoUpdate: false, // this will make this attribute and any indexes referencing it auto update for any write operation
  })
  createdAt?: number;

  @AutoGenerateAttribute({
    strategy: AUTO_GENERATE_ATTRIBUTE_STRATEGY.EPOCH_DATE,
    autoUpdate: true, // this will make this attribute and any indexes referencing it auto update for any write operation
  })
  updatedAt?: number;

  @Attribute({ isEnum: true })
  status: RequestStatus;

  @Attribute()
  expireAt?: number;

  @Attribute()
  payload: TWeatherPayload;

  @Attribute()
  nextTime: number;

  static buildRequestId(email: string, { latitude, longitude }: { latitude: number; longitude: number }): string {
    return crypto
      .createHash('shake256', { outputLength: 10 })
      .update(`${email}|${latitude}|${longitude}`)
      .digest('hex');
  }
}
