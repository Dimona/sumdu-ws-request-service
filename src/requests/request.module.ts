import { Module } from '@nestjs/common';
import { RequestService } from '@requests/services/request.service';
import { RequestController } from '@requests/controllers/request.controller';
import { WeatherRequestModule } from '@workshop/lib-nest-weather-request';

@Module({
  imports: [WeatherRequestModule],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
