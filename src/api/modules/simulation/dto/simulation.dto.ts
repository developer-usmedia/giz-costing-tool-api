import {
    SimulationBenchmarkDTO,
    SimulationBenchmarkDTOFactory,
} from '@api/modules/simulation/dto/simulation-benchmark.dto';
import {
    SimulationFacilityDTO,
    SimulationFacilityDTOFactory,
} from '@api/modules/simulation/dto/simulation-facility.dto';
import { SIMULATION_LINKS } from '@api/modules/simulation/dto/simulation.links';
import { generatePaginationLinks } from '@api/paging/generate-pagination-links';
import { resolveLink } from '@api/paging/link-resolver';
import { PagingParams } from '@api/paging/paging-params';
import { CollectionResponse, EntityResponse, HalResponse, Link } from '@api/paging/paging-response';
import { Simulation } from '@domain/entities/simulation.entity';

/**
 * API layer DTO used in the request response for simulation endpoint
 *
 * - Defines DTO
 * - Defines interface of response with DTO
 * - Contains factory class that converts DB layer entity to response
 */

export interface SimulationDTO extends HalResponse {
    id: string;
    year: string;
    status: string;
    administrativeCosts: number;
    defaultEmployerTax: number;
    defaultEmployeeTax: number;
    facility: SimulationFacilityDTO;
    benchmark: SimulationBenchmarkDTO;
    createdAt: Date;
    updatedAt: Date;
    _links: {
        self: Link;
        workers: Link;
    };
}

export interface SimulationListResponse extends CollectionResponse<{ simulations: SimulationDTO[] }> {}
export interface SimulationResponse extends EntityResponse<SimulationDTO> {}

export class SimulationDTOFactory {
    public static fromEntity(entity: Simulation): SimulationResponse {
        return mapEntityToDTO(entity);
    }

    public static fromCollection(
        collection: Simulation[],
        count: number,
        paging: PagingParams<Simulation>,
    ): SimulationListResponse {
        return {
            _embedded: { simulations: collection.map(mapEntityToDTO) },
            _links: generatePaginationLinks(SIMULATION_LINKS.simulations, count, paging),
            paging: { index: paging.index, size: paging.size, totalEntities: count, totalPages: count / paging.size },
        };
    }
}

const mapEntityToDTO = (entity: Simulation): SimulationDTO => {
    return {
        id: entity.id,
        year: entity.year.toString(),
        status: entity.status,
        administrativeCosts: entity.administrativeCosts,
        defaultEmployeeTax: entity.defaultEmployeeTax,
        defaultEmployerTax: entity.defaultEmployerTax,
        facility: SimulationFacilityDTOFactory.fromEntity(entity.facility),
        benchmark: SimulationBenchmarkDTOFactory.fromEntity(entity.benchmark),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        _links: {
            self: { href: resolveLink(SIMULATION_LINKS.simulation, { simulationId: entity.id }) },
            workers: { href: resolveLink(SIMULATION_LINKS.workers, { simulationId: entity.id }) },
        },
    };
};
