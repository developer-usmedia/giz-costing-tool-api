
import { generatePaginationLinks } from '@api/paging/generate-pagination-links';
import { resolveLink } from '@api/paging/link-resolver';
import { PagingParams } from '@api/paging/paging-params';
import { CollectionResponse, EntityResponse, HalResponse, Link } from '@api/paging/paging-response';
import { Entry } from '@domain/entities/entry.entity';
import { EntryBenchmarkDTO, EntryBenchmarkDTOFactory } from './entry-benchmark.dto';
import { EntryFacilityDTO, EntryFacilityDTOFactory } from './entry-facility.dto';
import { ENTRY_LINKS } from './entry.links';
import { ScenarioDTO, ScenarioDTOFactory } from './scenario.dto';

/**
 * API layer DTO used in the request response for entry endpoint
 *
 * - Defines DTO
 * - Defines interface of response with DTO
 * - Contains factory class that converts DB layer entity to response
 */

export interface EntryDTO extends HalResponse {
    id: string;
    matrixId: string;
    verified: boolean;
    year: string;
    status: string;
    administrativeCosts: number;
    defaultEmployerTax: number;
    defaultEmployeeTax: number;
    facility: EntryFacilityDTO;
    benchmark: EntryBenchmarkDTO;
    scenario: ScenarioDTO;
    nrOfJobcategories: number;
    nrOfWorkers: number;
    nrOfWorkersBelowLW: number;
    averageLwGap: number;
    largestLwGap: number;
    createdAt: Date;
    updatedAt: Date;
    _links: {
        self: Link;
        workers: Link;
    };
}

export interface EntryListResponse extends CollectionResponse<{ entries: EntryDTO[] }> {}
export interface EntryResponse extends EntityResponse<EntryDTO> {}

export class EntryDTOFactory {
    public static fromEntity(entity: Entry): EntryResponse {
        return mapEntityToDTO(entity);
    }

    public static fromCollection(
        collection: Entry[],
        count: number,
        paging: PagingParams<Entry>,
    ): EntryListResponse {
        return {
            _embedded: { entries: collection.map(mapEntityToDTO) },
            _links: generatePaginationLinks(ENTRY_LINKS.entries, count, paging),
            paging: { index: paging.index, size: paging.size, totalEntities: count, totalPages: Math.ceil(count / paging.size) },
        };
    }
}

const mapEntityToDTO = (entity: Entry): EntryDTO => {
    return {
        id: entity.id,
        matrixId: entity.matrixId,
        verified: false,
        year: entity.year.toString(),
        status: entity.status,
        administrativeCosts: entity.administrativeCosts,
        defaultEmployeeTax: entity.defaultEmployeeTax,
        defaultEmployerTax: entity.defaultEmployerTax,
        facility: EntryFacilityDTOFactory.fromEntity(entity.facility),
        benchmark: EntryBenchmarkDTOFactory.fromEntity(entity.benchmark),
        scenario: ScenarioDTOFactory.fromEntity(entity.scenario),
        nrOfWorkers: entity.getNOfWorkers(),
        nrOfJobcategories: entity.getNOfJobCategories(),
        nrOfWorkersBelowLW: entity.getNOfWorkersBelowLW(),
        averageLwGap: entity.averageLwGap,
        largestLwGap: entity.largestLwGap,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        _links: {
            self: { href: resolveLink(ENTRY_LINKS.entry, { entryId: entity.id }) },
            workers: { href: resolveLink(ENTRY_LINKS.workers, { entryId: entity.id }) },
        },
    };
};
