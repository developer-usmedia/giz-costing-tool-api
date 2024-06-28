import { Collection, Embedded, Entity, Enum, OneToMany, OneToOne, Property } from '@mikro-orm/core';

import { ScenarioSpecification } from '@domain/embeddables/scenario-specification.embed';
import { AbstractEntity } from '@domain/entities/base/abstract.entity';
import { ScenarioType } from '@domain/enums/scenario-type.enum';
import { Guard } from '@domain/utils/guard';
import { Entry } from './entry.entity';
import { ScenarioWorker } from './scenario-worker.entity';

@Entity()
export class Scenario extends AbstractEntity<Scenario> {
    @OneToOne(() => Entry, { deleteRule: 'cascade', eager: true })
    private _entry: Entry;

    @Enum({ items: () => ScenarioType })
    private _type: ScenarioType;

    @Embedded({ entity: () => ScenarioSpecification, prefix: 'specification_' })
    private _specifications: ScenarioSpecification;

    // Distribution specs embed

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true }) // TODO: fix double underscore in column name
    private _averageLwGap: number;

    @Property({ columnType: 'numeric(19,4)', unsigned: true, nullable: true })
    private _largestLwGap: number;

    // eslint-disable-next-line @typescript-eslint/dot-notation
    @OneToMany({ entity: () => ScenarioWorker, mappedBy: (worker) => worker['_scenario'], eager: true })
    private readonly _workers? = new Collection<ScenarioWorker>(this);

    constructor(props: {
        type: ScenarioType;
        entry: Entry;
        specifications?: ScenarioSpecification;
    }) {
        super();

        this.entry = props.entry;
        this.type = props.type;

        if (props.specifications) {
            this.specifications = props.specifications;
        } else {
            this._specifications = new ScenarioSpecification({});
        }

        this.importWorkers();
    }

    get entry() {
        return this._entry;
    }
    get type() {
        return this._type;
    }
    get specifications() {
        return this._specifications;
    }
    get averageLwGap() {
        return this._averageLwGap;
    }
    get largestLwGap() {
        return this._largestLwGap;
    }

    set entry(value: Entry) {
        Guard.check(value, { type: 'object' });
        this._entry = value;
    }

    set type(value: ScenarioType) {
        Guard.check(value, { type: 'string', enum: ScenarioType });
        this._type = value;
    }

    set specifications(value: ScenarioSpecification) {
        Guard.check(value, { type: 'object', optional: true, allowEmpty: true });
        this._specifications = value;
    }

    set averageLwGap(value: number) {
        Guard.check(value, { type: 'number', min: 0 });
        this._averageLwGap = value;
    }

    set largestLwGap(value: number) {
        Guard.check(value, { type: 'number', min: 0 });
        this._largestLwGap = value;
    }

    // TODO: move to service and instantiate with scenario calculation value
    public importWorkers(): void {
        if (this.entry.workers.length <= 0) {
            return;
        }

        for (const worker of this.entry.workers) {
            const scenarioWorker = new ScenarioWorker({
                scenario: this,
                worker: worker,
            });

            this._workers.add(scenarioWorker);
        }
    }
}
