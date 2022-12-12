import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateWeatherRequestDto } from '@requests/dto/create.weather-request.dto';
import { RequestService } from '@requests/services/request.service';
import { WeatherRequestEntity } from '@workshop/lib-nest-weather-request';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: CreateWeatherRequestDto): Promise<WeatherRequestEntity> {
    return this.requestService.create(body);
  }

  @Delete(':requestId')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('requestId') requestId: string): Promise<{ success: boolean }> {
    const [id, targetDate] = requestId.split('_');
    const result = await this.requestService.delete(id, targetDate);

    if (!result.success) {
      throw new InternalServerErrorException('Unknown error');
    }

    return result;
  }
}
