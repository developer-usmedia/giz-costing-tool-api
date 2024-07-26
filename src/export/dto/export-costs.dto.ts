import { Entry } from '@domain/entities';

export interface ExportCostsDTO {
    facility: {
        remunerationIncrease: string;
        taxCosts: string;
        overheadCosts: string;
        totalCosts: string;
        totalCostsPerUnit: string;
        productionAmount: string;
    };
    buyer: {
        remunerationIncrease: string;
        taxCosts: string;
        overheadCosts: string;
        totalCosts: string;
        totalCostsPerUnit: string;
        amount: string;
    };
}

export class ExportCostsDTOFactory {
    public static fromEntity(entity: Entry): ExportCostsDTO {
        return mapEntityToDTO(entity);
    }
}

const mapEntityToDTO = (entity: Entry): ExportCostsDTO => {
    const facilityReport = entity.scenario.report;
    const buyerReport = entity.scenario.getBuyerReport();

    return {
        facility: {
            remunerationIncrease: facilityReport.remunerationIncrease?.toFixed(2),
            taxCosts: facilityReport.taxCosts?.toFixed(2),
            overheadCosts: facilityReport.overheadCosts?.toFixed(2),
            totalCosts: facilityReport.totalCosts?.toFixed(2),
            totalCostsPerUnit: facilityReport.totalCostsPerUnit.toString(),
            productionAmount: entity.facility.productionAmount?.toFixed(2),
        },
        buyer: {
            remunerationIncrease: buyerReport.remunerationIncrease.toFixed(2),
            taxCosts: buyerReport.taxCosts.toFixed(2),
            overheadCosts: buyerReport.overheadCosts.toFixed(2),
            totalCosts: buyerReport.totalCosts.toFixed(2),
            totalCostsPerUnit: buyerReport.totalCostsPerUnit.toFixed(2),
            amount: entity.buyer.amount?.toFixed(2),
        },
    };
};
