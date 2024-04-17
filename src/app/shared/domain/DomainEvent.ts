export class DomainEvent<T> {
  constructor(public readonly name: string, public readonly data: T) {
  }
}
