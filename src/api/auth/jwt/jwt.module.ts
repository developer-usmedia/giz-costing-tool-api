import { JwtModule } from '@nestjs/jwt';

import { environment } from '@common/environment/environment';

export const registerJWT = () =>
    JwtModule.register({
        secret: environment.jwt.secret,
        signOptions: { expiresIn: environment.jwt.expiresIn },
    });
