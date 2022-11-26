import { Module } from '@nestjs/common';
import { RequestController } from '@requests/controllers/request.controller';
import { RequestService } from '@requests/services/request.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AWS_DYNAMODB_CONFIG } from '@requests/types/aws.dynamodb.types';
import { awsDynamodbConfig } from '@requests/config/aws.dynamodb.config';
import { AwsDynamodbModule, AwsDynamodbModuleOptions } from '@workshop/lib-nest-aws/dist/services/dynamodb';

@Module({
  imports: [
    ConfigModule.forFeature(awsDynamodbConfig),
    AwsDynamodbModule.registerAsync({
      useFactory(configService: ConfigService) {
        return configService.get<AwsDynamodbModuleOptions>(AWS_DYNAMODB_CONFIG);
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
