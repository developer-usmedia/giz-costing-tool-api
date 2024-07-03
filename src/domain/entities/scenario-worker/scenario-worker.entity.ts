import { Embedded, Entity, ManyToOne } from '@mikro-orm/core';

import {
    AbstractEntity,
    EntryWorker,
    EntryWorkerRemuneration,
    Scenario,
    ScenarioDistribution,
    ScenarioSpecification,
    ScenarioWorkerDistribution,
    ScenarioWorkerDistributionProps,
    ScenarioWorkerSpecification,
    ScenarioWorkerSpecificationProps,
} from '@domain/entities';

export interface ScenarioWorkerProps {
    scenario: Scenario;
    worker: EntryWorker;
    specs?: ScenarioWorkerSpecification;
    distro?: ScenarioWorkerDistribution;
}

@Entity()
export class ScenarioWorker extends AbstractEntity<ScenarioWorker> {
    @ManyToOne(() => Scenario, { deleteRule: 'cascade', eager: true })
    private readonly _scenario: Scenario;

    @ManyToOne(() => EntryWorker, { deleteRule: 'cascade', eager: true })
    private readonly _original: EntryWorker;

    @Embedded({ entity: () => ScenarioWorkerSpecification, prefix: 'specs_' })
    private _specs: ScenarioWorkerSpecification;

    @Embedded({ entity: () => ScenarioWorkerDistribution, prefix: 'distro_' })
    private _distro: ScenarioWorkerDistribution;

    private remunerationResult: null | {
        baseWage: number;
        bonuses: number;
        ikbHousing: number;
        ikbFood: number;
        ikbTransport: number;
        ikbHealthcare: number;
        ikbChildcare: number;
        ikbChildEducation: number;
    };

    private livingWageResult: null | {
        livingWageGap: number;
        annualLivingWageGap: number;
        annualLivingWageGapAllWorkers: number;
    };

    constructor(props: ScenarioWorkerProps) {
        super();

        this._scenario = props.scenario;
        this._original = props.worker;
        this._specs = new ScenarioWorkerSpecification(props.specs);
        this._distro = new ScenarioWorkerDistribution(props.distro);
    }

    get scenario() {
        return this._scenario;
    }

    get original() {
        return this._original;
    }

    get specs() {
        return this._specs;
    }

    get distro() {
        return this._distro;
    }

    public updateSpecs(specs: ScenarioWorkerSpecificationProps) {
        this._specs = new ScenarioWorkerSpecification(specs);
    }

    public updateDistro(distro: ScenarioWorkerDistributionProps) {
        this._distro = new ScenarioWorkerDistribution(distro);
    }

    public remuneration(): EntryWorkerRemuneration {
        if (this.remunerationResult !== undefined) {
            return new EntryWorkerRemuneration(this.remunerationResult);
        }

        this.calculate();
        return new EntryWorkerRemuneration(this.remunerationResult);
    }

    public livingWage() {
        if (this.livingWageResult !== undefined) {
            return this.livingWageResult;
        }

        this.calculate();
        return this.livingWageResult;
    }

    public calculate() {
        if (this.scenario.entry.status !== 'COMPLETED') {
            this.remunerationResult = null;
            this.livingWageResult = null;
            return;
        }

        this.calculateRemuneration();
        this.calculateLivingWage();
    }

    private calculateRemuneration() {
        this.remunerationResult = {
            baseWage: this._original.remuneration.baseWage,
            bonuses: this._original.remuneration.bonuses,
            ikbHousing: this._original.remuneration.ikbHousing,
            ikbFood: this._original.remuneration.ikbFood,
            ikbTransport: this._original.remuneration.ikbTransport,
            ikbHealthcare: this._original.remuneration.ikbHealthcare,
            ikbChildcare: this._original.remuneration.ikbChildcare,
            ikbChildEducation: this._original.remuneration.ikbChildEducation,
        };

        const increase = this.determineRemunerationIncrease();
        if (increase === 0) {
            return;
        }

        const increaseOnePerc = increase / 100;
        const distro = this.determineDistro();

        this.remunerationResult = {
            baseWage: this.remunerationResult.baseWage + (increaseOnePerc * distro.baseWagePerc),
            bonuses: this.remunerationResult.bonuses + (increaseOnePerc * distro.bonusesPerc),
            ikbHousing: this.remunerationResult.ikbHousing + (increaseOnePerc * distro.ikbHousingPerc),
            ikbFood: this.remunerationResult.ikbFood + (increaseOnePerc * distro.ikbFoodPerc),
            ikbTransport: this.remunerationResult.ikbTransport + (increaseOnePerc * distro.ikbTransportPerc),
            ikbHealthcare: this.remunerationResult.ikbHealthcare + (increaseOnePerc * distro.ikbHealthcarePerc),
            ikbChildcare: this.remunerationResult.ikbChildcare + (increaseOnePerc * distro.ikbChildcarePerc),
            ikbChildEducation: this.remunerationResult.ikbChildEducation + (increaseOnePerc * distro.ikbChildEducationPerc),
        };
    }

    private calculateLivingWage() {
        const remuneration = new EntryWorkerRemuneration(this.remunerationResult);
        const livingWageBenchmark = this._scenario.entry.benchmark.value;

        const monthlyGap = Math.max(livingWageBenchmark - remuneration.total(), 0);
        const annualGap = (monthlyGap / 100) * this._original.percOfYearWorked;

        this.livingWageResult = {
            livingWageGap: monthlyGap,
            annualLivingWageGap: annualGap,
            annualLivingWageGapAllWorkers: annualGap * this._original.nrOfWorkers,
        };
    }

    private determineRemunerationIncrease(): number {
        if (this._specs.remunerationIncrease) {
            return this._specs.remunerationIncrease;
        }

        return Math.max(
            (this._scenario.specs?.remunerationIncrease || 0),
            (this._original.livingWage()?.livingWageGap || 0)
        );
    }

    private determineSpecs(): ScenarioSpecification {
        return new ScenarioSpecification({
            taxEmployee: this._scenario.specs.taxEmployee,
            taxEmployer: this._scenario.specs.taxEmployer,
            overheadCosts: this._scenario.specs.overheadCosts,
            remunerationIncrease: this.determineRemunerationIncrease(),
        });
    }

    private determineDistro(): ScenarioDistribution {
        if (this._specs.isEmpty()) {
            return this._scenario.distro;
        }

        return new ScenarioDistribution({
            bonusesPerc: this._distro.bonusesPerc,
            ikbHousingPerc: this._distro.ikbHousingPerc,
            ikbFoodPerc: this._distro.ikbFoodPerc,
            ikbTransportPerc: this._distro.ikbTransportPerc,
            ikbHealthcarePerc: this._distro.ikbHealthcarePerc,
            ikbChildcarePerc: this._distro.ikbChildcarePerc,
            ikbChildEducationPerc: this._distro.ikbChildEducationPerc,
        });
    }
}
