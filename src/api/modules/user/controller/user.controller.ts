import {
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GlobalGuard } from '@api/modules/auth/login/global.guard';
import { BaseController } from '@api/modules/base.controller';
import { UserDTOFactory, UserListResponse, UserResponse } from '@api/modules/user/dto/user.dto';
import { Paging } from '@api/nestjs/decorators/paging.decorator';
import { User as UserDecorator } from '@api/nestjs/decorators/user.decorator';
import { PagingValidationPipe } from '@api/nestjs/pipes/paging-params';
import { PagingParams } from '@api/paging/paging-params';
import { User } from '@domain/entities/user.entity';
import { AuthService } from '@domain/services/auth.service';
import { UserService } from '@domain/services/user.service';

@ApiTags('users')
@Controller('users')
export class UserController extends BaseController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {
        super();
    }

    @Get('/')
    @ApiOperation({ summary: 'Get a paginated list of users' })
    @ApiResponse({ status: 200, description: 'Paged list of users' })
    @UseGuards(GlobalGuard)
    public async index(@Paging('User', PagingValidationPipe) paging: PagingParams<User>): Promise<UserListResponse> {
        const [users, count] = await this.userService.findManyPaged(paging);

        return UserDTOFactory.fromCollection(users, count, paging);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a single user' })
    @ApiResponse({ status: 200, description: 'The requested user' })
    @ApiResponse({ status: 404, description: 'The user cannot be found' })
    @UseGuards(GlobalGuard)
    public async findBy(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponse> {
        const user = await this.userService.findOneByUid(id);

        return UserDTOFactory.fromEntity(user);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 200, description: 'Deleted user' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @UseGuards(GlobalGuard)
    @UsePipes(ValidationPipe)
    public async destroy(
        @Param('id', ParseUUIDPipe) id: string,
        @Req() req,
        @UserDecorator() sessionUser: { id: string },
    ): Promise<UserResponse> {
        const user = await this.userService.findOneByUid(id);
        const deleted = await this.userService.remove(user);

        if (sessionUser.id === user.id) {
            req.session.destroy();
        }

        return UserDTOFactory.fromEntity(deleted);
    }
}
