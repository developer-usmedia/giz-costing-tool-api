import { EntryBenchmark } from '@domain/embeddables/entry-benchmark.embed';

export interface EntryBenchmarkDTO {
    year: number;
    source: string;
    region: string;
    currencyCode: string;
    currencyName: string;
    localValue: number;
}

export class EntryBenchmarkDTOFactory {
    public static fromEntity(entity: EntryBenchmark): EntryBenchmarkDTO {
        return mapEntityToDTO(entity);
    }
}

const mapEntityToDTO = (entity: EntryBenchmark): EntryBenchmarkDTO => {
    return {
        year: entity.year,
        source: entity.source,
        region: entity.region,
        currencyCode: entity.currencyCode,
        currencyName: entity.currencyName,
        localValue: entity.localValue,
    };
};
