import { LogLevel } from '@nestjs/common';
import { config } from 'dotenv';

type Envs = 'development' | 'staging' | 'production';

class Environment {
    public api: {
        url: string;
        port: number;
        env: Envs;
        isLocal: boolean;
        corsOrigin: string[];
        logLevel: LogLevel;
    };

    public db: {
        socket: string;
        host: string;
        name: string;
        port: number;
        user: string;
        password: string;
    };

    public mail: {
        apiKey: string;
        fromName: string;
        fromEmail: string;
    };

    public jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
        issuer: string;
    };

    constructor() {
        config();

        this.api = {
            url: process.env.API_URL,
            port: +process.env.API_PORT || 8080,
            env: process.env.ENV as Envs,
            isLocal: this.isLocal(),
            corsOrigin: this.parseUrls(process.env.API_CORS_ORIGIN),
            logLevel: process.env.LOG_LEVEL as LogLevel ?? 'warn',
        };

        this.db = {
            socket: process.env.DB_SOCKET,
            host: process.env.DB_HOST,
            name: process.env.DB_NAME,
            port: +process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        };

        this.mail = {
            apiKey: process.env.BREVO_API_KEY,
            fromName: process.env.EMAIL_FROM_NAME ?? 'GIZ',
            fromEmail: process.env.EMAIL_FROM_ADDRESS ?? 'ina@giz.de',
        };

        this.jwt = {
            secret: process.env.JWT_SECRET ?? 'very-secret-secret',
            expiresIn: process.env.JWT_EXPIRES_IN ?? '1hr',
            refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
            issuer: process.env.JWT_ISSUER ?? 'GIZ - Costing Tool',
        };
    }

    public isValid = (): boolean => {
        return (
            ((!!this.db.host && !!this.db.port) || !!this.db.socket) &&
            !!this.db.name &&
            !!this.db.user &&
            !!this.db.password &&
            !!this.api.url &&
            !!this.jwt.secret &&
            !!this.mail.apiKey
        );
    };

    private readonly isLocal = (): boolean => {
        return ['development', 'test'].includes(process.env.ENV);
    };

    private parseUrls(urls: string): string[] {
        if (!urls) {
            return [];
        }

        return urls.split(',').map(u => u.trim().replace(/\/$/, ''));
    }
}

export const environment = new Environment();
