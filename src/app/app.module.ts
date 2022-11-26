import { Module } from '@nestjs/common';
import { RequestModule } from '@requests/request.module';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from '@aws/aws.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AwsModule, RequestModule],
})
export class AppModule {}
