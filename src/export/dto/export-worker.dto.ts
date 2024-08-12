import { ScenarioWorker } from '@domain/entities';

export interface ExportWorkerDTO {
    name: string;
    gender: string;
    percOfYearWorked: string;
    nrOfWorkers: number;
    monthlyWage: string;
    monthlyBonus: string;
    monthlyIkb: string;
    monthylyRemuneration: string;
    benchmarkValue: string;
    livingWageGap: string;
    annualLivingWageGap: string;
    annualLivingWageGapAllWorkers: string;
    remunerationIncrease: string;
    baseWagePerc: string;
    baseWageIncrease: string;
    bonusesPerc: string;
    bonusesIncrease: string;
    ikbPerc: string;
    ikbIncrease: string;
}

export class ExportWorkerDTOFactory {
    public static fromEntity(entity: ScenarioWorker): ExportWorkerDTO {
        return mapEntityToDTO(entity);
    }
}

const mapEntityToDTO = (entity: ScenarioWorker): ExportWorkerDTO => {
    const distro = entity.calculationDistribution;
    const livingWage = entity.original.livingWage();

    return {
        name: entity.original.name,
        gender: entity.original.gender,
        percOfYearWorked: entity.original.percOfYearWorked.toFixed(2),
        nrOfWorkers: entity.original.nrOfWorkers,
        monthlyWage: entity.original.remuneration.baseWage.toDP(2).toString(),
        monthlyBonus: entity.original.remuneration.bonuses.toDP(2).toString(),
        monthlyIkb: entity.original.remuneration.ikb.toDP(2).toString(),
        monthylyRemuneration: entity.original.remuneration.total().toDP(2).toString(),
        benchmarkValue: entity.scenario.entry.benchmark.value.toFixed(2),
        livingWageGap: livingWage.livingWageGap.toDP(2).toString(),
        annualLivingWageGap: livingWage.annualLivingWageGap.toDP(2).toString(),
        annualLivingWageGapAllWorkers: livingWage.annualLivingWageGapAllWorkers.toDP(2).toString(),
        remunerationIncrease: entity.getRemunerationIncrease().toDP(2).toString(),
        baseWagePerc: distro.baseWagePerc.toFixed(2),
        baseWageIncrease: entity.remuneration.baseWage.minus(entity.original.remuneration.baseWage).toDP(2).toString(),
        bonusesPerc: distro.bonusesPerc.toFixed(2),
        bonusesIncrease: entity.remuneration.bonuses.minus(entity.original.remuneration.bonuses).toDP(2).toString(),
        ikbPerc: distro.ikbPerc.toFixed(2),
        ikbIncrease: entity.remuneration.ikb.minus(entity.original.remuneration.ikb).toDP(2).toString(),
    };
};
