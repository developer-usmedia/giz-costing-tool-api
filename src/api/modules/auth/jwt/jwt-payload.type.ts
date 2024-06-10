export type JwtPayload = {
    userId: string;
    email: string;
    iss: string;
    iat?: string;
    exp?: string;
};
