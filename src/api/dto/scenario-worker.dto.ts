import { generatePaginationLinks } from '@api/paging/generate-pagination-links';
import { resolveLink } from '@api/paging/link-resolver';
import { PagingParams } from '@api/paging/paging-params';
import { CollectionResponse, EntityResponse, HalResponse, Link } from '@api/paging/paging-response';
import { ScenarioWorker } from '@domain/entities/scenario-worker.entity';
import { SCENARIO_WORKER_LINKS } from './scenario-worker.links';

/**
 * API layer DTO used in the request response for the scenario workers endpoint
 *
 * - Defines DTO
 * - Defines interface of response with DTO
 * - Contains factory class that converts DB layer entity to response
 */

export interface ScenarioWorkerDTO extends HalResponse {
    id: string;
    scenarioId: string;
    name: string;
    monthlyWage: number;
    monthlyBonus: number;
    inKindBenefits: {
        ikbFood: number;
        ikbTransportation: number;
        ikbHousing: number;
        ikbHealthcare: number;
        ikbChildcare: number;
    };
    totalTakeHomeInvidual: number;
    takeHomeAbsoluteIncreaseInvidual: number;
    // TODO: Koen finalize keys
    additionalCosts: number;
    additionalCostsWage: number;
    additionalCostsBonus: number;
    additionalCostsIkb: {
        totalCosts: number;
        ikbFood: number;
        ikbTransportation: number;
        ikbHousing: number;
        ikbHealthcare?: number;
        ikbChildcare: number;
    };
    remainingAbsoluteGap: number;
    remainingNumberBelowLW: number;
    _links: {
        self: Link;
    };
}

// TODO: Add more original worker information?

export interface ScenarioWorkerListResponse extends CollectionResponse<{ workers: ScenarioWorkerDTO[] }> {}
export interface ScenarioWorkerResponse extends EntityResponse<ScenarioWorkerDTO> {}

export class ScenarioWorkerDTOFactory {
    public static fromEntity(entity: ScenarioWorker): ScenarioWorkerResponse {
        return mapEntityToDTO(entity);
    }

    public static fromCollection(
        collection: ScenarioWorker[],
        count: number,
        paging: PagingParams<ScenarioWorker>,
    ): ScenarioWorkerListResponse {
        return {
            _embedded: {
                workers: collection.map(mapEntityToDTO),
            },
            _links: generatePaginationLinks(SCENARIO_WORKER_LINKS.workers, count, paging),
            paging: {
                index: paging.index,
                size: paging.size,
                totalEntities: count,
                totalPages: Math.ceil(count / paging.size),
            },
        };
    }
}

const mapEntityToDTO = (entity: ScenarioWorker): ScenarioWorkerDTO => {
    return {
        id: entity.id,
        scenarioId: entity.scenario.id,
        name: entity.original.name,
        monthlyWage: entity.monthlyWage,
        monthlyBonus: entity.monthlyBonus,
        inKindBenefits: entity.inKindBenefits,
        totalTakeHomeInvidual: entity.totalRenumeration,
        takeHomeAbsoluteIncreaseInvidual: entity.remunerationIncrease,
        additionalCosts: entity.totalAdditionalCosts,
        additionalCostsWage: entity.additionalCostsWage,
        additionalCostsBonus: entity.additionalCostsBonus,
        additionalCostsIkb: entity.additionalCostsIkb,
        remainingAbsoluteGap: entity.remainingAbsoluteGap,
        remainingNumberBelowLW: entity.remainingNumberBelowLW,
        _links: {
            self: {
                href: resolveLink(SCENARIO_WORKER_LINKS.worker, {
                    scenarioId: entity.scenario.id,
                    workerId: entity.id,
                }),
            },
        },
    };
};
