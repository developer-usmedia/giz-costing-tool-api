import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { Paging } from '@common/decorators/paging.decorator';
import { PagingParams } from '@common/paging/paging-params';
import { PagingValidationPipe } from '@common/pipes/paging-params';
import { User } from '@database/entities/user.entity';
import { UserService } from '@domain/services/user.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.form';
import { UserDTO, UserDTOFactory, UserListDTO } from '../dto/user.dto';

@Controller({ path: 'users' })
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get('/')
    public async index(@Paging('User', PagingValidationPipe) paging: PagingParams<User>): Promise<UserListDTO> {
        const [users, count] = await this.userService.findManyPaged(paging);

        return UserDTOFactory.fromCollection(users, count, paging);
    }

    @Get('/:id')
    @ApiResponse({ status: 404, description: 'User not found' })
    public async findBy(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.userService.findOne({ id });
        if (!user) throw new NotFoundException();

        return UserDTOFactory.fromEntity(user);
    }

    @Post('/')
    @UsePipes(ValidationPipe)
    @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
    public async create(@Body() createUserForm: CreateUserDTO): Promise<{ data: UserDTO }> {
        const newUser = CreateUserDTO.toEntity(new User(), createUserForm);

        await this.userService.persist(newUser);

        return UserDTOFactory.fromEntity(newUser);
    }

    @Put('/:id')
    @UsePipes(ValidationPipe)
    @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
    @ApiResponse({ status: 404, description: 'Record not found.' })
    public async patch(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserForm: UpdateUserDTO): Promise<{ data: UserDTO }> {
        const user = await this.userService.findOne({ id });
        if (!user) throw new NotFoundException();

        const updatedUser = UpdateUserDTO.toEntity(user, updateUserForm);
        const savedUser = await this.userService.persist(updatedUser);

        return UserDTOFactory.fromEntity(savedUser);
    }
}
