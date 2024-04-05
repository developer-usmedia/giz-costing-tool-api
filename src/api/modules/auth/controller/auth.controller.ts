import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Post,
    Req,
    Request,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';

import { ForgotPasswordForm } from '@api/modules/auth/form/forgot-password.form';
import { LoginForm } from '@api/modules/auth/form/login-form.form';
import { PasswordResetForm } from '@api/modules/auth/form/password-reset-form.form';
import { RegisterForm } from '@api/modules/auth/form/register-form.form';
import { VerifyEmailForm } from '@api/modules/auth/form/verify-email.form';
import { GlobalGuard } from '@api/modules/auth/login/global.guard';
import { LoginAuthGuard } from '@api/modules/auth/login/login.guard';
import { OTPService } from '@api/modules/auth/service/otp.service';
import { BaseController } from '@api/modules/base.controller';
import { UserDTOFactory, UserResponse } from '@api/modules/user/dto/user.dto';
import { User, User as UserDecorator } from '@api/nestjs/decorators/user.decorator';
import { AuthService } from '@domain/services/auth.service';
import { UserService } from '@domain/services/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController extends BaseController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly otpService: OTPService,
    ) {
        super();
    }

    @Post('/register')
    @ApiOperation({ summary: 'Register as a new user' })
    @ApiResponse({ status: 201, description: 'User registered' })
    @ApiResponse({ status: 400, description: 'User already registered' })
    @UsePipes(ValidationPipe)
    public async register(@Body() registerForm: RegisterForm): Promise<UserResponse> {
        const existingUser = await this.userService.findOne({ email: registerForm.email }, {}, false);
        if (existingUser) {
            return this.clientError('User already registered');
        }

        const user = await this.authService.register(registerForm.email, registerForm.password);

        return UserDTOFactory.fromEntity(user);
    }

    @Post('/login')
    @ApiOperation({ summary: 'Login using user credentials' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 200, description: 'Successfull login' })
    @UsePipes(ValidationPipe)
    @UseGuards(LoginAuthGuard)
    public async login(
        @Body() loginForm: LoginForm,
        @UserDecorator() sessionUser: { id: string },
        @Res() res: Response,
    ): Promise<UserResponse> {
        const user = await this.userService.findOneByUid(sessionUser.id);

        if (!user.emailVerified) {
            if (!loginForm.emailVerificationCode) {
                throw new BadRequestException('Email verification code required for login');
            }
            // verify token and set emailVerified=true
            const correct = await this.authService.verifyEmailCode(user, loginForm.emailVerificationCode);

            if (!correct) {
                throw new BadRequestException('Invalid email verification code');
            }
        }

        return this.ok(res, UserDTOFactory.fromEntity(user));
    }

    @Post('/logout')
    @HttpCode(200)
    @ApiOperation({ summary: 'Logout from current session' })
    @ApiResponse({ status: 200, description: 'Successfull logout' })
    public logout(@Request() req, @Res() res: Response): { success: boolean } {
        req.session.destroy();
        return this.ok(res, { success: true });
    }

    @Post('/forgot-password')
    @ApiOperation({ summary: 'Start a password reset for a user' })
    @ApiResponse({ status: 201, description: 'Password reset started' })
    @ApiResponse({ status: 400, description: 'Password reset failed' })
    @UsePipes(ValidationPipe)
    public async forgotPassword(
        @Body() { email }: ForgotPasswordForm,
        @Res() res: Response,
    ): Promise<{ success: boolean }> {
        const user = await this.userService.findOne({ email });
        if (!user) {
            return this.clientError('Forgot password failed');
        }

        const sent = await this.authService.startPasswordReset(user);

        return this.ok(res, { success: sent });
    }

    @Post('/reset-password')
    @HttpCode(200)
    @ApiOperation({ summary: 'Reset a users password' })
    @ApiResponse({ status: 201, description: 'Password reset successful' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token or user not found' })
    @UsePipes(ValidationPipe)
    public async resetPassword(
        @Body() resetPasswordForm: PasswordResetForm,
        @Res() res: Response,
        @Req() req,
    ): Promise<{ success: boolean }> {
        const { email, newPassword, resetToken } = resetPasswordForm;

        const user = await this.userService.findOne({ email: email });
        if (!user) {
            return this.clientError('Password reset failed');
        }

        const saved = await this.authService.resetPassword(user, resetToken, newPassword);
        if (!saved) {
            return this.clientError('Invalid or expired token');
        }

        req.session.destroy();

        return this.ok(res, { success: saved });
    }
    @Throttle({ default: { limit: 3 } })
    @Post('/verify-email')
    @ApiOperation({ summary: 'Send the user an email with a verification code' })
    @ApiResponse({ status: 200, description: 'The email has been successfully sent' })
    @ApiResponse({ status: 400, description: 'Email already verified for user' })
    @UseGuards(GlobalGuard)
    @UsePipes(ValidationPipe)
    public async sendEmailVerification(
        @Body() form: VerifyEmailForm,
        @Res() res: Response,
    ): Promise<{ success: boolean }> {
        const user = await this.userService.findOneByUid(form.userId);

        if (user.emailVerified) {
            return this.clientError('User email already verified');
        }

        const sent = await this.authService.sendVerificationEmail(user);
        return this.ok(res, { success: sent });
    }

    @Post('/2fa/enable')
    @ApiOperation({ summary: 'Enable 2FA' })
    @ApiResponse({ status: 201, description: '2FA registration started. Requires verification' })
    @ApiResponse({ status: 400, description: 'Email verification required or 2FA already enabled' })
    @UseGuards(GlobalGuard)
    public async register2FA(@User() sessionUser: { id: string }, @Res() res: Response): Promise<{ qrcode: string }> {
        const user = await this.userService.findOneByUid(sessionUser.id);

        if (!user.emailVerified) {
            return this.clientError('Email verification required before enabling 2FA');
        }
        if (user.twoFactor.enabled) {
            return this.clientError('2FA already enabled');
        }

        const { secret, qrcode } = await this.otpService.generate2FASecret();
        await this.authService.save2FASecret(user, secret.base32);

        // Q for J: Send secret to frontend for manual entry in authenticator?
        return this.created(res, { qrcode: qrcode });
    }

    @Post('/2fa/verify/:code')
    @ApiOperation({ summary: 'Verify/enable a 2FA authenticator' })
    @ApiResponse({ status: 200, description: '2FA enabled' })
    @ApiResponse({ status: 400, description: '2FA not setup or invalid verification code' })
    @UseGuards(GlobalGuard)
    @UsePipes(ValidationPipe)
    public async verify2FA(
        @Param('code') code: string,
        @User() sessionUser: { id: string },
        @Res() res: Response,
    ): Promise<{ success: boolean }> {
        const user = await this.userService.findOneByUid(sessionUser.id);
        if (!user.twoFactor.enabled || !user.twoFactor.secret) {
            return this.clientError('2FA is disabled');
        }

        const verified = this.otpService.verify2FACode(user.twoFactor.secret, code);
        if (!verified) {
            return this.clientError('Invalid verfication code');
        }

        if (!user.twoFactor.enabled) {
            this.authService.enable2FA(user);
        }

        return this.ok(res, { success: verified });
    }

    @Post('/2fa/disable')
    @UseGuards(GlobalGuard)
    @UsePipes(ValidationPipe)
    @ApiOperation({ summary: 'Disable 2FA' })
    @ApiResponse({ status: 200, description: '2FA disabled or 2FA was never enabled' })
    public async disable2FA(@User() sessionUser: { id: string }, @Res() res: Response): Promise<{ success: boolean }> {
        const user = await this.userService.findOneByUid(sessionUser.id);
        const disabled = await this.authService.disable2FA(user);

        return this.ok(res, { success: disabled });
    }
}
