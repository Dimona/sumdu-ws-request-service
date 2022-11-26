import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb/dist-types/DynamoDBClient';
import { ConnectionOptions } from '@typedorm/core';
import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export type TDynamodbEntity = Record<string, any>;

export type AwsDynamodbModuleOptions = {
  client?: DynamoDBClientConfig;
  connections: Record<string, Omit<ConnectionOptions, 'documentClient' | 'name'>>;
};

export type AwsDynamodbAsyncModuleOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<AwsDynamodbModuleOptions>, 'useFactory' | 'inject'>;
