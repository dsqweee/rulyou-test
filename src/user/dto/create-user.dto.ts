import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { IsNotWhitespace } from '../../decorator/is-not-whitespace.decorator';

export class CreateUserDto {
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

  @Min(0)
  @Max(100)
  @IsInt()
  @IsDefined()
  efficiency: number;
}
