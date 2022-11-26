import { registerAs } from '@nestjs/config';
import { AWS_DYNAMODB_CONFIG } from '@requests/types/aws.dynamodb.types';
import { AwsDynamodbModuleOptions } from '@aws/services/dynamodb/types/aws.dynamodb.types';
import { AWS_DYNAMODB_API_VERSION } from '@aws/constants/aws.constants';
import { WeatherRequestEntity } from '@requests/entities/weather.request.entity';
import { Table } from '@typedorm/common';
import { REQUESTS } from '@requests/constants/request.constants';

export const awsDynamodbConfig = registerAs(AWS_DYNAMODB_CONFIG, () => {
  const env = process.env.ENVIRONMENT;

  return <AwsDynamodbModuleOptions>{
    client: {
      apiVersion: process.env.AWS_DYNAMODB_API_VERSION || AWS_DYNAMODB_API_VERSION,
      endpoint: env === 'local' ? process.env.DYNAMODB_LOCAL : undefined,
    },
    connections: {
      [REQUESTS]: {
        table: new Table({
          name: `${process.env.MOCK_DYNAMODB_ENDPOINT ? 'ws-requests-test' : process.env.WS_REQUESTS_DYNAMODB_TABLE}`,
          partitionKey: 'requestId',
        }),
        entities: [WeatherRequestEntity],
      },
    },
  };
});
