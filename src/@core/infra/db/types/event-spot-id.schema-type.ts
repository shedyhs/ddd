import { EntityProperty, Platform, Type } from '@mikro-orm/core';
import { EventSpotId } from '../../../domain/entities/event-spot.entity';

export class EventSpotIdSchemaType extends Type<EventSpotId, string> {
  convertToDatabaseValue(
    valueObject: EventSpotId | undefined | null,
    platform: Platform,
  ): string {
    return valueObject instanceof EventSpotId
      ? valueObject.value
      : (valueObject as string);
  }

  convertToJSValue(value: string, platform: Platform): EventSpotId {
    return new EventSpotId(value);
  }

  getColumnType(prop: EntityProperty, platform: Platform): string {
    return `varchar(36)`;
  }
}
