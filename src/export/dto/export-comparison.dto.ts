import { Entry } from '@domain/entities';

export interface ExportComparisonDTO {
    facility: {
        nrOfWorkersBelowLwGap: string;
        avgLivingWageGap: string;
        sumAnnualLivingWageGapAllWorkers: string;
    };
    scenario: {
        nrOfWorkersWithBelowLwGap: string;
        avgLivingWageGap: string;
        sumAnnualLivingWageGapAllWorkers: string;
    };
}

export class ExportComparisonDTOFactory {
    public static fromEntity(entity: Entry): ExportComparisonDTO {
        return mapEntityToDTO(entity);
    }
}

const mapEntityToDTO = (entity: Entry): ExportComparisonDTO => {
    return {
        facility: {
            nrOfWorkersBelowLwGap: entity.payroll.nrOfWorkersWithLWGap.toFixed(2),
            avgLivingWageGap: entity.payroll.avgLivingWageGap.toFixed(2),
            sumAnnualLivingWageGapAllWorkers: entity.payroll.sumAnnualLivingWageGapAllWorkers.toFixed(2),
        },
        scenario: {
            nrOfWorkersWithBelowLwGap: entity.scenario.payroll.nrOfWorkersWithLWGap.toFixed(2),
            avgLivingWageGap: entity.scenario.payroll.avgLivingWageGap.toFixed(2),
            sumAnnualLivingWageGapAllWorkers: entity.scenario.payroll.sumAnnualLivingWageGapAllWorkers.toFixed(2),
        },
    };
};
