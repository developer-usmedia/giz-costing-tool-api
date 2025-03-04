import { Collection, Embedded, Entity, Enum, ManyToOne, OneToMany, OneToOne, Property } from '@mikro-orm/core';

import {
    AbstractEntity,
    ENTRY_STATUS_OPTIONS,
    EntryBenchmark,
    EntryBenchmarkProps,
    EntryBuyer,
    EntryBuyerProps,
    EntryFacility,
    EntryFacilityProps,
    EntryPayroll,
    EntryPayrollProps,
    EntryStatus,
    EntryWorker,
    Scenario,
    ScenarioProps,
    User,
} from '@domain/entities';
import { Guard } from '@domain/utils/guard';

export interface EntryProps {
    userId: string;
    matrixId?: string;
    matrixVerified?: boolean;
    facility: EntryFacilityProps;
    buyer?: EntryBuyerProps;
    benchmark?: EntryBenchmarkProps;
    payroll: EntryPayrollProps;
}

@Entity()
export class Entry extends AbstractEntity<Entry> {
    @ManyToOne(() => User, { deleteRule: 'cascade', mapToPk: true })
    private readonly _userId: string;

    @Property({ nullable: true })
    private _matrixId?: string;

    @Property({ nullable: true })
    private _matrixVerified?: boolean;

    @Enum({ items: () => ENTRY_STATUS_OPTIONS })
    private _status: EntryStatus;

    @Embedded({ entity: () => EntryFacility, prefix: 'facility_' })
    private _facility: EntryFacility;

    @Embedded({ entity: () => EntryBenchmark, prefix: 'benchmark_' })
    private _benchmark: EntryBenchmark;

    @Embedded({ entity: () => EntryBuyer, prefix: 'buyer_' })
    private _buyer: EntryBuyer;

    @Embedded({ entity: () => EntryPayroll, prefix: 'payroll_' })
    private _payroll: EntryPayroll;

    // eslint-disable-next-line @typescript-eslint/dot-notation
    @OneToMany({ entity: () => EntryWorker, mappedBy: (worker) => worker['_entry'], orphanRemoval: true })
    private readonly _workers = new Collection<EntryWorker>(this);

    @OneToOne({
        entity: () => Scenario,
         // eslint-disable-next-line @typescript-eslint/dot-notation
        mappedBy: (scenario) => scenario['_entry'],
        deleteRule: 'set null',
        orphanRemoval: true,
        nullable: true,
        eager: true,
    })
    private _scenario?: Scenario;

    constructor(props: EntryProps) {
        super();

        this._userId = props.userId;
        this._facility = new EntryFacility(props.facility);
        this._benchmark = new EntryBenchmark(props.benchmark);
        this._buyer = new EntryBuyer(props.buyer);
        this._payroll = new EntryPayroll(props.payroll);

        this.matrixId = props.matrixId ?? null;
        this.matrixVerified = props.matrixVerified ?? null;

        this.updateStatus();
    }

    get userId() {
        return this._userId;
    }

    get matrixId() {
        return this._matrixId ?? null;
    }

    get matrixVerified() {
        return this._matrixVerified ?? null;
    }

    get status() {
        return this._status;
    }

    get facility() {
        return this._facility;
    }

    get benchmark() {
        return this._benchmark;
    }

    get buyer() {
        return this._buyer;
    }

    get payroll() {
        return this._payroll;
    }

    get scenario() {
        return this._scenario;
    }

    get workers() {
        return this._workers;
    }

    set matrixId(value: string) {
        Guard.check(value, { type: 'string', optional: true });
        this._matrixId = value;
    }

    set matrixVerified(value: boolean) {
        Guard.check(value, { type: 'boolean', optional: true });
        this._matrixVerified = value;
    }

    public isLocked() {
        return this._matrixId !== null;
    }

    public updateFacilityInfo(facility: EntryFacilityProps) {
        if (this.isLocked()) {
            throw Error('Cannot update facility info on locked entry.');
        }

        this._facility = new EntryFacility(facility);
        this.updateStatus();
    }

    public updatePayrollInfo(payroll: EntryPayrollProps, options?: { skipLock: boolean }) {
        if (this.isLocked() && !options?.skipLock){
            throw Error('Cannot update payroll info on locked entry.');
        }

        this._payroll = new EntryPayroll(payroll);
        this.updateStatus();
    }

    public updateBuyerInfo(props: EntryBuyerProps) {
        this._buyer = new EntryBuyer(props);
        this.updateStatus();
    }

    public selectBenchmark(props: EntryBenchmarkProps) {
        if (this.isLocked()) {
            throw Error('Cannot update benchmark on locked entry.');
        }

        this._benchmark = new EntryBenchmark(props);
        this.updateStatus();
    }

    public clearBenchmark() {
        if (this.isLocked) {
            throw Error('Cannot clear benchmark on locked entry.');
        }

        this._benchmark = new EntryBenchmark();
        this.updateStatus();
    }

    public selectScenario(props: ScenarioProps) {
        if (this._scenario != null) {
            throw Error('Entry already has an scenario, clear current selection first.');
        }

        this._scenario = new Scenario(props);
        this.updateStatus();
    }

    public clearScenario() {
        this._scenario = null;
        this.updateStatus();
    }

    public updateStatus() {
        const hasNeededInfo = this._facility?.isComplete() || false;
        const hasBenchmarkInfo = this._benchmark?.isComplete() || false;
        if (!hasNeededInfo || !hasBenchmarkInfo) {
            this._status = 'CREATED';
            return;
        }

        const hasPayrollInfo = this._payroll?.isComplete() || false;
        // TODO: remove when payroll (summary) is inserted via sql / service
        const nrOfWorkers = this._workers?.isInitialized() ? this._workers.count() : 0;
        if (!hasPayrollInfo && nrOfWorkers === 0) {
            this._status = 'INFO_DONE';
            return;
        }

        const hasScenarioInfo = this._scenario?.specs.isComplete() || false;
        if (!hasScenarioInfo) {
            this._status = 'PAYROLL_DONE';
            return;
        }

        const hasDistributionInfo = this._scenario?.distro?.isComplete() || false;
        if (!hasDistributionInfo) {
            this._status = 'SCENARIO_DONE';
            return;
        }

        const hasReport = this.scenario.report.isComplete() || false;
        if (!hasReport) {
            this._status = 'DISTRIBUTION_DONE';
        }

        // All Done!
        this._status = 'COMPLETED';
    }

    public canCalculateReport(): boolean {
        return this.status === 'COMPLETED' || this.status === 'DISTRIBUTION_DONE';
    }

    // TODO: Remove when workers are stored with repository
    public addWorker(worker: EntryWorker): void {
        this._workers.add(worker);
        this.updateStatus();
    }
}
