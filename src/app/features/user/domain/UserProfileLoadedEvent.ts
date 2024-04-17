import {DomainEvent} from "../../../shared/domain/DomainEvent";

export class UserProfileLoadedEvent extends DomainEvent<void> {
  public static readonly NAME = 'user.profileLoaded';
  constructor() {
    super(UserProfileLoadedEvent.NAME);
  }
}
