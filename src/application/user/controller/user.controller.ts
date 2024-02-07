import { EntityManager } from '@mikro-orm/postgresql';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { User } from 'database/entities/user.entity';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.form';
import { UserDTOFactory } from '../dto/user.dto';

@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly em: EntityManager) {}

  @Get('/')
  public async index() {
    const users = await this.em.findAll(User);

    return UserDTOFactory.fromCollection(users);
  }

  @Get('/:id')
  public async findBy(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.em.findOne(User, { id });
    if (!user) throw new NotFoundException();

    return UserDTOFactory.fromEntity(user);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  public async create(@Body() createUserForm: CreateUserDTO) {
    const newUser = CreateUserDTO.toEntity(new User(), createUserForm);

    await this.em.persistAndFlush(newUser);

    return UserDTOFactory.fromEntity(newUser);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  public async patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserForm: UpdateUserDTO,
  ) {
    const user = await this.em.findOne(User, { id });
    if (!user) throw new NotFoundException();

    const userUpdate = UpdateUserDTO.toEntity(user, updateUserForm);

    // Make sure all qeueued changes are applied before applying new update
    await this.em.flush();
    await this.em.persistAndFlush(userUpdate);
    const updatedUser = await this.em.findOne(User, { id });

    return UserDTOFactory.fromEntity(updatedUser);
  }
}
