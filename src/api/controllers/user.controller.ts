import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/auth/jwt/jwt.guard';
import { BaseController } from '@api/controllers/base.controller';
import { UserDTOFactory, UserListResponse, UserResponse } from '@api/dto/user.dto';
import { PagingParams } from '@api/paging/paging-params';
import { PagingValidationPipe } from '@api/paging/paging-params.pipe';
import { Paging } from '@api/paging/paging.decorator';
import { User } from '@domain/entities';
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
}
