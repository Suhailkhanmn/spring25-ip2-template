import { EventEmitter } from 'events';

export class FakeConnection extends EventEmitter {
  join = jest.fn();
  leave = jest.fn();
}

export class FakeSocketServer extends EventEmitter {
  to = jest.fn().mockReturnValue({ emit: jest.fn() });
}
