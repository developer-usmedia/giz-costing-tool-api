import { LogLevel } from '@nestjs/common';
import { config } from 'dotenv';

type Envs = 'development' | 'staging' | 'production';

class Environment {
    public api: {
        url: string;
        isLocal: boolean;
        env: Envs;
        corsOrigin: (string|RegExp)[];
        logLevel: LogLevel;
    };

    public db: {
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
            isLocal: this.isLocal(),
            env: process.env.ENV as Envs,
            corsOrigin: this.parseUrls(process.env.API_CORS_ORIGIN),
            logLevel: process.env.LOG_LEVEL as LogLevel ?? 'warn',
        };

        this.db = {
            host: process.env.MIKRO_ORM_HOST,
            name: process.env.MIKRO_ORM_DB_NAME,
            port: +process.env.MIKRO_ORM_PORT,
            user: process.env.MIKRO_ORM_USER,
            password: process.env.MIKRO_ORM_PASSWORD,
        };

        this.mail = {
            apiKey: process.env.BREVO_API_KEY,
            fromName: process.env.EMAIL_FROM_NAME ?? 'GIZ',
            fromEmail: process.env.EMAIL_FROM_ADDRESS ?? 'ina@giz.de',
        };

        const envJwtExpire = process.env.JWT_EXPIRES_IN ?? '1hr';
        this.jwt = {
            secret: process.env.JWT_SECRET,
            expiresIn: this.api.isLocal ? '1d' : envJwtExpire,
            refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
            issuer: process.env.JWT_ISSUER ?? 'UsMedia',
        };
    }

    public getPostgresConnectionString = (): string =>
        `postgres://${this.db.user}:${this.db.password}@${this.db.host}:${this.db.port}/${this.db.name}`;

    public isValid = (): boolean => {
        return (
            !!this.db.host &&
            !!this.db.name &&
            !!this.db.port &&
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

    private parseUrls(urls: string): (string | RegExp)[] {
        if (!urls) {
            return [];
        }

        return urls.split(',').map((u) => {
            let url: string | RegExp = u.trim();
            if (url.startsWith('.') || url.startsWith('-')) {
                url = new RegExp(url);
            } else {
                url = url.replace(/\/$/, '');
            }
            return url;
        });
    }
}

export const environment = new Environment();
