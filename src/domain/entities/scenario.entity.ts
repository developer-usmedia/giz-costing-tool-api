import { Embedded, Entity, Enum, OneToOne } from '@mikro-orm/core';

import { ScenarioSpecification } from '@domain/embeddables/scenario-specification.embed';
import { AbstractEntity } from '@domain/entities/base/abstract.entity';
import { ScenarioType } from '@domain/enums/scenario-type.enum';
import { Guard } from '@domain/utils/guard';
import { Entry } from './entry.entity';

@Entity()
export class Scenario extends AbstractEntity<Scenario> {
    @OneToOne(() => Entry, { deleteRule: 'cascade', eager: true })
    private _entry: Entry;

    @Enum({ items: () => ScenarioType })
    private _type: ScenarioType;

    @Embedded({ entity: () => ScenarioSpecification, prefix: 'specification_' })
    private _specifications: ScenarioSpecification;

    // Distribution specs embed
    // ScenarioWorkers collecion

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

        // Take over 'Workers' to create ScenarioWorkers
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
}
