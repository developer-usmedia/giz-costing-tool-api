import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class AbstractEntity<T extends AbstractEntity<T>> {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property({
    columnType: 'timestamp',
    defaultRaw: 'now()',
    onCreate: () => new Date(),
  })
  createdAt!: Date;

  @Property({
    columnType: 'timestamp',
    defaultRaw: 'now()',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt!: Date;
  
  @Property({
    default: 1,
    version: true,
    unsigned: true,
  })
  version!: number;

  // In case of em.create() errors on updatedAt and createdAt! 
  // https://mikro-orm.io/docs/guide/relationships#:~:text=BaseEntity%20%7B%0A%0A%20%20%5B-,OptionalProps,-%5D%3F%3A
}
