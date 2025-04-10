import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { IsNotWhitespace } from '../../decorator/is-not-whitespace.decorator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotWhitespace()
  @IsNotEmpty()
  @Length(3, 32)
  @IsDefined()
  @IsString()
  @Matches(/^[a-zA-Zа-яА-ЯёЁ\s\-']+$/)
  full_name: string;

  @IsNotWhitespace()
  @IsNotEmpty()
  @Length(3, 32)
  @IsDefined()
  @IsString()
  @Matches(/^[a-zA-Zа-яА-ЯёЁ\s\-']+$/)
  role: string;
}
