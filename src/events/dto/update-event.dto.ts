import { IsOptional, IsString, IsDate, IsInt, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Type(() => Date) 
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  ticketCapacity?: number;

  @IsArray()
  invitees: string[]; 

  @IsString()
  location: string; 
}
