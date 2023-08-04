import { Collection as MikroOrmCollection } from '@mikro-orm/core';

export interface ICollection<T extends object> {
  getItems(): Iterable<T>;
  add(item: T, ...items: T[]): void;
  remove(item: T, ...items: T[]): void;
  find(predicate: (item: T) => boolean): T | undefined;
  forEach(callbackfn: (value: T, index: number) => void): void;
  map(callbackfn: (value: T, index: number) => T): Iterable<T>;
  removeAll(): void;
  count(): number;
  [Symbol.iterator](): IterableIterator<T>;
}

export type AnyCollection<T extends object> = MikroOrmCollection<T>;

export class CollectionFactory {
  static create<T extends object>(ref: any): ICollection<T> {
    const collection = new MikroOrmCollection<T>(ref);
    collection['initialized'] = false;
    return CollectionFactory.createProxy(collection);
  }

  static createFrom<T extends object>(
    target: MikroOrmCollection<any>,
  ): ICollection<T> {
    return CollectionFactory.createProxy(target);
  }

  private static createProxy<T extends object>(
    target: MikroOrmCollection<T>,
  ): ICollection<T> {
    //@ts-expect-error - Proxy
    return new Proxy(target, {
      get(target, prop, receiver) {
        if (prop === 'find') {
          return (predicate: (item: T) => boolean): T | undefined => {
            return target.getItems(false).find(predicate);
          };
        }

        if (prop === 'forEach') {
          return (callbackfn: (value: T, index: number) => void): void => {
            return target.getItems(false).forEach(callbackfn);
          };
        }

        if (prop === 'count') {
          return () => {
            return target.isInitialized() ? target.getItems().length : 0;
          };
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }
}
