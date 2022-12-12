import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateWeatherRequestDto } from '@requests/dto/create.weather-request.dto';
import { RequestService } from '@requests/services/request.service';
import { WeatherRequestEntity } from '@workshop/lib-nest-weather-request';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  async create(@Body() body: CreateWeatherRequestDto): Promise<WeatherRequestEntity> {
    return this.requestService.create(body);
  }

  @Delete(':requestId')
  async delete(@Param('requestId') requestId: string): Promise<{ success: boolean }> {
    return this.requestService.delete(requestId);
  }
}
