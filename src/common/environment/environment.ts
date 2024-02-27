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

    public jwt: {
        secret: string;
        expiresIn: string;
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
        const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

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

        this.jwt = {
            secret: JWT_SECRET,
            expiresIn: JWT_EXPIRES_IN ?? '30m',
        };

        this.mail = {
            apiKey: SENDGRID_API_KEY,
            from: EMAIL_FROM,
        };
    }

    public isValid = (): boolean => {
        return (
            !!this.db.host &&
            !!this.db.name &&
            !!this.db.port &&
            !!this.db.user &&
            !!this.db.password &&
            !!this.api.url &&
            !!this.jwt.secret &&
            !!this.jwt.expiresIn &&
            !!this.mail.apiKey &&
            !!this.mail.from
        );
    };
}

export const environment = new Environment();
