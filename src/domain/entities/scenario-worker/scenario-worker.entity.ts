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
        livingWageGapPerc: number;
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

    get remuneration(): EntryWorkerRemuneration | null {
        if (this.remunerationResult !== undefined) {
            return new EntryWorkerRemuneration(this.remunerationResult);
        }

        this.calculate();

        if(!this.remunerationResult) {
            // Entry could be incorrect status so this.calculate() will not update value
            return null;
        }
        
        return new EntryWorkerRemuneration(this.remunerationResult);
    }

    get calculationDistribution() {
        return {
            baseWagePerc: (this.distro.baseWagePerc ?? this.scenario.distro?.baseWagePerc) ?? 0,
            bonusesPerc: (this.distro.bonusesPerc ?? this.scenario.distro?.bonusesPerc) ?? 0,
            ikbPerc: (this.distro.ikbPerc ?? this?.scenario.distro?.ikbPerc) ?? 0,
            ikbHousingPerc: (this.distro.ikbHousingPerc ?? this.scenario.distro?.ikbHousingPerc) ?? 0,
            ikbFoodPerc: (this.distro.ikbFoodPerc ?? this.scenario.distro?.ikbFoodPerc) ?? 0,
            ikbTransportPerc: (this.distro.ikbTransportPerc ?? this.scenario.distro?.ikbTransportPerc) ?? 0,
            ikbHealthcarePerc: (this.distro.ikbHealthcarePerc ?? this.scenario.distro?.ikbHealthcarePerc) ?? 0,
            ikbChildcarePerc: (this.distro.ikbChildcarePerc ?? this.scenario.distro?.ikbChildcarePerc) ?? 0,
            ikbChildEducationPerc: (this.distro.ikbChildEducationPerc ?? this.scenario?.distro?.ikbChildEducationPerc) ?? 0,
        };
    }
    
    public updateSpecs(specs: ScenarioWorkerSpecificationProps) {
        this._specs = new ScenarioWorkerSpecification(specs);
    }

    public updateDistro(distro: ScenarioWorkerDistributionProps) {
        this._distro = new ScenarioWorkerDistribution(distro);
    }

    public clearDistro(): void {
        this._distro = null;
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

    public getTaxes(props?: { forCategory: boolean }): number {
        const { taxEmployee, taxEmployer } = this.scenario.specs;
        const increase = (taxEmployee + taxEmployer) / 100;

        const taxes = this.determineRemunerationIncrease() * increase;

        if(props?.forCategory) {
            return taxes * this.original.nrOfWorkers;
        }

        return taxes;
    }

    public getRemunerationIncrease(props?: { forCategory: boolean }): number {
        const increase = this.determineRemunerationIncrease();
        
        if(props?.forCategory) {
            return increase * this.original.nrOfWorkers;
        }
        return increase;
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

        // This is not correct in OsoPerezoso on export. TODO: test test test
        const monthlyGap = Math.max(livingWageBenchmark - remuneration.total(), 0); 
        const annualGap = (monthlyGap * 12) * (this._original.percOfYearWorked / 100);
        const livingWagePerc = (monthlyGap / livingWageBenchmark) * 100;

        this.livingWageResult = {
            livingWageGap: monthlyGap,
            livingWageGapPerc: livingWagePerc,
            annualLivingWageGap: annualGap,
            annualLivingWageGapAllWorkers: annualGap * this._original.nrOfWorkers,
        };
    }

    private determineRemunerationIncrease(): number {
        if (this._specs.remunerationIncrease !== null) {
            return this._specs.remunerationIncrease;
        }

        return Math.max(
            this._scenario.specs?.remunerationIncrease || 0,
            this._original.livingWage()?.livingWageGap || 0,
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
