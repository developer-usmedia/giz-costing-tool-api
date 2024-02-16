import { environment } from '@common/environment/environment';
import { generatePaginationLinks } from '@common/paging/generate-pagination-links';
import { PagingParams } from '@common/paging/paging-params';
import { EntityResponse, PagedEntityResponse } from '@common/paging/paging-response';
import { Simulation } from '@database/entities/simulation.entity';

/**
 * API layer DTO used in the request response for simulation endpoint
 *
 * - Defines DTO
 * - Defines interface of response with DTO
 * - Contains factory class that converts DB layer entity to response
 */

export interface SimulationDTO {
    id: string;
    name: string;
    year: string;
    status: string;
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
        name: entity.name,
        year: entity.year.toString(),
        status: entity.status,
    };
};
