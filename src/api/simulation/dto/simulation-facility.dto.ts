import { SimulationFacility } from '@database/embeddables';

export interface SimulationFacilityDTO {
    id: string;
    name: string;
    countryCode: string;
    currencyCode: string;
    product: string;
    unitOfProduction: string;
    annualProduction: number;
    buyerName: string;
    buyerProportion: number;
}

export class SimulationFacilityDTOFactory {
    public static fromEntity(entity: SimulationFacility): SimulationFacilityDTO {
        return mapEntityToDTO(entity);
    }
}

const mapEntityToDTO = (entity: SimulationFacility): SimulationFacilityDTO => {
    return {
        id: entity.id,
        name: entity.name,
        countryCode: entity.countryCode,
        currencyCode: entity.currencyCode,
        product: entity.product,
        unitOfProduction: entity.unitOfProduction,
        annualProduction: entity.annualProduction,
        buyerName: entity.buyerName,
        buyerProportion: entity.buyerProportion,
    };
};
