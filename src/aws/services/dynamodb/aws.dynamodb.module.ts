import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AwsDynamodbService } from '@aws/services/dynamodb/services/aws.dynamodb.service';
import { AWS_DYNAMODB_CONFIG_OPTIONS } from '@aws/services/dynamodb/constants/aws.dynamodb.constants';
import { AwsModule } from '@aws/aws.module';
import {
  AwsDynamodbAsyncModuleOptions,
  AwsDynamodbModuleOptions,
} from '@aws/services/dynamodb/types/aws.dynamodb.types';

@Module({
  imports: [AwsModule],
})
export class AwsDynamodbModule {
  public static register(options: AwsDynamodbModuleOptions): DynamicModule {
    return {
      module: AwsDynamodbModule,
      providers: [
        {
          provide: AWS_DYNAMODB_CONFIG_OPTIONS,
          useValue: options,
        },
        AwsDynamodbService,
      ],
      exports: [AwsDynamodbService],
    };
  }

  public static registerAsync(options: AwsDynamodbAsyncModuleOptions): DynamicModule {
    return {
      module: AwsDynamodbModule,
      imports: options.imports ?? [],
      providers: [
        {
          provide: AWS_DYNAMODB_CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        AwsDynamodbService,
      ],
      exports: [AwsDynamodbService],
    };
  }
}
