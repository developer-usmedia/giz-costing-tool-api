import { Gender } from '@common/enums/gender.enum';
import { environment } from '@common/environment/environment';
import { generatePaginationLinks } from '@common/paging/generate-pagination-links';
import { PagingParams } from '@common/paging/paging-params';
import { EntityResponse, PagedEntityResponse } from '@common/paging/paging-response';
import { Worker } from '@database/entities';

/**
 * API layer DTO used in the request response for the workers endpoint
 *
 * - Defines DTO
 * - Defines interface of response with DTO
 * - Contains factory class that converts DB layer entity to response
 */

export interface WorkerDTO {
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
}

export interface WorkerListResponse extends PagedEntityResponse<'workers', WorkerDTO> {}
export interface WorkerResponse extends EntityResponse<'worker', WorkerDTO> {}

export class WorkerDTOFactory {
    public static fromEntity(entity: Worker): WorkerResponse {
        return {
            worker: mapEntityToDTO(entity),
        };
    }

    public static fromCollection(collection: Worker[], count: number, paging: PagingParams<Worker>): WorkerListResponse {
        const workerCollection = new URL(environment.api.url + '/api/workers');

        return {
            workers: collection.map(mapEntityToDTO),
            links: generatePaginationLinks(workerCollection, count, paging),
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
    };
};
