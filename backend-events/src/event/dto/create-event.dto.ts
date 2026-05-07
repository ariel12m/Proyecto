import { IsNotEmpty, IsOptional, IsISO8601, IsString, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsISO8601()
  @IsOptional()
  date?: string;

  @IsNumber()
  @IsOptional()
  userId?: number;
}
