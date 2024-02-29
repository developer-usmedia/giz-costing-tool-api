import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

export abstract class BaseController {
    public ok<T>(res: Response, dto?: T): T {
        res.status(200).json(dto);
        return dto;
    }

    public created<T>(res: Response, dto?: T): T {
        res.status(201).json(dto);
        return dto;
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
