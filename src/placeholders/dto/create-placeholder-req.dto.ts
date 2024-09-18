import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class Fences {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fenceType: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  noOfUnits: number;
}

export class GeoPoint {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}

export class CreatePlaceholderReqDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endDate: Date | string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  projectType: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  workType: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  driver?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startDate: Date | string;

  @ApiProperty({ type: [Fences] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Fences)
  fences: Fences[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  branch: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string | null;

  @ApiProperty({ type: GeoPoint })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GeoPoint)
  geoPoint: GeoPoint;
}