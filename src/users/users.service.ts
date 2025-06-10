import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    return this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    const userFromCache = await this.getCacheUserDetails(id);
    if (userFromCache) {
      console.log({ 'user from cache': userFromCache });
      return userFromCache;
    }
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      return null;
    }
    await this.cacheUserDetails(user);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      return null;
    }

    Object.assign(user, updateUserDto);
    const newUser = await this.userRepository.save(user);
    await this.cacheUserDetails(newUser);
    return newUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async cacheUserDetails(user: UserEntity) {
    await this.cacheManager.set(`users-${user.id}`, user);
  }

  async getCacheUserDetails(id: number): Promise<UserEntity | null> {
    return await this.cacheManager.get(`users-${id}`);
  }

  async deleteCacheUserDetails(id: number) {
    await this.cacheManager.del(`users-${id}`);
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne({
      where: {
        username,
      },
    });
  }
}
