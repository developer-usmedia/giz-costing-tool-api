import { MikroORM } from '@mikro-orm/core';
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { PagingParams } from '@common/paging/paging-params';
import { AbstractEntity } from '@database/entities/base/abstract.entity';

@Injectable()
export class PagingValidationPipe<T extends AbstractEntity<T>> implements PipeTransform<PagingParams<T>, PagingParams<T>> {
    constructor(private readonly orm: MikroORM) {}

    public transform(value: PagingParams<T>, metadata: ArgumentMetadata): PagingParams<T> {
        const entity = metadata.data || null;
        if (!entity) {
            return value;
        }

        const columns = this.getColumnDefinitions(metadata.data);
        const relationships = this.getRelationshipDefinitions(metadata.data);
        const relationshipColumns = this.getRelationshipColumnDefinitions(metadata.data);
        const validated = this.validate(value, columns, relationships, relationshipColumns);

        if (!validated.isValid) {
            throw new BadRequestException(validated.errors);
        }

        return value;
    }

    private validate(
        paging: PagingParams<any>,
        columns: string[],
        relationships: string[],
        relationshipColumns: string[],
    ): { isValid: boolean; errors: Record<string, string> } {
        const validation = { isValid: true, errors: {} };
        const index = paging.index > -1;
        const size = paging.size > 0;

        const filters = Object.keys(paging.filter || {}).filter(() => false);
        const relations = paging.include.filter((relation) => !relationships.includes(relation));
        const sorts = Object.keys(paging.sort || {}).filter((key) => !columns.includes(key) && !relationshipColumns.includes(key));

        const isValid = index && size && filters.length + sorts.length + relations.length === 0;
        if (!isValid) {
            validation.isValid = false;

            if (!index) {
                // eslint-disable-next-line @typescript-eslint/dot-notation
                validation.errors['index'] = 'Given index is invalid';
            }

            if (!size) {
                // eslint-disable-next-line @typescript-eslint/dot-notation
                validation.errors['size'] = 'Given size is invalid';
            }

            filters.forEach((filter) => {
                validation.errors[filter] = `Given filter ${filter} is invalid`;
            });

            relations.forEach((include) => {
                validation.errors[include] = `Given include ${include} is invalid`;
            });

            sorts.forEach((sort) => {
                validation.errors[sort] = `Given sort ${sort} is invalid`;
            });
        }

        return validation;
    }

    private getColumnDefinitions(entity: string): string[] {
        const metadata = this.orm.getMetadata().get(entity);
        const isTranslated = ['Sector', 'WorkArea'].includes(entity);

        const props = metadata.props.filter((prop) => !prop.embeddable).map((prop) => prop.name);

        if (isTranslated) {
            props.push('label');
        }

        return props;
    }

    private getRelationshipDefinitions(entity: string): string[] {
        const metadata = this.orm.getMetadata().get(entity);

        return metadata.relations.map((relation) => relation.name);
    }

    private getRelationshipColumnDefinitions(entity: string): string[] {
        const metadata = this.orm.getMetadata().get(entity);
        return metadata.relations.reduce((propertyNames, relation) => {
            const names = Object.keys(relation.targetMeta.properties);
            return propertyNames.concat(names);
        }, [] as string[]);
    }
}
