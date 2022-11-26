import { Module } from '@nestjs/common';
import { AwsUtils } from './utils/aws.utils';
import { ConfigModule } from '@nestjs/config';
import { awsConfig } from '@aws/config/aws.config';

@Module({
  imports: [ConfigModule.forFeature(awsConfig)],
})
export class AwsModule {
  constructor() {
    AwsUtils.setRegion();
  }
}
