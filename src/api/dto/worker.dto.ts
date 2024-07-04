import { generatePaginationLinks } from '@api/paging/generate-pagination-links';
import { resolveLink } from '@api/paging/link-resolver';
import { PagingParams } from '@api/paging/paging-params';
import { CollectionResponse, EntityResponse, HalResponse, Link } from '@api/paging/paging-response';
import { Gender, ScenarioWorker } from '@domain/entities';
import { WORKER_LINKS } from './worker.links';

// TODO: split into two EntryWorker & ScenarioWorker?

/**
 * API layer DTO used in the request response for the workers endpoint
 *
 * - Defines DTO
 * - Defines interface of response with DTO
 * - Contains factory class that converts DB layer entity to response
 */

export interface WorkerDTO extends HalResponse {
    id: string;
    entryId: string;
    name: string;
    gender: Gender;
    nrOfWorkers: number;
    percOfYearWorked: number;
    remuneration?: {
        baseWage: number;
        bonuses: number;
        ikb: number;
        ikbHousing: number;
        ikbFood: number;
        ikbTransport: number;
        ikbHealthcare: number;
        ikbChildcare: number;
        ikbChildEducation: number;
        total: number;
    };
    livingWage?: {
        livingWageGap: number;
        annualLivingWageGap: number;
        annualLivingWageGapAllWorkers: number;
    };
    scenario?: {
        specification?: {
            remunerationIncrease: number;
            taxEmployee: number;
            taxEmployer: number;
            overheadCosts: number;
        };
        distribution?: {
            baseWagePerc: number;
            bonusesPerc: number;
            ikbPerc: number;
            ikbHousingPerc: number;
            ikbFoodPerc: number;
            ikbTransportPerc: number;
            ikbHealthcarePerc: number;
            ikbChildcarePerc: number;
            ikbChildEducationPerc: number;
        };
        remuneration?: {
            baseWage: number;
            bonuses: number;
            ikb: number;
            ikbHousing: number;
            ikbFood: number;
            ikbTransport: number;
            ikbHealthcare: number;
            ikbChildcare: number;
            ikbChildEducation: number;
            total: number;
        };
        livingWage?: {
            livingWageGap: number;
            annualLivingWageGap: number;
            annualLivingWageGapAllWorkers: number;
        };
    };
    _links: {
        self: Link;
    };
}

export interface WorkerListResponse extends CollectionResponse<{ workers: WorkerDTO[] }> {}
export interface WorkerResponse extends EntityResponse<WorkerDTO> {}

export class WorkerDTOFactory {
    public static fromEntity(entity: ScenarioWorker): WorkerResponse {
        return mapEntityToDTO(entity);
    }

    public static fromCollection(
        collection: ScenarioWorker[],
        count: number,
        paging: PagingParams<ScenarioWorker>,
    ): WorkerListResponse {
        return {
            _embedded: {
                workers: collection.map(mapEntityToDTO),
            },
            _links: generatePaginationLinks(WORKER_LINKS.workers, count, paging),
            paging: {
                index: paging.index,
                size: paging.size,
                totalEntities: count,
                totalPages: Math.ceil(count / paging.size),
            },
        };
    }
}

const mapEntityToDTO = (entity: ScenarioWorker): WorkerDTO => {
    return {
        id: entity.id,
        entryId: entity.original.entry.id,
        name: entity.original.name,
        gender: entity.original.gender,
        nrOfWorkers: entity.original.nrOfWorkers,
        percOfYearWorked: entity.original.percOfYearWorked,
        remuneration: {
            baseWage: entity.original.remuneration.baseWage,
            bonuses: entity.original.remuneration.bonuses,
            ikb: entity.original.remuneration.ikb,
            ikbHousing: entity.original.remuneration.ikbHousing,
            ikbFood: entity.original.remuneration.ikbFood,
            ikbTransport: entity.original.remuneration.ikbTransport,
            ikbHealthcare: entity.original.remuneration.ikbHealthcare,
            ikbChildcare: entity.original.remuneration.ikbChildcare,
            ikbChildEducation: entity.original.remuneration.ikbChildEducation,
            total: entity.original.remuneration.baseWage,
        },
        livingWage: {
            livingWageGap: entity.livingWage().livingWageGap,
            annualLivingWageGap: entity.livingWage().annualLivingWageGap,
            annualLivingWageGapAllWorkers: entity.livingWage().annualLivingWageGapAllWorkers,
        },
        scenario: {
            specification: {
                remunerationIncrease: entity.scenario.specs.remunerationIncrease,
                taxEmployee: entity.scenario.specs.taxEmployee,
                taxEmployer: entity.scenario.specs.taxEmployer,
                overheadCosts: entity.scenario.specs.overheadCosts,
            },
            distribution: {
                baseWagePerc: entity.scenario.distro.baseWagePerc,
                bonusesPerc: entity.scenario.distro.bonusesPerc,
                ikbPerc: entity.scenario.distro.ikbPerc,
                ikbHousingPerc: entity.scenario.distro.ikbHousingPerc,
                ikbFoodPerc: entity.scenario.distro.ikbFoodPerc,
                ikbTransportPerc: entity.scenario.distro.ikbTransportPerc,
                ikbHealthcarePerc: entity.scenario.distro.ikbHealthcarePerc,
                ikbChildcarePerc: entity.scenario.distro.ikbChildcarePerc,
                ikbChildEducationPerc: entity.scenario.distro.ikbChildEducationPerc,
            },
            remuneration: {
                baseWage: entity.remuneration().baseWage,
                bonuses: entity.remuneration().bonuses,
                ikb: entity.remuneration().ikb,
                ikbHousing: entity.remuneration().ikbHousing,
                ikbFood: entity.remuneration().ikbFood,
                ikbTransport: entity.remuneration().ikbTransport,
                ikbHealthcare: entity.remuneration().ikbHealthcare,
                ikbChildcare: entity.remuneration().ikbChildcare,
                ikbChildEducation: entity.remuneration().ikbChildEducation,
                total: entity.remuneration().total(),
            },
        },
        _links: {
            self: { href: resolveLink(WORKER_LINKS.worker, { workerId: entity.id }) },
        },
    };
};
