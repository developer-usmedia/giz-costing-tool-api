import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class AbstractEntity<T extends AbstractEntity<T>> {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
    private readonly _id!: string;

    @Property({ columnType: 'timestamp', defaultRaw: 'now()' })
    private readonly _createdAt!: Date;

    @Property({ columnType: 'timestamp', defaultRaw: 'now()', onUpdate: () => new Date() })
    private readonly _updatedAt!: Date;

    @Property({ version: true, unsigned: true, default: 1 })
    private readonly _version!: number;

    constructor() {
        this._version = 1;
        this._createdAt = new Date();
        this._updatedAt = new Date();
    }

    get id() { return this._id; }
    get createdAt() { return this._createdAt; }
    get updatedAt() { return this._updatedAt; }
    get version() { return this._version; }
}
