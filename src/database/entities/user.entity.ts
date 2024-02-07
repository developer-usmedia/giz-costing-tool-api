import { Entity, Property } from '@mikro-orm/core';

import { AbstractEntity } from './base/abstract.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Property({ nullable: true })
  firstName?: string;

  @Property({ nullable: true })
  lastName?: string;
}
