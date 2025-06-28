import chatController from '../../controllers/chat.controller';
import { FakeConnection, FakeSocketServer } from '../helpers/fakeSocket';

/**
 * Unit tests for chat socket event handlers
 */
describe('chatController socket events', () => {
  test('joinChat and leaveChat handlers', () => {
    const server = new FakeSocketServer();
    chatController(server as any); // register listeners
    const conn = new FakeConnection();
    server.emit('connection', conn);

    conn.emit('joinChat', 'room1');
    expect(conn.join).toHaveBeenCalledWith('room1');

    conn.emit('leaveChat', 'room1');
    expect(conn.leave).toHaveBeenCalledWith('room1');

    conn.join.mockClear();
    conn.emit('joinChat', '');
    expect(conn.join).not.toHaveBeenCalled();

    conn.leave.mockClear();
    conn.emit('leaveChat', undefined);
    expect(conn.leave).not.toHaveBeenCalled();
  });
});
