import { EntityProperty, Platform, Type } from '@mikro-orm/core';
import { EventSectionId } from '../../../domain/entities/event-section.entity';

export class EventSectionIdSchemaType extends Type<EventSectionId, string> {
  convertToDatabaseValue(
    valueObject: EventSectionId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof EventSectionId
      ? valueObject.value
      : (valueObject as string);
  }

  convertToJSValue(value: string, platform: Platform): EventSectionId {
    return new EventSectionId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform): string {
    return `varchar(36)`;
  }
}
