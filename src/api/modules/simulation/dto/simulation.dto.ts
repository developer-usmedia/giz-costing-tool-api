import { SimulationBenchmarkDTO, SimulationBenchmarkDTOFactory } from '@api/modules/simulation/dto/simulation-benchmark.dto';
import { SimulationFacilityDTO, SimulationFacilityDTOFactory } from '@api/modules/simulation/dto/simulation-facility.dto';
import { generatePaginationLinks } from '@api/paging/generate-pagination-links';
import { PagingParams } from '@api/paging/paging-params';
import { EntityResponse, PagedEntityResponse } from '@api/paging/paging-response';
import { environment } from '@app/environment';
import { Simulation } from '@domain/entities/simulation.entity';

/**
 * API layer DTO used in the request response for simulation endpoint
 *
 * - Defines DTO
 * - Defines interface of response with DTO
 * - Contains factory class that converts DB layer entity to response
 */

export interface SimulationDTO {
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
}

export interface SimulationListResponse extends PagedEntityResponse<'simulations', SimulationDTO> {}
export interface SimulationResponse extends EntityResponse<'simulation', SimulationDTO> {}

export class SimulationDTOFactory {
    public static fromEntity(entity: Simulation): SimulationResponse {
        return {
            simulation: mapEntityToDTO(entity),
        };
    }

    public static fromCollection(
        collection: Simulation[],
        count: number,
        paging: PagingParams<Simulation>,
    ): SimulationListResponse {
        const simulationCollectionUrl = new URL(environment.api.url + '/api/simulations');

        return {
            simulations: collection.map(mapEntityToDTO),
            links: generatePaginationLinks(simulationCollectionUrl, count, paging),
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
    };
};
