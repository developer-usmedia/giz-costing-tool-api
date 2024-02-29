import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Req,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthGuard } from '@api/auth/local/auth.guard';
import { BaseController } from '@api/base.controller';
import { Paging } from '@common/decorators/paging.decorator';
import { PagingParams } from '@common/paging/paging-params';
import { PagingValidationPipe } from '@common/pipes/paging-params';
import { User } from '@database/entities/user.entity';
import { AuthService, UserService } from '@domain/services';
import { UpdateUserDTO } from '../dto/update-user.form';
import { UserDTOFactory, UserListResponse, UserResponse } from '../dto/user.dto';

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
    @UseGuards(AuthGuard)
    public async index(@Paging('User', PagingValidationPipe) paging: PagingParams<User>): Promise<UserListResponse> {
        const [users, count] = await this.userService.findManyPaged(paging);

        return UserDTOFactory.fromCollection(users, count, paging);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a single user' })
    @ApiResponse({ status: 200, description: 'The requested user' })
    @ApiResponse({ status: 404, description: 'The user cannot be found' })
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    public async patch(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserForm: UpdateUserDTO): Promise<UserResponse> {
        const user = await this.userService.findOne({ id });
        if (!user) return this.notFound('User not found');

        const updatedUser = UpdateUserDTO.toEntity(user, updateUserForm);
        const savedUser = await this.userService.persist(updatedUser);

        return UserDTOFactory.fromEntity(savedUser);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 200, description: 'Deleted user' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    public async destroy(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponse> {
        const user = await this.userService.findOneByUid(id);
        if (!user) this.notFound('User not found');

        const deleted = await this.userService.remove(user);

        return UserDTOFactory.fromEntity(deleted);
    }

    @Post('/verify-email')
    @ApiOperation({ summary: 'Send the user an email with a verification code' })
    @ApiResponse({ status: 200, description: 'The email has been successfully sent' })
    @ApiResponse({ status: 400, description: 'Email already verified for user' })
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    public async sendEmailVerification(@Req() req, @Res() res: Response): Promise<{ success: boolean }> {
        if (req.user.emailVerfied) this.clientError('User email already verified');

        const user = await this.userService.findOne({ id: req.user.id });
        const sent = await this.authService.sendVerificationEmail(user);

        return this.ok(res, { success: sent });
    }

    @Post('/verify-email/:code')
    @ApiOperation({ summary: 'Verify the code from the verification email' })
    @ApiResponse({ status: 200, description: 'The code has been successfully verified' })
    @ApiResponse({ status: 400, description: 'Email already verified for user' })
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    public async verifyEmail(@Param('code') code: string, @Req() req, @Res() res: Response): Promise<{ success: boolean }> {
        if (req.user.emailVerfied) this.clientError('User email already verified');

        const user = await this.userService.findOneByUid(req.user.id as string);
        const verified = await this.authService.verifyEmailCode(user, code);

        return this.ok(res, { success: verified });
    }
}
