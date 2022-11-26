import {Body, Controller, Delete, Param, Post} from '@nestjs/common';
import { RequestService } from '@requests/services/request.service';
import { CreateRequestDto } from '@requests/dto/create.request.dto';
import { WeatherRequestEntity } from '@requests/entities/weather.request.entity';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  async create(@Body() body: CreateRequestDto): Promise<WeatherRequestEntity> {
    return this.requestService.create(body);
  }

  @Delete(':requestId')
  async delete(@Param('requestId') requestId: string): Promise<{ success: boolean }> {
    return this.requestService.delete(requestId);
  }
}
