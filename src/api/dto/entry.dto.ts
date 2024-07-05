import { generatePaginationLinks } from '@api/paging/generate-pagination-links';
import { resolveLink } from '@api/paging/link-resolver';
import { PagingParams } from '@api/paging/paging-params';
import { CollectionResponse, EntityResponse, HalResponse, Link } from '@api/paging/paging-response';
import { BuyerUnit, Entry, EntryStatus, ScenarioType } from '@domain/entities';
import { cleanObject } from '@domain/utils/cleaner';
import { ENTRY_LINKS } from './entry.links';

/**
 * API layer DTO used in the request response for entry endpoint
 *
 * - Defines DTO
 * - Defines interface of response with DTO
 * - Contains factory class that converts DB layer entity to response
 */

export interface EntryDTO extends HalResponse {
    id: string;
    status: EntryStatus;
    facility: {
        id?: string;
        name: string;
        country?: string;
        products?: string;
        production?: {
            unit: string;
            amount: number;
        };
    };
    matrix?: {
        id: string;
        verified: boolean;
    };
    payroll: {
        year: string;
        currencyCode: string;
        nrOfJobCategories: number;
        nrOfWorkers: number;
    };
    benchmark?: {
        year: string;
        source: string;
        region: string;
        locality: string;
        value: number;
    };
    livingWage?: {
        nrOfWorkersBelowLivingWage: number;
        avgLivingWageGap: number;
        largestLivingWageGap: number;
        annualFacilityLivingWageGap: number;
    };
    buyer?: {
        name: string;
        proportion: {
            amount: number;
            unit: BuyerUnit;
        };
        annualCosts?: {
            remunerationIncrease: number;
            taxCosts: number;
            overheadCosts: number;
            totalCosts: number;
            totalCostsPerUnit: number;
        };
    };
    scenario?: {
        type: ScenarioType;
        specification?: {
            taxEmployee: number;
            taxEmployer: number;
            overheadCosts: number;
            remunerationIncrease: number;
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
        livingWage?: {
            nrOfWorkersBelowLivingWage: number;
            avgLivingWageGap: number;
            largestLivingWageGap: number;
            annualFacilityLivingWageGap: number;
        };
        annualCosts?: {
            remunerationIncrease: number;
            taxCosts: number;
            additionalCosts: number;
            totalCosts: number;
            totalCostsPerUnit: number;
        };
    };
    createdAt: Date;
    updatedAt: Date;
    _links: {
        self: Link;
        workers: Link;
        // scenario
        // buyer
        // report
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
    const dto: EntryDTO = {
        id: entity.id,
        status: entity.status,
        facility: {
            name: entity.facility.name,
            id: entity.facility.facilityId,
            country: entity.facility.country,
            products: entity.facility.products,
            production: {
                unit: entity.facility.productionUnit,
                amount: entity.facility.productionAmount,
            },
        },
        matrix: {
            id: entity.matrixId,
            verified: entity.matrixVerified,
        },
        payroll: {
            year: entity.payroll.year.toString(),
            currencyCode: entity.payroll.currencyCode,
            nrOfJobCategories: entity.payroll.nrOfJobCategories,
            nrOfWorkers: entity.payroll.nrOfWorkers,
        },
        benchmark: {
            year: entity.benchmark.year?.toString(),
            source: entity.benchmark.source,
            region: entity.benchmark.region,
            locality: entity.benchmark.locality,
            value: entity.benchmark.value,
        },
        livingWage: {
            nrOfWorkersBelowLivingWage: entity.payroll.nrOfWorkersWithLWGap,
            avgLivingWageGap: entity.payroll.avgLivingWageGap,
            largestLivingWageGap: entity.payroll.largestLivingWageGap,
            annualFacilityLivingWageGap: entity.payroll.sumAnnualLivingWageGapAllWorkers,
        },
        buyer: {
            name: entity.buyer.name,
            proportion: {
                unit: entity.buyer.unit,
                amount: entity.buyer.amount,
            },
        },
        scenario: entity.scenario ? {
            type: entity.scenario?.type,
            specification: {
                taxEmployee: entity.scenario.specs.taxEmployee,
                taxEmployer: entity.scenario.specs.taxEmployer,
                overheadCosts: entity.scenario.specs.overheadCosts,
                remunerationIncrease: entity.scenario.specs.remunerationIncrease,
            },
            distribution: entity.scenario?.distro ? {
                baseWagePerc: entity.scenario.distro.baseWagePerc,
                bonusesPerc: entity.scenario.distro.bonusesPerc,
                ikbPerc: entity.scenario.distro.ikbPerc,
                ikbHousingPerc: entity.scenario.distro.ikbHousingPerc,
                ikbFoodPerc: entity.scenario.distro.ikbFoodPerc,
                ikbTransportPerc: entity.scenario.distro.ikbTransportPerc,
                ikbHealthcarePerc: entity.scenario.distro.ikbHealthcarePerc,
                ikbChildcarePerc: entity.scenario.distro.ikbChildcarePerc,
                ikbChildEducationPerc: entity.scenario.distro.ikbChildEducationPerc,
            }: undefined,
            livingWage: {
                nrOfWorkersBelowLivingWage: entity.scenario.payroll.nrOfWorkersWithLWGap,
                avgLivingWageGap: entity.scenario.payroll.avgLivingWageGap,
                largestLivingWageGap: entity.scenario.payroll.largestLivingWageGap,
                annualFacilityLivingWageGap: entity.scenario.payroll.sumAnnualLivingWageGapAllWorkers,
            },
            // TODO: Annual Costs
        } : undefined,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        _links: {
            self: { href: resolveLink(ENTRY_LINKS.entry, { entryId: entity.id }) },
            workers: { href: resolveLink(ENTRY_LINKS.workers, { entryId: entity.id }) },
        },
    };

    // TODO fix: cleanObject removes the
    return cleanObject(dto);
};
