import {Cancellation, EventBus} from "../../domain/EventBus";
import {Injectable} from "@angular/core";

export class InMemoryEventBusService implements EventBus{

  constructor() {
  }

  publishEvent(): Promise<void> {
    return Promise.resolve(undefined);
  }

  subscribe(eventName: string, callback: (event: any) => Promise<void>): Cancellation {
    return () => {};
  }

}
