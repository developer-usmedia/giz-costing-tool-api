import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Logger,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';

import { ForgotPasswordForm } from '@api/modules/auth/form/forgot-password.form';
import { PasswordResetForm } from '@api/modules/auth/form/password-reset-form.form';
import { RegisterForm } from '@api/modules/auth/form/register-form.form';
import { VerifyEmailForm } from '@api/modules/auth/form/verify-email.form';
import { OTPService } from '@api/modules/auth/service/otp.service';
import { BaseController } from '@api/modules/base.controller';
import { UserDTOFactory, UserResponse } from '@api/modules/user/dto/user.dto';
import { CurrentUser } from '@api/nestjs/decorators/user.decorator';
import { User } from '@domain/entities/user.entity';
import { AuthService } from '@domain/services/auth.service';
import { UserService } from '@domain/services/user.service';
import { LoginForm } from '../form/login-form.form';
import { VerifyCodeForm } from '../form/verify-code.form';
import { JwtPayload } from '../jwt/jwt-payload.type';
import { RefreshJwtGuard } from '../jwt/jwt-refresh.guard';
import { JwtAuthGuard } from '../jwt/jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController extends BaseController {
    private readonly logger = new Logger(AuthController.name);

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
    public async login(
        @Body() loginForm: LoginForm,
    ): Promise<{ accessToken: string; refreshToken: string; user: UserResponse }> {
        const user = await this.userService.findOne({ email: loginForm.email });
        const jwt = this.authService.login(user, loginForm.password);

        if (!user.emailVerified) {
            if (!loginForm.emailVerificationCode) {
                const errorMessage = 'Missing required property emailVerificationCode for verification';
                this.logger.debug(errorMessage);
                throw new BadRequestException(errorMessage);
            }

            // verify emailtoken with db entry and set emailVerified=true if not already verified
            const correct = await this.authService.verifyEmailCode(user, loginForm.emailVerificationCode);
            if (!correct) {
                const errorMessage = 'Invalid email verification code';
                this.logger.debug(errorMessage);
                throw new BadRequestException(errorMessage);
            }
        }

        user.refreshToken = jwt.refreshToken;
        await this.userService.persist(user);

        return {
            accessToken: jwt.accessToken,
            refreshToken: jwt.refreshToken,
            user: UserDTOFactory.fromEntity(user),
        };
    }

    @Get('/session')
    @ApiOperation({ summary: 'Get user of currently signed in user' })
    @ApiResponse({ status: 200, description: 'Currently logged in user from session' })
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
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
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.userService.findOneByUid(currentUser.userId);

        if (user?.refreshToken !== req.body.refreshToken) {
            throw new BadRequestException('Invalid refresh token');
        }

        const token = this.authService.generateJwt(user);
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
        const saved = await this.userService.persist(user);

        return this.ok(res, { success: !!saved });
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


    @Post('/verify-code')
    @HttpCode(200)
    @ApiOperation({ summary: 'Validate verification code' })
    @ApiResponse({ status: 200, description: 'Validation result' })
    @ApiResponse({ status: 400, description: 'Code verification failed' })
    @UsePipes(ValidationPipe)
    public async verifyCode(
        @Body() { email, code }: VerifyCodeForm,
        @Res() res: Response,
    ): Promise<{ success: boolean }> {
        const user = await this.userService.findOne({ email });
        if (!user) {
            return this.clientError('Code verification failed');
        }

        const correctCode = user.verifyCode(code);

        return this.ok(res, { success: correctCode });
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

        return this.ok(res, { success: saved });
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
    @UsePipes(ValidationPipe)
    public async sendEmailVerification(
        @Body() form: VerifyEmailForm,
        @Res() res: Response,
    ): Promise<{ success: boolean }> {
        const user = await this.userService.findOne({ email: form.email });

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
    @UseGuards(JwtAuthGuard)
    public async register2FA(@CurrentUser() user: User, @Res() res: Response): Promise<{ qrcode: string }> {
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
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    public verify2FA(
        @Param('code') code: string,
        @CurrentUser() user: User,
        @Res() res: Response,
    ): { success: boolean } {
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
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @ApiOperation({ summary: 'Disable 2FA' })
    @ApiResponse({ status: 200, description: '2FA disabled or 2FA was never enabled' })
    public async disable2FA(@CurrentUser() user: User, @Res() res: Response): Promise<{ success: boolean }> {
        const disabled = await this.authService.disable2FA(user);

        return this.ok(res, { success: disabled });
    }
}
