import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserDTOFactory, UserResponse } from '@api/user/dto/user.dto';
import { AuthService } from '@domain/services/auth.service';
import { UserService } from '@domain/services/user.service';
import { ForgotPasswordForm } from '../dto/forgot-password.dto';
import { LoginForm } from '../dto/login-form.dto';
import { PasswordResetForm } from '../dto/password-reset-form.dto';
import { RegisterForm } from '../dto/register-form.dto';
import { ForgotPasswordResponse } from '../types/forgot-password-response';
import { LoginResponse } from '../types/login-response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Post('/register')
    @ApiResponse({ status: 201, description: 'User registrated' })
    @ApiResponse({ status: 400, description: 'User already registered' })
    @UsePipes(ValidationPipe)
    public async register(@Body() registerForm: RegisterForm): Promise<UserResponse> {
        const existingUser = await this.userService.findOne({ email: registerForm.email });
        if (existingUser) {
            throw new BadRequestException('User already registered'); // Security?
        }

        const user = await this.authService.register(registerForm.email, registerForm.password);

        return UserDTOFactory.fromEntity(user);
    }

    @Post('/login')
    @HttpCode(200)
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 200, description: 'Successfull login' })
    @UsePipes(ValidationPipe)
    public async login(@Body() loginForm: LoginForm): Promise<LoginResponse> {
        return this.authService.login(loginForm.email, loginForm.password);
    }

    @Post('/forgot-password')
    @ApiResponse({ status: 201, description: 'Password reset started' })
    @ApiResponse({ status: 400, description: 'Password reset failed' })
    @UsePipes(ValidationPipe)
    public async forgotPassword(@Body() { email }: ForgotPasswordForm): Promise<ForgotPasswordResponse>  {
        const user = await this.userService.findOne({ email });
        if (!user) throw new BadRequestException('Forgot password failed');

        return { resetEmailSent: await this.authService.startPasswordReset(user) };
    }

    @Post('/reset-password')
    @ApiResponse({ status: 201, description: 'Password reset successful' })
    @ApiResponse({ status: 401, description: 'Invalid or expired token or user not found' })
    @UsePipes(ValidationPipe)
    public async resetPassword(@Body() resetPasswordForm: PasswordResetForm): Promise<UserResponse> {
        const { email, newPassword, resetToken } = resetPasswordForm;

        const user = await this.userService.findOne({ email: email });
        if (!user) throw new BadRequestException('Password reset failed');

        const saved = await this.authService.resetPassword(user, resetToken, newPassword);
        if (!saved) throw new BadRequestException('Invalid or expired token');

        return UserDTOFactory.fromEntity(saved);
    }
}
