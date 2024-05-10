import {DomainEvent} from "../../../shared/domain/DomainEvent";

export class UserProfileChangedEvent extends DomainEvent<void> {
  public static readonly NAME = 'user.profileChanged';

  constructor() {
    super(UserProfileChangedEvent.NAME);
  }
}
