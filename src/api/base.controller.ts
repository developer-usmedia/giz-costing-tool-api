import { BadRequestException, NotFoundException } from '@nestjs/common';

export abstract class BaseController {
    public clientError(message?: string): null {
        throw new BadRequestException({
            statusCode: 400,
            message: message ?? 'Bad request',
            error: 'Bad Request',
        });
    }

    public notFound(message?: string): null {
        throw new NotFoundException({
            statusCode: 400,
            message: message ?? 'Not found',
            error: 'Not Found',
        });
    }
}
