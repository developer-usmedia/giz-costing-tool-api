import { Collection, Embedded, Entity, Enum, OneToMany, OneToOne } from '@mikro-orm/core';

import {
    AbstractEntity,
    Entry,
    SCENARIO_TYPE_OPTIONS,
    ScenarioDistribution, ScenarioDistributionProps,
    ScenarioPayroll,
    ScenarioSpecification, ScenarioSpecificationProps,
    ScenarioType,
    ScenarioWorker,
} from '@domain/entities';
import { Guard } from '@domain/utils/guard';

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

    @Embedded({ entity: () => ScenarioDistribution, prefix: 'distro_' })
    private _distro: ScenarioDistribution;

    @Embedded({ entity: () => ScenarioPayroll, prefix: 'payroll_' })
    private readonly _payroll: ScenarioPayroll;

    // eslint-disable-next-line @typescript-eslint/dot-notation
    @OneToMany({ entity: () => ScenarioWorker, mappedBy: (worker) => worker['_scenario'], orphanRemoval: true })
    private readonly _workers = new Collection<ScenarioWorker>(this);

    constructor(props: ScenarioProps) {
        super();

        this.type = props.type;

        this._entry = props.entry;
        this._specs = new ScenarioSpecification(props.specs);
        this._distro = new ScenarioDistribution(props.distro);
        this._payroll = new ScenarioPayroll();

        // this.importWorkers();
    }

    // // TODO: move to service and instantiate with scenario calculation value
    // public importWorkers(): void {
    //     // if (this.entry.workers.length <= 0) {
    //     //     return;
    //     // }

    //     for (const worker of this.entry.workers) {
    //         const scenarioWorker = new ScenarioWorker({
    //             scenario: this,
    //             worker: worker,
    //         });

    //         this._workers.add(scenarioWorker);
    //     }
    // }

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

    get payroll() {
        return this._payroll;
    }

    private set type(value: ScenarioType) {
        Guard.check(value, { type: 'string', options: SCENARIO_TYPE_OPTIONS });
        this._type = value;
    }

    public updateSpecs(specs: ScenarioSpecificationProps) {
        this._specs = new ScenarioSpecification(specs);
    }

    public updateDistro(distro: ScenarioDistributionProps) {
        this._distro = new ScenarioDistribution(distro);
    }
}
