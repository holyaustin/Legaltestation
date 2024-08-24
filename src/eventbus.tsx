import EventEmitter from 'events';

export enum Events {
  noTicketSpin = 'noTicketSpin',
  spin = 'spin',
  raffleResultReceived = 'raffleResultReceived',
  // 抢到了红包
  mysteryDropGrabbed = 'mysteryDropGrabbed'
}

export interface EventMap {
  [Events.noTicketSpin]: [];
  [Events.spin]: [];
  [Events.raffleResultReceived]: [];
  [Events.mysteryDropGrabbed]: [];
}

export const eventBus = new EventEmitter<EventMap>();
