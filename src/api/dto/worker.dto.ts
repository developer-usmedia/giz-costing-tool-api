/* eslint-disable @typescript-eslint/no-empty-object-type */
import { generatePaginationLinks } from '@api/paging/generate-pagination-links';
import { resolveLink } from '@api/paging/link-resolver';
import { PagingParams } from '@api/paging/paging-params';
import { CollectionResponse, EntityResponse, HalResponse, Link } from '@api/paging/paging-response';
import { Gender, ScenarioWorker } from '@domain/entities';
import { WORKER_LINKS } from './worker.links';

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
    const originalRemuneration = entity.original.remuneration;
    const scenarioRemuneration = entity.remuneration;

    return {
        id: entity.id,
        entryId: entity.original.entry.id,
        name: entity.original.name,
        gender: entity.original.gender,
        nrOfWorkers: entity.original.nrOfWorkers,
        percOfYearWorked: entity.original.percOfYearWorked,
        remuneration: originalRemuneration ? {
            baseWage: originalRemuneration.baseWage.toNumber(),
            bonuses: originalRemuneration.bonuses.toNumber(),
            ikb: originalRemuneration.ikb.toNumber(),
            total: originalRemuneration.total().toNumber(),
        } : undefined,
        livingWage: originalLw ? {
            livingWageGap: originalLw.livingWageGap.toNumber(),
            livingWageGapPerc: originalLw.livingWageGapPerc.toNumber(),
            annualLivingWageGap: originalLw.annualLivingWageGap.toNumber(),
            annualLivingWageGapAllWorkers: originalLw.annualLivingWageGapAllWorkers.toNumber(),
        } : undefined,
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
            remuneration: scenarioRemuneration ? {
                baseWage: scenarioRemuneration.baseWage.toNumber(),
                bonuses: scenarioRemuneration.bonuses.toNumber(),
                ikb: scenarioRemuneration.ikb.toNumber(),
                total: scenarioRemuneration.total().toNumber(),
            }: undefined,
            livingWage: scenarioLw ? {
                livingWageGap: scenarioLw.livingWageGap?.toNumber(),
                livingWageGapPerc: scenarioLw.livingWageGapPerc?.toNumber(),
                annualLivingWageGap: scenarioLw.annualLivingWageGap?.toNumber(),
                annualLivingWageGapAllWorkers: scenarioLw.annualLivingWageGapAllWorkers?.toNumber(),
            }: undefined,
        },
        _links: {
            self: { href: resolveLink(WORKER_LINKS.worker, { workerId: entity.id }) },
        },
    };
};
