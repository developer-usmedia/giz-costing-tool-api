/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  EntityProperty,
  Platform,
  Type,
  ValidationError,
} from '@mikro-orm/core';
import Decimal from 'decimal.js';

export class DecimalType extends Type<Decimal, string> {
  convertToDatabaseValue(value: Decimal, _platform: Platform): string {
    if (value === null) return null;
    if (value.isNaN() || !value.isFinite()) {
      return null;
      throw ValidationError.invalidType(DecimalType, value, 'JS');
    }

    return value.toFixed(5);
  }

  convertToJSValue(value: string, _platform: Platform): Decimal {
    if (value === null) return null;
    
    return new Decimal(value);
  }

  getColumnType(_prop: EntityProperty, _platform: Platform) {
    return 'numeric';
  }
}
