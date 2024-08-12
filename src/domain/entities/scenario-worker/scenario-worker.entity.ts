import { Embedded, Entity, ManyToOne } from '@mikro-orm/core';
import Decimal from 'decimal.js';

import {
    AbstractEntity,
    EntryWorker,
    EntryWorkerRemuneration,
    Scenario,
    ScenarioDistribution,
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
        baseWage: Decimal;
        bonuses: Decimal;
        ikbHousing: Decimal;
        ikbFood: Decimal;
        ikbTransport: Decimal;
        ikbHealthcare: Decimal;
        ikbChildcare: Decimal;
        ikbChildEducation: Decimal;
    };

    private livingWageResult: null | {
        livingWageGap: Decimal;
        livingWageGapPerc: Decimal;
        annualLivingWageGap: Decimal;
        annualLivingWageGapAllWorkers: Decimal;
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

    public getTaxes(props?: { forCategory: boolean }): Decimal {
        const { taxEmployee, taxEmployer } = this.scenario.specs;
        const increase = (taxEmployee + taxEmployer) / 100;

        const taxes = this.determineRemunerationIncrease().times(increase);

        if(props?.forCategory) {
            return taxes.times(this.original.nrOfWorkers);
        }

        return taxes;
    }

    public getRemunerationIncrease(props?: { forCategory: boolean }): Decimal {
        const increase = this.determineRemunerationIncrease();
        
        if(props?.forCategory) {
            return increase.times(this.original.nrOfWorkers);
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
        if (increase.equals(0)) {
            return;
        }

        const increaseOnePerc = increase.dividedBy(100);
        const distro = this.determineDistro();

        this.remunerationResult = {
            baseWage: this.remunerationResult.baseWage.plus(increaseOnePerc.times(distro.baseWagePerc)),
            bonuses: this.remunerationResult.bonuses.plus(increaseOnePerc.times(distro.bonusesPerc)),
            ikbHousing: this.remunerationResult.ikbHousing.plus(increaseOnePerc.times(distro.ikbHousingPerc)),
            ikbFood: this.remunerationResult.ikbFood.plus(increaseOnePerc.times(distro.ikbFoodPerc)),
            ikbTransport: this.remunerationResult.ikbTransport.plus(increaseOnePerc.times(distro.ikbTransportPerc)),
            ikbHealthcare: this.remunerationResult.ikbHealthcare.plus(increaseOnePerc.times(distro.ikbHealthcarePerc)),
            ikbChildcare: this.remunerationResult.ikbChildcare.plus(increaseOnePerc.times(distro.ikbChildcarePerc)),
            ikbChildEducation: this.remunerationResult.ikbChildEducation.plus(increaseOnePerc.times(distro.ikbChildEducationPerc)),
        };
    }

    private calculateLivingWage() {
        const remuneration = new EntryWorkerRemuneration(this.remunerationResult);
        const livingWageBenchmark = new Decimal(this.scenario.entry.benchmark.value);

        const monthlyTotalRemuneration = remuneration.total();
        const monthlyGap = Decimal.max(livingWageBenchmark.minus(monthlyTotalRemuneration), new Decimal(0));
        const annualGap = monthlyGap.times(new Decimal(12)).times((new Decimal(this.original.percOfYearWorked).dividedBy(new Decimal(100))));
        const livingWagePerc = monthlyGap.dividedBy(livingWageBenchmark).times(new Decimal(100));

        this.livingWageResult = {
            livingWageGap: monthlyGap,
            livingWageGapPerc: livingWagePerc,
            annualLivingWageGap: annualGap,
            annualLivingWageGapAllWorkers: annualGap.times(this._original.nrOfWorkers),
        };
    }

    private determineRemunerationIncrease(): Decimal {
        if (this._specs.remunerationIncrease !== null) {
            return new Decimal(this._specs.remunerationIncrease);
        }

        return Decimal.max(
            this._scenario.specs?.remunerationIncrease || 0,
            this._original.livingWage()?.livingWageGap || 0,
        );
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
