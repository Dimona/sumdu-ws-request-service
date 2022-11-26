import { IsEmail, IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
}
