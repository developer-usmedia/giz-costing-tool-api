import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/auth/jwt/jwt.guard';
import { BaseController } from '@api/base.controller';
import { Paging } from '@common/decorators/paging.decorator';
import { PagingParams } from '@common/paging/paging-params';
import { PagingValidationPipe } from '@common/pipes/paging-params';
import { User } from '@database/entities/user.entity';
import { UserService } from '@domain/services/user.service';
import { UpdateUserDTO } from '../dto/update-user.form';
import { UserDTOFactory, UserListResponse, UserResponse } from '../dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UserController extends BaseController {
    constructor(private readonly userService: UserService) {
        super();
    }

    @Get('/')
    @ApiOperation({ summary: 'Get a paginated list of users' })
    @ApiResponse({ status: 200, description: 'Paged list of users' })
    @UseGuards(JwtAuthGuard)
    public async index(@Paging('User', PagingValidationPipe) paging: PagingParams<User>): Promise<UserListResponse> {
        const [users, count] = await this.userService.findManyPaged(paging);

        return UserDTOFactory.fromCollection(users, count, paging);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a single user' })
    @ApiResponse({ status: 200, description: 'The requested user' })
    @ApiResponse({ status: 404, description: 'The user cannot be found' })
    @UseGuards(JwtAuthGuard)
    public async findBy(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponse> {
        const user = await this.userService.findOne({ id });
        if (!user) return this.notFound('User not found');

        return UserDTOFactory.fromEntity(user);
    }

    @Put('/:id')
    @HttpCode(201)
    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully updated' })
    @ApiResponse({ status: 404, description: 'The user cannot be found' })
    @UsePipes(ValidationPipe)
    @UseGuards(JwtAuthGuard)
    public async patch(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserForm: UpdateUserDTO): Promise<UserResponse> {
        const user = await this.userService.findOne({ id });
        if (!user) return this.notFound('User not found');

        const updatedUser = UpdateUserDTO.toEntity(user, updateUserForm);
        const savedUser = await this.userService.persist(updatedUser);

        return UserDTOFactory.fromEntity(savedUser);
    }
}
