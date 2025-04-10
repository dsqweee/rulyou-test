import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

interface UserFilter {
  full_name?: string;
  role?: string;
  efficiency?: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.userRepository.existsBy({
      full_name: createUserDto.full_name,
    });
    if (isExist) {
      throw new BadRequestException('User already exists');
    }

    const user: User = this.userRepository.create({
      full_name: createUserDto.full_name,
      role: createUserDto.role,
      efficiency: createUserDto.efficiency,
    });

    const savedUser = await this.userRepository.save(user);
    return { id: savedUser.id };
  }

  async findQueryOrAll(filter?: UserFilter): Promise<User[]> {
    const where: FindOptionsWhere<User> = {};

    if (filter?.full_name) {
      where.full_name = Like(`%${filter.full_name}%`);
    }
    if (filter?.role) {
      where.role = filter.role;
    }
    if (filter?.efficiency && isNaN(Number(filter.efficiency))) {
      where.efficiency = Number(filter.efficiency);
    }

    return this.userRepository.find({ where });
  }

  async findOne(id: number) {
    const findUser = await this.userRepository.findOneBy({ id: id });
    if (!findUser) {
      throw new BadRequestException('User not found');
    }
    return findUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }

    if (updateUserDto.efficiency) {
      user.efficiency = updateUserDto.efficiency;
    }

    if (updateUserDto.full_name) {
      user.full_name = updateUserDto.full_name;
    }

    await this.userRepository.save(user);
    return { user };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.userRepository.delete(user);

    return { user: user };
  }

  async removeAll() {
    const users = await this.userRepository.find();
    if (!users.length) {
      throw new BadRequestException('Users not found');
    }
    await this.userRepository.remove(users);
  }
}
