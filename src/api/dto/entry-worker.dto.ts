
import { generatePaginationLinks } from '@api/paging/generate-pagination-links';
import { resolveLink } from '@api/paging/link-resolver';
import { PagingParams } from '@api/paging/paging-params';
import { CollectionResponse, EntityResponse, HalResponse, Link } from '@api/paging/paging-response';
import { EntryWorker } from '@domain/entities/entry-worker.entity';
import { Gender } from '@domain/enums/gender.enum';
import { ENTRY_WORKER_LINKS } from './entry-worker.links';

/**
 * API layer DTO used in the request response for the workers endpoint
 *
 * - Defines DTO
 * - Defines interface of response with DTO
 * - Contains factory class that converts DB layer entity to response
 */

export interface EntryWorkerDTO extends HalResponse {
    id: string;
    entryId: string;
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

export interface EntryWorkerListResponse extends CollectionResponse<{ workers: EntryWorkerDTO[] }> {}
export interface EntryWorkerResponse extends EntityResponse<EntryWorkerDTO> {}

export class EntryWorkerDTOFactory {
    public static fromEntity(entity: EntryWorker): EntryWorkerResponse {
        return mapEntityToDTO(entity);
    }

    public static fromCollection(
        collection: EntryWorker[],
        count: number,
        paging: PagingParams<EntryWorker>,
    ): EntryWorkerListResponse {
        return {
            _embedded: {
                workers: collection.map(mapEntityToDTO),
            },
            _links: generatePaginationLinks(ENTRY_WORKER_LINKS.workers, count, paging),
            paging: { index: paging.index, size: paging.size, totalEntities: count, totalPages: Math.ceil(count / paging.size) },
        };
    }
}

const mapEntityToDTO = (entity: EntryWorker): EntryWorkerDTO => {
    return {
        id: entity.id,
        entryId: entity.entry.id,
        name: entity.name,
        gender: entity.gender,
        numberOfWorkers: entity.numberOfWorkers,
        monthlyWage: entity.monthlyWage,
        monthlyBonus: entity.monthlyBonus,
        percentageOfYearWorked: entity.percentageOfYearWorked,
        employeeTax: entity.employeeTax,
        employerTax: entity.employerTax,
        _links: {
            self: { href: resolveLink(ENTRY_WORKER_LINKS.worker, { workerId: entity.id }) },
        },
    };
};
