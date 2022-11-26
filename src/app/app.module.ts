import { Module } from '@nestjs/common';
import { RequestModule } from '@requests/request.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RequestModule],
})
export class AppModule {}
