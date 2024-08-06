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
        monthlyWage: entity.original.remuneration.baseWage.toFixed(2),
        monthlyBonus: entity.original.remuneration.bonuses.toFixed(2),
        monthlyIkb: entity.original.remuneration.ikb.toFixed(2),
        monthylyRemuneration: entity.original.remuneration.total().toFixed(2),
        benchmarkValue: entity.scenario.entry.benchmark.value.toFixed(2),
        livingWageGap: livingWage.livingWageGap.toFixed(2),
        annualLivingWageGap: livingWage.annualLivingWageGap.toFixed(2),
        annualLivingWageGapAllWorkers: livingWage.annualLivingWageGapAllWorkers.toFixed(2),
        remunerationIncrease: entity.getRemunerationIncrease().toFixed(2),
        baseWagePerc: distro.baseWagePerc.toFixed(2),
        baseWageIncrease: entity.remuneration.baseWage.minus(entity.original.remuneration.baseWage).toFixed(2),
        bonusesPerc: distro.bonusesPerc.toFixed(2),
        bonusesIncrease: entity.remuneration.bonuses.minus(entity.original.remuneration.bonuses).toFixed(2),
        ikbPerc: distro.ikbPerc.toFixed(2),
        ikbIncrease: entity.remuneration.ikb.minus(entity.original.remuneration.ikb).toFixed(2),
    };
};
