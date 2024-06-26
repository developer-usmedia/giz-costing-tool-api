import { HalResponse } from '@api/paging/paging-response';
import { Scenario } from '@domain/entities/scenario.entity';
import { ScenarioType } from '@domain/enums/scenario-type.enum';

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
    createdAt: Date;
    updatedAt: Date;
}

export class ScenarioDTOFactory {
    public static fromEntity(entity: Scenario): ScenarioDTO {
        return mapEntityToDTO(entity);
    }
}

const mapEntityToDTO = (entity: Scenario): ScenarioDTO => {
    if(!entity) return null;
    
    const specs = entity.specifications;

    return {
        id: entity.id,
        type: entity.type,
        entryId: entity.entry.id,
        specifications: {
            employeeTax: specs.employeeTax,
            employerTax: specs.employerTax,
            absoluteIncrease: specs.absoluteIncrease,
        },
        distributions: null,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        _links: {
            self: { href: 'TODO' },
        },
    };
};
