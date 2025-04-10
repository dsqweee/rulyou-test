import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.userService.create(createUserDto);
      return {
        success: true,
        result: result,
      };
    } catch (error: unknown) {
      return {
        success: false,
        result: error,
      };
    }
  }

  @Get(['get', 'get/:id'])
  async getUsers(
    @Param('id') id?: string,
    @Query()
    query?: {
      full_name?: string;
      role?: string;
      efficiency?: number;
    },
  ) {
    try {
      if (id) {
        const user = await this.userService.findOne(+id);
        if (!user) {
          throw new BadRequestException('User not found');
        }
        return {
          success: true,
          result: {
            users: [user],
          },
        };
      } else {
        const users = await this.userService.findQueryOrAll(query);
        return {
          success: true,
          result: {
            users,
          },
        };
      }
    } catch (error: unknown) {
      throw new BadRequestException({
        success: false,
        result: error,
      });
    }
  }

  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await this.userService.update(+id, updateUserDto);
      return {
        success: true,
        result: result,
      };
    } catch (error: unknown) {
      return {
        success: false,
        result: error,
      };
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: number) {
    try {
      const result = await this.userService.remove(+id);
      return {
        success: true,
        result: result,
      };
    } catch (error: unknown) {
      return {
        success: false,
        result: error,
      };
    }
  }

  @Delete('delete')
  async removeAll() {
    try {
      const result = await this.userService.removeAll();
      return {
        success: true,
        result: result,
      };
    } catch (error: unknown) {
      return {
        success: false,
        result: error,
      };
    }
  }
}
