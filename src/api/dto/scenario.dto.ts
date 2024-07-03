import { HalResponse } from '@api/paging/paging-response';
import { Scenario, ScenarioType } from '@domain/entities';

// TODO: This DTO needs an update
export interface ScenarioDTO extends HalResponse {
    id: string;
    type: ScenarioType;
    entryId: string;
    specifications: {
        employeeTax: number;
        employerTax: number;
        absoluteIncrease: number;
    };
    distributions?: Record<string, any>; // Implemented later
    calculations?: {
        // TODO: implemented & verified later-> data is used in report page
        wageGap: number;
        labourCosts: number;
        overheadCosts: number;
        totalAdditionalCosts: number;
        additionalCostsPerUnit: number;
        employeesBelowLw: number;
        averageLwGap: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export class ScenarioDTOFactory {
    public static fromEntity(entity: Scenario): ScenarioDTO {
        return mapEntityToDTO(entity);
    }
}

const mapEntityToDTO = (entity: Scenario): ScenarioDTO => {
    if (!entity) return null;

    const specs = entity.specs;

    return {
        id: entity.id,
        type: entity.type,
        entryId: entity.entry.id,
        specifications: {
            employeeTax: specs.taxEmployee,
            employerTax: specs.taxEmployer,
            absoluteIncrease: specs.remunerationIncrease,
        },
        distributions: null,
        calculations: null,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        _links: {
            self: { href: 'TODO' },
        },
    };
};
