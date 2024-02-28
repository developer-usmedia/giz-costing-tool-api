import { Body, Controller, HttpCode, Post, Request, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseController } from '@api/base.controller';
import { UserDTOFactory, UserResponse } from '@api/user/dto/user.dto';
import { AuthService } from '@domain/services/auth.service';
import { UserService } from '@domain/services/user.service';
import { Response } from 'express';
import { ForgotPasswordForm } from '../dto/forgot-password.dto';
import { PasswordResetForm } from '../dto/password-reset-form.dto';
import { RegisterForm } from '../dto/register-form.dto';
import { LoginAuthGuard } from '../local/login.guard';
import { ForgotPasswordResponse } from '../types/forgot-password-response';

@ApiTags('auth')
@Controller('auth')
export class AuthController extends BaseController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
        super();
    }

    @Post('/register')
    @ApiOperation({ summary: 'Register as a new user' })
    @ApiResponse({ status: 201, description: 'User registered' })
    @ApiResponse({ status: 400, description: 'User already registered' })
    @UsePipes(ValidationPipe)
    public async register(@Body() registerForm: RegisterForm): Promise<UserResponse> {
        const existingUser = await this.userService.findOne({ email: registerForm.email });
        if (existingUser) return this.clientError('User already registered');

        const user = await this.authService.register(registerForm.email, registerForm.password);

        return UserDTOFactory.fromEntity(user);
    }

    @Post('/login')
    @ApiOperation({ summary: 'Login using user credentials' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 200, description: 'Successfull login' })
    @UsePipes(ValidationPipe)
    @UseGuards(LoginAuthGuard)
    public login(@Res() res: Response): Response<{ success: boolean }> {
        return this.ok(res, { success: true });
    }

    @Post('/logout')
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Successfull logout' })
    public logout(@Request() req, @Res() res: Response): Response<{ success: boolean }> {
        req.session.destroy();
        return this.ok(res, { success: true });
    }

    @Post('/forgot-password')
    @HttpCode(200)
    @ApiOperation({ summary: 'Start a password reset for a user' })
    @ApiResponse({ status: 201, description: 'Password reset started' })
    @ApiResponse({ status: 400, description: 'Password reset failed' })
    @UsePipes(ValidationPipe)
    public async forgotPassword(@Body() { email }: ForgotPasswordForm): Promise<ForgotPasswordResponse> {
        // TODO: rate limit this endpoint
        const user = await this.userService.findOne({ email });
        if (!user) this.clientError('Forgot password failed');

        return { resetEmailSent: await this.authService.startPasswordReset(user) };
    }

    @Post('/reset-password')
    @HttpCode(200)
    @ApiOperation({ summary: 'Reset a users password' })
    @ApiResponse({ status: 201, description: 'Password reset successful' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token or user not found' })
    @UsePipes(ValidationPipe)
    public async resetPassword(@Body() resetPasswordForm: PasswordResetForm): Promise<UserResponse> {
        const { email, newPassword, resetToken } = resetPasswordForm;

        const user = await this.userService.findOne({ email: email });
        if (!user) return this.clientError('Password reset failed');

        const saved = await this.authService.resetPassword(user, resetToken, newPassword);
        if (!saved) return this.clientError('Invalid or expired token');

        return UserDTOFactory.fromEntity(saved);
    }
}
