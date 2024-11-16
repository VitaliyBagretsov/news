import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsArray, IsOptional, IsNumber, Min } from 'class-validator';
import { FindOptionsOrder } from 'typeorm';

type fullPrimitiveTypes = string | string[] | number | number [] | boolean | boolean[]

export class QueryDto<Entity = any> {
  @ApiProperty({
    description: 'Список запрашиваемых полей',
    type: String,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  readonly columns?: (keyof Entity)[];

  @ApiProperty({ description: 'Фильтр', required: false })
  @Allow()
  // readonly filter?: Partial<Entity>;
  readonly filter?: Partial<Record<keyof Entity, fullPrimitiveTypes>>;

  @ApiProperty({
    description: 'Фильтр частичного соответствия',
    required: false,
  })
  @Allow()
  readonly search?: Partial<Entity>;

  @ApiProperty({ description: 'Фильтр диапазона', required: false })
  @Allow()
  readonly between?: Entity;

  @ApiProperty({ description: 'Фильтр по нескольким полям', required: false })
  @Allow()
  readonly searchBy?: string;

  @ApiProperty({ description: 'Сортировка', required: false })
  @Allow()
  readonly sort?: FindOptionsOrder<Entity>;

  @ApiProperty({
    description: 'Количество элементов на странице',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Смещение количества элементов при выборке',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  offset?: number;

  @ApiProperty({ description: 'Номер страницы', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;
}
