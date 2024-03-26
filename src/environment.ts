import { config } from 'dotenv';

class Environment {
    public db: {
        host: string;
        name: string;
        port: number;
        user: string;
        password: string;
    };

    public api: {
        url: string;
        isLocal: boolean;
        env: string;
    };

    public session: {
        secret: string;
        expiresIn: number;
        name: string;
        tableName: string;
    };

    public mail: {
        apiKey: string;
        from: string;
    };

    constructor() {
        config();

        const { API_URL } = process.env;
        const { MIKRO_ORM_HOST, MIKRO_ORM_DB_NAME, MIKRO_ORM_PORT, MIKRO_ORM_USER, MIKRO_ORM_PASSWORD } = process.env;
        const { SENDGRID_API_KEY, EMAIL_FROM } = process.env;
        const { SESSION_SECRET, SESSION_EXPIRES_IN, SESSION_NAME, SESSION_TABLE_NAME } = process.env;

        this.db = {
            host: MIKRO_ORM_HOST,
            name: MIKRO_ORM_DB_NAME,
            port: +MIKRO_ORM_PORT,
            user: MIKRO_ORM_USER,
            password: MIKRO_ORM_PASSWORD,
        };

        this.api = {
            url: API_URL,
            isLocal: this.isLocal(),
            env: process.env.NODE_ENV,
        };

        this.session = {
            secret: SESSION_SECRET,
            expiresIn: +SESSION_EXPIRES_IN,
            name: SESSION_NAME ?? 'GIZ-COOKIE',
            tableName: SESSION_TABLE_NAME ?? 'giz_session',
        };

        this.mail = {
            apiKey: SENDGRID_API_KEY,
            from: EMAIL_FROM,
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
        return ['development', 'test'].includes(process.env.NODE_ENV);
    };
}

export const environment = new Environment();
