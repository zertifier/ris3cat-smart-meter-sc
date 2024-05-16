import {DomainEvent} from "../../../shared/domain/DomainEvent";

export class UserCupsChangedEvent extends DomainEvent<void> {
  public static readonly NAME = 'user.cupsChanged';

  constructor() {
    super(UserCupsChangedEvent.NAME);
  }
}
