import {CallbackCancellation, EventBus, EventCallback} from "../../domain/EventBus";
import {v4 as uuidv4} from 'uuid';
import {DomainEvent} from "../../domain/DomainEvent";

export class InMemoryEventBusService implements EventBus {
  private _eventCallbacks: Map<string, { id: string, callback: EventCallback }[]> = new Map();
  private _routines: Map<string, Promise<any>> = new Map();

  constructor() {
  }

  async publishEvents(...events: DomainEvent<unknown>[]): Promise<void> {
    for (const event of events) {
      const eventCallbacks = this._eventCallbacks.get(event.name) || [];

      eventCallbacks.forEach(c => {
        const promise = c.callback(event)
        const id = uuidv4()
        this._routines.set(id, promise);
        promise.catch(console.log).finally(() => this._routines.delete(id));
      });
    }
  }

  subscribe(eventName: string, callback: EventCallback): CallbackCancellation {
    const callbacks = this._eventCallbacks.get(eventName) || [];
    const id = uuidv4();
    callbacks.push({id, callback});
    this._eventCallbacks.set(eventName, callbacks);
    return () => {
      const callbacks = this._eventCallbacks.get(eventName);
      if (!callbacks) {
        return;
      }

      const newCallbacks = callbacks.filter(c => c.id !== id);
      this._eventCallbacks.set(eventName, newCallbacks);
    };
  }

}
