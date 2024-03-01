import { Body, Controller, HttpCode, Param, Post, Req, Request, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseController } from '@api/base.controller';
import { UserDTOFactory, UserResponse } from '@api/user/dto/user.dto';
import { AuthService, OTPService, UserService } from '@domain/services';
import { Response } from 'express';
import { ForgotPasswordForm } from '../dto/forgot-password.dto';
import { PasswordResetForm } from '../dto/password-reset-form.dto';
import { RegisterForm } from '../dto/register-form.dto';
import { AuthGuard } from '../local/auth.guard';
import { LoginAuthGuard } from '../local/login.guard';

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
    public login(@Res() res: Response): { success: boolean } {
        return this.ok(res, { success: true });
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
    ): Promise<{ resetEmailSent: boolean }> {
        // TODO: rate limit this endpoint
        const user = await this.userService.findOne({ email });
        if (!user) this.clientError('Forgot password failed');

        // Q for J: Does this endpoint require a validated email? Or send anyway?
        const sent = await this.authService.startPasswordReset(user);

        return this.ok(res, { resetEmailSent: sent });
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
    ): Promise<{ passwordReset: boolean }> {
        const { email, newPassword, resetToken } = resetPasswordForm;

        const user = await this.userService.findOne({ email: email });
        if (!user) return this.clientError('Password reset failed');

        const saved = await this.authService.resetPassword(user, resetToken, newPassword);
        if (!saved) return this.clientError('Invalid or expired token');

        return this.ok(res, { passwordReset: saved });
    }

    @Post('/2fa/enable')
    @ApiOperation({ summary: 'Enable 2FA' })
    @ApiResponse({ status: 201, description: '2FA registration started. Requires verification' })
    @ApiResponse({ status: 400, description: 'Email verification required or 2FA already enabled' })
    @UseGuards(AuthGuard)
    public async register2FA(@Req() req, @Res() res: Response): Promise<{ qrcode: string }> {
        const { emailVerfied, twoFactor } = req.user;
        if (!emailVerfied) this.clientError('Email verification required before enabling 2FA');
        if (twoFactor.enabled) this.clientError('2FA already enabled');

        const user = await this.userService.findOneByUid(req.user.id as string);
        const { secret, qrcode } = await this.otpService.generate2FASecret();
        await this.authService.save2FASecret(user, secret.base32);

        // Q for J: Send secret to frontend for manual entry in authenticator?
        return this.created(res, { qrcode: qrcode });
    }

    @Post('/2fa/verify/:code')
    @ApiOperation({ summary: 'Verify/enable a 2FA authenticator' })
    @ApiResponse({ status: 200, description: '2FA enabled' })
    @ApiResponse({ status: 400, description: '2FA not setup or invalid verification code' })
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    public async verify2FA(@Param('code') code: string, @Req() req, @Res() res: Response): Promise<{ verified: boolean }> {
        const { enabled, secret } = req.user.twoFactor;
        if (!secret) this.clientError('2FA is disabled');

        const verified = this.otpService.verify2FACode(req.user.twoFactor.secret as string, code);
        if (!verified) this.clientError('Invalid verfication code');

        if (!enabled) {
            const user = await this.userService.findOneByUid(req.user.id as string);
            this.authService.enable2FA(user);
        }

        return this.ok(res, { verified: verified });
    }

    @Post('/2fa/disable')
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @ApiOperation({ summary: 'Disable 2FA' })
    @ApiResponse({ status: 200, description: '2FA disabled or 2FA was never enabled' })
    public async disable2FA(@Req() req, @Res() res: Response): Promise<{ disabled: boolean }> {
        const user = await this.userService.findOneByUid(req.user.id as string);
        const disabled = await this.authService.disable2FA(user);

        return this.ok(res, { disabled: disabled });
    }
}
