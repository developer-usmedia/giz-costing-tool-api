import { WORKER_LINKS } from '@api/modules/worker/dto/worker.links';
import { generatePaginationLinks } from '@api/paging/generate-pagination-links';
import { resolveLink } from '@api/paging/link-resolver';
import { PagingParams } from '@api/paging/paging-params';
import { CollectionResponse, EntityResponse, HalResponse, Link } from '@api/paging/paging-response';
import { Worker } from '@domain/entities/worker.entity';
import { Gender } from '@domain/enums/gender.enum';

/**
 * API layer DTO used in the request response for the workers endpoint
 *
 * - Defines DTO
 * - Defines interface of response with DTO
 * - Contains factory class that converts DB layer entity to response
 */

export interface WorkerDTO extends HalResponse {
    id: string;
    simulationId: string;
    name: string;
    gender: Gender;
    numberOfWorkers: number;
    monthlyWage: number;
    monthlyBonus: number;
    percentageOfYearWorked: number;
    employeeTax: number;
    employerTax: number;
    _links: {
        self: Link;
    };
}

export interface WorkerListResponse extends CollectionResponse<{ workers: WorkerDTO[] }> {}
export interface WorkerResponse extends EntityResponse<WorkerDTO> {}

export class WorkerDTOFactory {
    public static fromEntity(entity: Worker): WorkerResponse {
        return mapEntityToDTO(entity);
    }

    public static fromCollection(
        collection: Worker[],
        count: number,
        paging: PagingParams<Worker>,
    ): WorkerListResponse {
        return {
            _embedded: {
                workers: collection.map(mapEntityToDTO),
            },
            _links: generatePaginationLinks(WORKER_LINKS.workers, count, paging),
            paging: { index: paging.index, size: paging.size, totalEntities: count, totalPages: Math.ceil(count / paging.size) },
        };
    }
}

const mapEntityToDTO = (entity: Worker): WorkerDTO => {
    return {
        id: entity.id,
        simulationId: entity.simulation.id,
        name: entity.name,
        gender: entity.gender,
        numberOfWorkers: entity.numberOfWorkers,
        monthlyWage: entity.monthlyWage,
        monthlyBonus: entity.monthlyBonus,
        percentageOfYearWorked: entity.percentageOfYearWorked,
        employeeTax: entity.employeeTax,
        employerTax: entity.employerTax,
        _links: {
            self: { href: resolveLink(WORKER_LINKS.worker, { workerId: entity.id }) },
        },
    };
};
