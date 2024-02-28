import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

export abstract class BaseController {
    public ok<T = void>(res: Response, dto?: T) {
        if (dto !== undefined) {
            return res.status(200).json(dto);
        } else {
            return res.sendStatus(200);
        }
    }

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
