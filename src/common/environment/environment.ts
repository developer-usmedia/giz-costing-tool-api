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
    };

    public session: {
        secret: string;
        expiresIn: number;
    };

    public mail: {
        apiKey: string;
        from: string;
    };

    public redis: {
        host: string;
        port: number;
    };

    constructor() {
        config();

        const { API_URL } = process.env;
        const { MIKRO_ORM_HOST, MIKRO_ORM_DB_NAME, MIKRO_ORM_PORT, MIKRO_ORM_USER, MIKRO_ORM_PASSWORD } = process.env;
        const { SENDGRID_API_KEY, EMAIL_FROM } = process.env;
        const { SESSION_SECRET, SESSION_EXPIRES_IN } = process.env;
        const { REDIS_HOST, REDIS_PORT } = process.env;

        this.db = {
            host: MIKRO_ORM_HOST,
            name: MIKRO_ORM_DB_NAME,
            port: +MIKRO_ORM_PORT,
            user: MIKRO_ORM_USER,
            password: MIKRO_ORM_PASSWORD,
        };

        this.api = {
            url: API_URL,
        };

        this.session = {
            secret: SESSION_SECRET,
            expiresIn: +SESSION_EXPIRES_IN,
        };

        this.mail = {
            apiKey: SENDGRID_API_KEY,
            from: EMAIL_FROM,
        };

        this.redis = {
            host: REDIS_HOST,
            port: +REDIS_PORT,
        };
    }

    public isLocal = (): boolean => {
        return ['development', 'test'].includes(process.env.NODE_ENV);
    };

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
            !!this.redis.host &&
            !!this.redis.port &&
            !!this.mail.apiKey &&
            !!this.mail.from
        );
    };
}

export const environment = new Environment();
