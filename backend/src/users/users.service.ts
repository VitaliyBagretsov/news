import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashPassword } from './utils';
import { NotFoundException } from '@exceptions/not-found.exception';
import { UserExistException } from '@exceptions/user-exist.exception';
import { EmailUsedException } from '@exceptions/email-used.exception';
import { News } from '@news/entities/news.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkUserData(createUserDto);

    return hashPassword(createUserDto.password).then((password) => {
      return this.entityManager
        .insert(User, { ...createUserDto, password })
        .then((res) => {
          return {
            ...res.identifiers[0],
            ...createUserDto,
          } as User;
        });
    });
  }

  findOne(id: string) {
    return this.entityManager.findOneBy(User, { id }).then((res) => {
      if (!res) throw new NotFoundException(id);
      return res;
    });
  }

  findBy(search: Record<string, unknown>) {
    return this.entityManager.findBy(User, search);
  }

  findByName(name: string) {
    return this.entityManager.findOneBy(User, {name});
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.checkUserData(updateUserDto);

    return this.findOne(id).then(() => {
      if (updateUserDto.password)
        return hashPassword(updateUserDto.password).then((password) => {
          return this.entityManager.update(User, id, {
            ...updateUserDto,
            password,
          });
        });

      return this.entityManager.update(User, id, updateUserDto);
    });
  }

  remove(id: string) {
    return this.findOne(id).then((res) => {
      return this.entityManager.remove(User, [res]);
    });
  }

  async checkUserData(user: CreateUserDto | UpdateUserDto) {
    const { name, email } = user;
    if (name && (await this.findBy({ name })).length)
      throw new UserExistException(name);
    if (email && (await this.findBy({ email })).length)
      throw new EmailUsedException(email);
  }
}
