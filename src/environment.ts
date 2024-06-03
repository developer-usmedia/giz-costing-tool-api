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
        from: string;
    };

    public session: {
        secret: string;
        expiresIn: number;
        name: string;
        tableName: string;
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
            apiKey: process.env.SENDGRID_API_KEY,
            from: process.env.EMAIL_FROM,
        };

        this.session = {
            secret: process.env.SESSION_SECRET,
            expiresIn: +process.env.SESSION_EXPIRES_IN,
            name: process.env.SESSION_NAME ?? 'GIZ-COOKIE',
            tableName: process.env.SESSION_TABLE_NAME ?? 'giz_session',
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
            !!this.session.secret &&
            !!this.session.expiresIn &&
            !!this.mail.apiKey &&
            !!this.mail.from
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
