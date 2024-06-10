import {
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/modules/auth/jwt/jwt.guard';
import { BaseController } from '@api/modules/base.controller';
import { UserDTOFactory, UserListResponse, UserResponse } from '@api/modules/user/dto/user.dto';
import { Paging } from '@api/nestjs/decorators/paging.decorator';
import { CurrentUser } from '@api/nestjs/decorators/user.decorator';
import { PagingValidationPipe } from '@api/nestjs/pipes/paging-params';
import { PagingParams } from '@api/paging/paging-params';
import { User } from '@domain/entities/user.entity';
import { UserService } from '@domain/services/user.service';

@ApiTags('users')
@Controller('users')
export class UserController extends BaseController {
    constructor(
        private readonly userService: UserService,
    ) {
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
        const user = await this.userService.findOneByUid(id);

        return UserDTOFactory.fromEntity(user);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 200, description: 'Deleted user' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    public async destroy(@CurrentUser() user: User): Promise<UserResponse> {
        const deleted = await this.userService.remove(user);

        return UserDTOFactory.fromEntity(deleted);
    }
}
