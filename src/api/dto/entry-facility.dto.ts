import { EntryFacility } from '@domain/embeddables/entry-facility.embed';

export interface EntryFacilityDTO {
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

export class EntryFacilityDTOFactory {
    public static fromEntity(entity: EntryFacility): EntryFacilityDTO {
        return mapEntityToDTO(entity);
    }
}

const mapEntityToDTO = (entity: EntryFacility): EntryFacilityDTO => {
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
