import { ValueObject } from './value-object';
import { v4 as generateUuid, validate as validateUuid } from 'uuid';
export class Uuid extends ValueObject<string> {
  constructor(id?: string) {
    super(id || generateUuid());
    this.validate();
  }

  private validate() {
    if (!validateUuid(this._value)) {
      throw new InvalidUuidError('Invalid Uuid');
    }
  }
}

class InvalidUuidError extends Error {
  constructor(invalidValue?: any) {
    super(`Value ${invalidValue} must be a valid UUID`);
    this.name = 'InvalidUuidError';
  }
}
