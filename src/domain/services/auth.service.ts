import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDTO } from '@api/auth/dto/create-user.dto';
import { JwtPayload } from '@common/types/jwt.payload.type';
import { User } from '@database/entities/user.entity';
import { MailDataRequired } from '@sendgrid/mail';
import { EmailService } from './email.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    protected readonly entityName = User;

    constructor(
        protected readonly em: EntityManager,
        protected readonly usersService: UserService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
    ) {}

    public async register(email: string, password: string): Promise<User> {
        const user = CreateUserDTO.toEntity({ email, password });

        return await this.usersService.persist(user);
    }

    public async login(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOne({ email }, { populate: ['password'] });
        const isMatch = user?.comparePasswords(password);

        if (!user || !isMatch) throw new UnauthorizedException('Invalid credentials');

        return {
            token: this.signJwt(user),
        };
    }

    public async startPasswordReset(user: User): Promise<boolean> {
        // TODO: check if email has been verified?
        user.generateAndSetResetToken();

        const updatedUser = await this.usersService.persist(user);

        return await this.sendPasswordResetEmail(updatedUser);
    }

    public async resetPassword(user: User, token: string, newPassword: string): Promise<User | null> {
        const validToken = user.compareResetToken(token);

        if (!validToken) return null;

        user.resetPassword(newPassword);

        return await this.usersService.persist(user);
    }

    public async sendPasswordResetEmail(user: User): Promise<boolean> {
        const email: MailDataRequired = {
            ...EmailService.BASE_EMAIL,
            to: user.email,
            subject: 'GIZ Costing Tool Password Reset Code',
            content: [{ type: 'text/plain', value: `Reset code: ${user.resetToken}` }],
        };

        return await this.emailService.send(email);
    }

    private signJwt(user: User): string {
        const payload: JwtPayload = { userId: user.id, email: user.email };

        return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
    }
}
