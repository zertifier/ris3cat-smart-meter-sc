import {DomainEvent} from "../../../shared/domain/DomainEvent";

export class UserProfileChanged extends DomainEvent<void> {
  public static readonly NAME = 'user.profileChanged';

  constructor() {
    super(UserProfileChanged.NAME);
  }
}
