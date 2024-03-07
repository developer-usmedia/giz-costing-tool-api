import { Embedded, Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';

import { Gender } from '@common/enums/gender.enum';
import { WorkerIKB } from '@database/embeddables/worker-ikb.embeddable';
import { AbstractEntity } from './base/abstract.entity';
import { Simulation } from './simulation.entity';

@Entity()
export class Worker extends AbstractEntity<Worker> {
    @ManyToOne(() => Simulation, { deleteRule: 'cascade' })
    simulation: Simulation;

    @Property({ length: 100 })
    name: string;

    @Enum(() => Gender)
    gender: Gender;

    @Property({ default: 1 })
    numberOfWorkers: number;

    @Property()
    monthlyWage: number;

    @Property()
    monthlyBonus: number;

    @Property({ length: 3 })
    percentageOfYearWorked: number;

    @Property({ length: 3 })
    employeeTax: number;

    @Property({ length: 3 })
    employerTax: number;

    @Embedded({ entity: () => WorkerIKB, prefix: false })
    inKindBenefits?: WorkerIKB;

    constructor(props: {
        simulation: Simulation;
        name: string;
        gender: Gender;
        numberOfWorkers: number;
        monthlyWage: number;
        monthlyBonus: number;
        percentageOfYearWorked: number;
        employeeTax: number;
        employerTax: number;
        inKindBenefits?: WorkerIKB;
    }) {
        super();

        this.simulation = props.simulation;

        this.name = props.name;
        this.gender = props.gender;
        this.numberOfWorkers = props.numberOfWorkers;
        this.monthlyWage = props.monthlyWage;
        this.monthlyBonus = props.monthlyBonus;
        this.percentageOfYearWorked = props.percentageOfYearWorked;
        this.employeeTax = props.employeeTax;
        this.employerTax = props.employerTax;
        this.inKindBenefits = this.inKindBenefits ?? new WorkerIKB();
    }
}
