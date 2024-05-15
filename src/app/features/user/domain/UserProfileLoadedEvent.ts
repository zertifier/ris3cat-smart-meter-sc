import {DomainEvent} from "../../../shared/domain/DomainEvent";

export class UserProfileLoadedEvent extends DomainEvent<void> {
  constructor() {
    super(UserProfileLoadedEvent.name);
  }
}
