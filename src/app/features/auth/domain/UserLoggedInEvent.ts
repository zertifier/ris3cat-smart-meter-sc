import {DomainEvent} from "../../../shared/domain/DomainEvent";

export class UserLoggedInEvent extends DomainEvent<void>{
  public static readonly NAME = 'user.loggedIn';
  constructor() {
    super(UserLoggedInEvent.NAME);
  }
}
