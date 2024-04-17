export type Cancellation = () => void;

export abstract class EventBus {
  public abstract publishEvent(): Promise<void>;

  public abstract subscribe(eventName: string, callback: (event: any) => Promise<void>): Cancellation;
}
