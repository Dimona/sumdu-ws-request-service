import { IsDateString, IsEmail, IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { WEATHER_DATE_DEFAULT_FORMAT, WeatherDate } from '@requests/validators/weather-date.validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @IsLatitude()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @IsLongitude()
  longitude: number;

  @IsNotEmpty()
  @WeatherDate(WEATHER_DATE_DEFAULT_FORMAT)
  targetDate: string;
}
