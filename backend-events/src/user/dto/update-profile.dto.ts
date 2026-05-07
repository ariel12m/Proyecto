import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  jobPosition?: string;

  @IsOptional()
  @IsString()
  photo?: string;
}