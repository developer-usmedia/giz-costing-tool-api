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
    };

    public mail: {
        apiKey: string;
        from: string;
    };

    constructor() {
        config();

        const { MIKRO_ORM_HOST, MIKRO_ORM_DB_NAME, MIKRO_ORM_PORT, MIKRO_ORM_USER, MIKRO_ORM_PASSWORD } = process.env;
        const { API_URL } = process.env;
        const { SENDGRID_API_KEY, EMAIL_FROM } = process.env;

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
            secret: this.getJWTSecret(),
        };

        this.mail = {
            apiKey: SENDGRID_API_KEY,
            from: EMAIL_FROM,
        };
    }

    public getJWTSecret = () => {
        const { NODE_ENV, JWT_SECRET } = process.env;

        if (NODE_ENV === 'test' && !JWT_SECRET) {
            return 'superverysecret';
        } else {
            return JWT_SECRET;
        }
    };

    public isValid = (): boolean => {
        return (
            !!this.db.host &&
            !!this.db.name &&
            !!this.db.port &&
            !!this.db.user &&
            !!this.db.password &&
            !!this.api.url &&
            !!this.jwt.secret &&
            !!this.mail.apiKey &&
            !!this.mail.from
        );
    };
}

export const environment = new Environment();
