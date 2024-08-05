import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Ip,
    Logger,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';

import { JwtAuthGuard, JwtPayload, OTPService, RefreshJwtGuard } from '@api/auth';
import { BaseController } from '@api/controllers';
import { CurrentUser } from '@api/decorators';
import { UserDTOFactory, UserResponse } from '@api/dto';
import {
    ForgotPasswordForm,
    LoginForm,
    PasswordChangeForm,
    PasswordResetForm,
    RegisterForm,
    UserDeleteForm,
    VerifyEmailCodeForm,
    VerifyOtpCode,
} from '@api/forms';
import { User } from '@domain/entities';
import { UserService } from '@domain/services';

@ApiTags('auth')
@Controller('auth')
export class AuthController extends BaseController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly userService: UserService,
        private readonly otpService: OTPService,
    ) {
        super();
    }

    @Post('/register')
    @ApiOperation({ summary: 'Register as a new user' })
    @ApiResponse({ status: 201, description: 'User registered' })
    @ApiResponse({ status: 400, description: 'User already registered' })
    public async register(@Body() registerForm: RegisterForm): Promise<UserResponse> {
        const existingUser = await this.userService.findOne({ email: registerForm.email }, {}, false);

        if (existingUser) {
            const message = existingUser.emailVerified ?
                'User is fully registered. Please login.' :
                'User is registered, but unverified. Please verify email.';
            return this.clientError(message);
        }

        const user = await this.userService.register(registerForm.email, registerForm.password);

        return UserDTOFactory.fromEntity(user);
    }

    @Post('/login')
    @ApiOperation({ summary: 'Login using user credentials' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiResponse({ status: 200, description: 'Successfull login' })
    public async login(
        @Body() loginForm: LoginForm,
        @Ip() ip: string,
    ): Promise<{ accessToken: string; refreshToken: string; user: UserResponse }> {
        const user = await this.userService.findOne({ email: loginForm.email });
        
        if (user.isLoginLocked(ip)) {
            throw new BadRequestException('Too many failed login attempts, login locked.');
        }

        this.validate2FAForUser(user, loginForm.otpCode);

        if (!user.emailVerified) {
            if (!loginForm.emailVerificationCode) {
                const errorMessage = 'Missing required property emailVerificationCode for verification';
                this.logger.debug(errorMessage);
                throw new BadRequestException(errorMessage);
            }

            // verify emailtoken with db entry and set emailVerified=true if not already verified
            const correct = await this.userService.verifyEmailCode(user, loginForm.emailVerificationCode);
            if (!correct) {
                const errorMessage = 'Invalid email verification code';
                this.logger.debug(errorMessage);
                throw new BadRequestException(errorMessage);
            }
        }

        const validCredentials = this.userService.validateCredentials(user, loginForm.password);
        if (!validCredentials) {
            user.saveFailedLogin(ip);
            await this.userService.persist(user);

            return this.clientError('Invalid credentials');
        }

        if(user.isLoginLocked(ip)) {
            user.resetLoginLock();
        }

        const jwt = this.userService.generateJwt(user);
        await this.userService.persist(user);

        return {
            accessToken: jwt.accessToken,
            refreshToken: jwt.refreshToken,
            user: UserDTOFactory.fromEntity(user),
        };
    }

    @Get('/whoami')
    @ApiOperation({ summary: 'Get user of currently signed in user' })
    @ApiResponse({ status: 200, description: 'Currently logged in user from session' })
    @UseGuards(JwtAuthGuard)
    public current(@CurrentUser() currentUser: User): UserResponse {
        return UserDTOFactory.fromEntity(currentUser);
    }

    @Post('/refresh')
    @ApiOperation({ summary: 'Refresh jwt access token using refresh token' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    @ApiResponse({ status: 200, description: 'New access and refresh token' })
    @UseGuards(RefreshJwtGuard)
    public async refresh(
        @Req() req: any,
        @CurrentUser() currentUser: JwtPayload, // Because of RefreshJwtGuard
        @Res() res: Response,
        @Ip() ip: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.userService.findOneByUid(currentUser.userId);

        if (user.isLoginLocked(ip)) {
            throw new BadRequestException('Too many failed login attempts, login locked.');
        }

        if (user?.refreshToken !== req.body.refreshToken) {
            throw new BadRequestException('Invalid refresh token');
        }

        const token = this.userService.generateJwt(user);
        user.refreshToken = token.refreshToken;
        await this.userService.persist(user);

        return this.ok(res, { accessToken: token.accessToken, refreshToken: token.refreshToken });
    }

    @Post('/logout')
    @HttpCode(200)
    @ApiOperation({ summary: 'Delete token refresh capability for a user until a new login' })
    @ApiResponse({ status: 200, description: 'Removed refresh capability for user' })
    @UseGuards(JwtAuthGuard)
    public async logout(@Res() res: Response, @CurrentUser() user: User): Promise<{ success: boolean }> {
        user.refreshToken = null;
        await this.userService.persist(user);

        return this.ok(res, { success: true });
    }

    @Delete('/account')
    @ApiOperation({ summary: 'Delete authenticated user from app' })
    @ApiResponse({ status: 200, description: 'The deleted user' })
    @ApiResponse({ status: 400, description: 'Missing or invalid two-factor code for user' })
    @UseGuards(JwtAuthGuard)
    public async deleteAccount(@Body() userDeleteForm: UserDeleteForm, @CurrentUser() user: User): Promise<UserResponse> {
        const correctPassword = user.comparePasswords(userDeleteForm.password);

        if (!correctPassword) {
            return this.clientError('Invalid credentials');
        }

        this.validate2FAForUser(user, userDeleteForm.otpCode);

        const removed = await this.userService.remove(user);
        return UserDTOFactory.fromEntity(removed);
    }

    @Post('/forgot-password')
    @ApiOperation({ summary: 'Start a password reset for a user' })
    @ApiResponse({ status: 201, description: 'Password reset started' })
    @ApiResponse({ status: 400, description: 'Password reset failed' })
    public async forgotPassword(
        @Body() { email }: ForgotPasswordForm,
        @Res() res: Response,
    ): Promise<{ success: boolean }> {
        const user = await this.userService.findOne({ email });
        if (!user) {
            return this.clientError('Forgot password failed');
        }

        const sent = await this.userService.startPasswordReset(user);

        return this.ok(res, { success: sent });
    }

    @Post('/reset-password')
    @HttpCode(200)
    @ApiOperation({ summary: 'Reset a users password' })
    @ApiResponse({ status: 201, description: 'Password reset successful' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token or user not found' })
    public async resetPassword(
        @Body() passwordResetForm: PasswordResetForm,
        @Res() res: Response,
    ): Promise<{ success: boolean }> {
        const { email, newPassword, resetToken } = passwordResetForm;

        const user = await this.userService.findOne({ email: email });
        if (!user) {
            return this.clientError('Password reset failed');
        }

        const saved = await this.userService.resetPassword(user, resetToken, newPassword);
        if (!saved) {
            return this.clientError('Invalid or expired token');
        }

        return this.ok(res, { success: saved });
    }

    @Post('/change-password')
    @HttpCode(200)
    @ApiOperation({ summary: 'Reset a users password' })
    @ApiResponse({ status: 201, description: 'Password reset successful' })
    @ApiResponse({ status: 400, description: 'Invalid or expired token or user not found' })
    public async changePassword(
        @Body() changePasswordForm: PasswordChangeForm,
        @Res() res: Response,
    ): Promise<{ success: boolean }> {
        const { email, password, newPassword, otpCode } = changePasswordForm;

        const user = await this.userService.findOne({ email: email });
        if (!user) {
            return this.clientError('Password reset failed');
        }

        const correctPassword = user.comparePasswords(password);
        if (!correctPassword) {
            return this.clientError('Invalid credentials');
        }

        if(user.twoFactor.enabled) {
            this.validate2FAForUser(user, otpCode);
        }

        user.resetPassword(newPassword);
        await this.userService.persist(user);

        return this.ok(res, { success: true });
    }

    @Post('/verify-code')
    @HttpCode(200)
    @ApiOperation({ summary: 'Validate verification code' })
    @ApiResponse({ status: 200, description: 'Validation result' })
    @ApiResponse({ status: 400, description: 'Invalid verification code' })
    public async verifyCode(
        @Body() { email, code }: VerifyEmailCodeForm,
        @Res() res: Response,
    ): Promise<{ success: boolean }> {
        const user = await this.userService.findOne({ email });
        const correctCode = user.verifyCode(code);

        if (!correctCode) {
            return this.clientError('Invalid verification code');
        }

        return this.ok(res, { success: true });
    }

    @Post('/verify-email')
    @UseGuards(ThrottlerGuard)
    @Throttle({
        default: {
            limit: 5,
            ttl: 60 * 60 * 10000, // 1 hour
        },
    })
    @ApiOperation({ summary: 'Send the user an email with a verification code' })
    @ApiResponse({ status: 200, description: 'The email has been successfully sent' })
    @ApiResponse({ status: 400, description: 'Email already verified for user' })
    public async sendEmailVerification(
        @Body('email') email: string,
        @Res() res: Response,
    ): Promise<{ success: boolean }> {
        const user = await this.userService.findOne({ email: email });

        if (user.emailVerified) {
            return this.clientError('User email already verified');
        }

        const sent = await this.userService.sendVerificationEmail(user);
        return this.ok(res, { success: sent });
    }

    @Post('/2fa/enable')
    @ApiOperation({ summary: 'Enable 2FA' })
    @ApiResponse({ status: 201, description: '2FA registration started. Requires verification' })
    @ApiResponse({ status: 400, description: 'Email verification required or 2FA already enabled' })
    @UseGuards(JwtAuthGuard)
    public async register2FA(@CurrentUser() user: User, @Res() res: Response): Promise<{ qrcode: string }> {
        if (!user.emailVerified) {
            return this.clientError('Email verification required before enabling 2FA');
        }

        if (user.twoFactor.enabled) {
            return this.clientError('2FA already enabled');
        }

        const { secret, qrcode } = await this.otpService.generate2FASecret();
        await this.userService.save2FASecret(user, secret.base32);

        // Q for J: Send secret to frontend for manual entry in authenticator?
        return this.created(res, { qrcode: qrcode });
    }

    @Post('/2fa/verify')
    @ApiOperation({ summary: 'Verify/enable a 2FA authenticator' })
    @ApiResponse({ status: 200, description: '2FA enabled' })
    @ApiResponse({ status: 400, description: '2FA not setup or invalid verification code' })
    @UseGuards(JwtAuthGuard)
    public verify2FA(
        @Body() { password, otpCode }: VerifyOtpCode,
        @CurrentUser() user: User,
        @Res() res: Response,
    ): { success: boolean } {
        const matchingPassword = user.comparePasswords(password);
        if (!matchingPassword) {
            return this.clientError('Invalid credentials');
        }

        if (!user.twoFactor.enabled && !user.twoFactor.secret) {
            return this.clientError('2FA is disabled');
        }

        const verified = this.otpService.verify2FACode(user.twoFactor.secret, otpCode);
        if (!verified) {
            return this.clientError('Invalid verification code');
        }

        if (!user.twoFactor.enabled) {
            this.userService.enable2FA(user);
        }

        return this.ok(res, { success: verified });
    }

    @Post('/2fa/disable')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Disable 2FA' })
    @ApiResponse({ status: 200, description: '2FA disabled or 2FA was never enabled' })
    public async disable2FA(@CurrentUser() user: User, @Res() res: Response): Promise<{ success: boolean }> {
        const disabled = await this.userService.disable2FA(user);

        return this.ok(res, { success: disabled });
    }

    private validate2FAForUser(user: User, code: string) {
        if (user.twoFactor.enabled) {
            if (!code) {
                throw new BadRequestException('Two-factor is enabled, missing code in request');
            }

            const verified = this.otpService.verify2FACode(user.twoFactor.secret, code);
            if (!verified) {
                throw new BadRequestException('Two-factor code is invalid');
            }
        }
    }
}
