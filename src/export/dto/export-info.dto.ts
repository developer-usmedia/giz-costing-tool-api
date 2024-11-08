import { Entry } from '@domain/entities';

export interface ExportInfoDTO {
    entryId: string;
    matrixId: string;
    facilityId: string;
    facilityName: string;
    facilityCountryCode: string;
    currency: string;
    products: string;
    productionAmount: string;
    productionUnit: string;
    year: number;
    benchmarkYear: number;
    benchmarkValue: string;
    benchmarkRegion: string;
    nrOfJobCategories: number;
    nrOfWorkers: number;
    nrOfWorkersWithLwGap: number;
}

export class ExportInfoDTOFactory {
    public static fromEntity(entity: Entry): ExportInfoDTO {
        return mapEntityToDTO(entity);
    }
}

const mapEntityToDTO = (entity: Entry): ExportInfoDTO => {
    return {
        entryId: entity.id,
        matrixId: entity.matrixId,
        facilityId: entity.facility.facilityId,
        facilityName: entity.facility.name,
        facilityCountryCode: entity.facility.countryCode,
        currency: entity.payroll.currencyCode,
        products: entity.facility.products,
        productionAmount: entity.facility.productionAmount.toFixed(2),
        productionUnit: entity.facility.productionUnit,
        year: entity.payroll.year,
        benchmarkYear: entity.benchmark.year,
        benchmarkValue: entity.benchmark.value.toFixed(2),
        benchmarkRegion: entity.benchmark.region,
        nrOfJobCategories: entity.payroll.nrOfJobCategories,
        nrOfWorkers: entity.payroll.nrOfWorkers,
        nrOfWorkersWithLwGap: entity.payroll.nrOfWorkersWithLWGap,
    };
};
