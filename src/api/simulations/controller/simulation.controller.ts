import { Controller, Get, NotFoundException, Param, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/auth/jwt/jwt.guard';
import { Paging } from '@common/decorators/paging.decorator';
import { PagingParams } from '@common/paging/paging-params';
import { PagingValidationPipe } from '@common/pipes/paging-params';
import { Simulation } from '@database/entities/simulation.entity';
import { SimulationService } from '@domain/services/simulation.service';
import { SimulationDTOFactory, SimulationListResponse, SimulationResponse } from '../dto/simulation.dto';

@ApiTags('simulations')
@Controller('simulations')
export class SimulationController {
    constructor(private readonly simulationService: SimulationService) {}

    @Get('/')
    @ApiResponse({ status: 200, description: 'Simulations for the current user' })
    @UseGuards(JwtAuthGuard)
    public async index(
        @Paging('Simulation', PagingValidationPipe) paging: PagingParams<Simulation>,
        @Req() req,
    ): Promise<SimulationListResponse> {
        paging.filter = { ...paging.filter, user: req.user.userId };
        const [simulations, count] = await this.simulationService.findManyPaged(paging);

        return SimulationDTOFactory.fromCollection(simulations, count, paging);
    }

    @Get('/:id')
    @ApiResponse({ status: 404, description: 'The record cannot be found' })
    @ApiResponse({ status: 200, description: 'The requested record' })
    public async findBy(@Param('id', ParseUUIDPipe) id: string): Promise<SimulationResponse> {
        const simulation = await this.simulationService.findOne({ id });
        if (!simulation) throw new NotFoundException();

        return SimulationDTOFactory.fromEntity(simulation);
    }
}
