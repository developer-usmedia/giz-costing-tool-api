import { UnderscoreNamingStrategy } from '@mikro-orm/core';

export class GizNamingStrategy extends UnderscoreNamingStrategy {
    private readonly prefix = 'giz_';

    public classToTableName(entityName: string): string {
        return this.prefix + this.underscoreIt(entityName);
    }

    public joinKeyColumnName(entityName: string, referencedColumnName: string): string {
        return this.underscoreIt(entityName) + '_' + (referencedColumnName || this.referenceColumnName());
    }

    public joinTableName(sourceEntity: string, _targetEntity: string, propertyName: string): string {
        return this.prefix + this.underscoreIt(sourceEntity) + '_' + this.underscoreIt(propertyName);
    }

    private underscoreIt(name: string): string {
        return name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    }
}
