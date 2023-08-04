import { EntityProperty, Platform, Type } from '@mikro-orm/core';
import { CustomerId } from '../../../../../../src/@core/events/domain/entities/customer.entity';

export class CustomerIdSchemaType extends Type<CustomerId, string> {
  convertToDatabaseValue(
    valueObject: CustomerId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof CustomerId
      ? valueObject.value
      : (valueObject as string);
  }

  convertToJSValue(value: string, platform: Platform): CustomerId {
    return new CustomerId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform): string {
    return `varchar(36)`;
  }
}
