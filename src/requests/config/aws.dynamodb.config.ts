import { registerAs } from '@nestjs/config';
import { AWS_DYNAMODB_CONFIG } from '@requests/types/aws.dynamodb.types';
import { WeatherRequestEntity } from '@requests/entities/weather.request.entity';
import { Table } from '@typedorm/common';
import { REQUESTS } from '@requests/constants/request.constants';
import { AWS_DYNAMODB_API_VERSION, AwsDynamodbModuleOptions } from '@workshop/lib-nest-aws/dist/services/dynamodb';

export const awsDynamodbConfig = registerAs(AWS_DYNAMODB_CONFIG, () => {
  const env = process.env.ENVIRONMENT;

  return <AwsDynamodbModuleOptions>{
    client: {
      apiVersion: process.env.AWS_DYNAMODB_API_VERSION || AWS_DYNAMODB_API_VERSION,
      endpoint: env === 'local' ? process.env.DYNAMODB_LOCAL : undefined,
      retryMode: 'standard'
    },
    connections: {
      [REQUESTS]: {
        table: new Table({
          name: `${process.env.MOCK_DYNAMODB_ENDPOINT ? 'ws-requests-test' : process.env.WS_REQUESTS_DYNAMODB_TABLE}`,
          partitionKey: 'id',
        }),
        entities: [WeatherRequestEntity],
      },
    },
  };
});
