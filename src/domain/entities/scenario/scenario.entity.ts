import { Collection, Embedded, Entity, Enum, OneToMany, OneToOne } from '@mikro-orm/core';
import { Logger } from '@nestjs/common';

import {
    AbstractEntity,
    AnnualCosts,
    Entry,
    SCENARIO_TYPE_OPTIONS,
    ScenarioDistribution,
    ScenarioDistributionProps,
    ScenarioPayroll,
    ScenarioSpecification,
    ScenarioSpecificationProps,
    ScenarioType,
    ScenarioWorker,
} from '@domain/entities';
import { Guard } from '@domain/utils/guard';
import { ScenarioReport, ScenarioReportProps } from './scenario-report.embed';

export interface ScenarioProps {
    entry: Entry;
    type: ScenarioType;
    specs?: ScenarioSpecificationProps;
    distro?: ScenarioDistributionProps;
}

@Entity()
export class Scenario extends AbstractEntity<Scenario> {
    @Enum({ items: () => SCENARIO_TYPE_OPTIONS })
    private _type: ScenarioType;

    @OneToOne(() => Entry, { deleteRule: 'cascade', eager: true })
    private readonly _entry: Entry;

    @Embedded({ entity: () => ScenarioSpecification, prefix: 'specs_' })
    private _specs: ScenarioSpecification;

    @Embedded({ entity: () => ScenarioDistribution, prefix: 'distro_', nullable: true })
    private _distro: ScenarioDistribution;

    @Embedded({ entity: () => ScenarioReport, prefix: 'report_', nullable: true })
    private _report: ScenarioReport;

    @Embedded({ entity: () => ScenarioPayroll, prefix: 'payroll_' })
    private readonly _payroll: ScenarioPayroll;

    // eslint-disable-next-line @typescript-eslint/dot-notation
    @OneToMany({ entity: () => ScenarioWorker, mappedBy: (worker) => worker['_scenario'], orphanRemoval: true })
    private readonly _workers = new Collection<ScenarioWorker>(this);

    private readonly logger = new Logger(Scenario.name);

    constructor(props: ScenarioProps) {
        super();

        this.type = props.type;

        this._entry = props.entry;
        this._specs = new ScenarioSpecification(props.specs);
        this._distro = props.distro ? new ScenarioDistribution(props.distro) : null;
        this._report = null;
        this._payroll = new ScenarioPayroll();
    }

    get type() {
        return this._type;
    }

    get entry() {
        return this._entry;
    }

    get specs() {
        return this._specs;
    }

    get distro() {
        return this._distro;
    }

    get report() {
        return this._report;
    }

    get payroll() {
        return this._payroll;
    }

    private set type(value: ScenarioType) {
        Guard.check(value, { type: 'string', options: SCENARIO_TYPE_OPTIONS });
        this._type = value;
    }

    public updateSpecs(specs: ScenarioSpecificationProps) {
        this._specs = new ScenarioSpecification(specs);
        this.entry.updateStatus();
    }

    public updateDistro(distro: ScenarioDistributionProps) {
        this._distro = new ScenarioDistribution(distro);
        this.entry.updateStatus();
    }

    public updateReport(report: ScenarioReportProps) {
        this._report = new ScenarioReport(report);
        this.entry.updateStatus();
    }

    public getBuyerReport(): AnnualCosts {
        if (!this.report) {
            return undefined;
        }

        let percentage = this.entry.buyer.amount / 100;

        if (this.entry.buyer.unit === 'UNIT') {
            if(this.entry.buyer.amount > this.entry.facility.productionAmount) {
                this.logger.error(`this.entry.buyer.amount > this.entry.facility.productionAmount (entry: ${this.entry.id}`);
                this.logger.error(`Buyer can't buy more than the facility sells (${this.entry.buyer.amount}/${this.entry.facility.productionAmount})`);
                return null;
            }

            percentage = (this.entry.facility.productionAmount / this.entry.buyer.amount) * 100;
        }
        
        return {
            remunerationIncrease: this.report.remunerationIncrease * percentage,
            taxCosts: this.report.taxCosts * percentage,
            overheadCosts: this.report.overheadCosts * percentage,
            totalCosts: this.report.totalCosts * percentage,
            totalCostsPerUnit: this.report.totalCostsPerUnit,
        };
    }
}
