import { UnderscoreNamingStrategy } from '@mikro-orm/core';

export class DatabaseNamingStrategy extends UnderscoreNamingStrategy {
    private readonly prefix = 'giz_';

    public classToTableName(entityName: string): string {
        return this.prefix + this.underscoreIt(entityName);
    }

    public joinTableName(sourceEntity: string, _targetEntity: string, propertyName: string): string {
        return this.classToTableName(sourceEntity) + '_' + this.underscoreIt(propertyName);
    }

    public joinColumnName(propertyName: string) {
        return this.underscoreIt(propertyName) + '_' + this.referenceColumnName();
    }

    public joinKeyColumnName(entityName: string, referencedColumnName?: string): string {
        return this.underscoreIt(entityName) + '_' + (referencedColumnName || this.referenceColumnName());
    }

    public propertyToColumnName(propertyName: string): string {
        return this.underscoreIt(propertyName);
    }

    private underscoreIt(name: string): string {
        return name.replace(/^_/g, '').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    }
}

export const migrationFileName = (timestamp: string, name?: string) => {
    if (!name) {
        throw new Error('Specify migration name via `mikro-orm migration:create --name=the_migration`');
    }

    // Timestamp + KebabCase
    return timestamp + '_' + name
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
};

export const seederFileName = (className: string) => {
    // KebabCase
    return className
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .replace(/seeder$/g, '.seeder')
        .toLowerCase();
};
