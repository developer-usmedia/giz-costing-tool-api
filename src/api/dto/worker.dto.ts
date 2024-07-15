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
        livingWageGapPerc: number;
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
            livingWageGapPerc: number;
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
    const originalLw = entity.original.livingWage();
    const scenarioLw = entity.livingWage();
    const remuneration = entity.remuneration;

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
            livingWageGap: originalLw?.livingWageGap,
            livingWageGapPerc: originalLw?.livingWageGapPerc,
            annualLivingWageGap: originalLw?.annualLivingWageGap,
            annualLivingWageGapAllWorkers: originalLw?.annualLivingWageGapAllWorkers,
        },
        scenario: {
            specification: {
                remunerationIncrease: entity.specs.remunerationIncrease,
                taxEmployee: entity.scenario.specs.taxEmployee,
                taxEmployer: entity.scenario.specs.taxEmployer,
                overheadCosts: entity.scenario.specs.overheadCosts,
            },
            distribution: entity.distro ?  {
                baseWagePerc: entity.distro.baseWagePerc,
                bonusesPerc: entity.distro.bonusesPerc,
                ikbPerc: entity.distro.ikbPerc,
                ikbHousingPerc: entity.distro.ikbHousingPerc,
                ikbFoodPerc: entity.distro.ikbFoodPerc,
                ikbTransportPerc: entity.distro.ikbTransportPerc,
                ikbHealthcarePerc: entity.distro.ikbHealthcarePerc,
                ikbChildcarePerc: entity.distro.ikbChildcarePerc,
                ikbChildEducationPerc: entity.distro.ikbChildEducationPerc,
            } : undefined,
            remuneration: remuneration ? {
                baseWage: remuneration.baseWage,
                bonuses: remuneration.bonuses,
                ikb: remuneration.ikb,
                ikbHousing: remuneration.ikbHousing,
                ikbFood: remuneration.ikbFood,
                ikbTransport: remuneration.ikbTransport,
                ikbHealthcare: remuneration.ikbHealthcare,
                ikbChildcare: remuneration.ikbChildcare,
                ikbChildEducation: remuneration.ikbChildEducation,
                total: remuneration.total(),
            }: undefined,
            livingWage: scenarioLw ? {
                livingWageGap: scenarioLw.livingWageGap,
                livingWageGapPerc: scenarioLw.livingWageGapPerc,
                annualLivingWageGap: scenarioLw.annualLivingWageGap,
                annualLivingWageGapAllWorkers: scenarioLw.annualLivingWageGapAllWorkers,
            }: undefined,
        },
        _links: {
            self: { href: resolveLink(WORKER_LINKS.worker, { workerId: entity.id }) },
        },
    };
};
