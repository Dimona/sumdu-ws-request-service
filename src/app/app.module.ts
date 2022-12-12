import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RequestModule } from '@requests/request.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RequestModule],
})
export class AppModule {}
