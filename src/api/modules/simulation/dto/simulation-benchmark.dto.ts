import { SimulationBenchmark } from '@domain/embeddables/simulation-benchmark.embed';

export interface SimulationBenchmarkDTO {
    year: number;
    source: string;
    locality: string;
    region: string;
    currencyCode: string;
    currencyName: string;
    localValue: number;
}

export class SimulationBenchmarkDTOFactory {
    public static fromEntity(entity: SimulationBenchmark): SimulationBenchmarkDTO {
        return mapEntityToDTO(entity);
    }
}

const mapEntityToDTO = (entity: SimulationBenchmark): SimulationBenchmarkDTO => {
    return {
        year: entity.year,
        source: entity.source,
        locality: entity.locality,
        region: entity.region,
        currencyCode: entity.currencyCode,
        currencyName: entity.currencyName,
        localValue: entity.localValue,
    };
};
