import gameController from '../../controllers/game.controller';
import { FakeConnection, FakeSocketServer } from '../helpers/fakeSocket';
import GameManager from '../../services/games/gameManager';

/**
 * Tests for game controller socket events
 */
describe('gameController socket events', () => {
  afterEach(() => {
    GameManager.resetInstance();
  });

  test('joinGame and leaveGame handlers', () => {
    const server = new FakeSocketServer();
    gameController(server as any);
    const conn = new FakeConnection();
    server.emit('connection', conn);

    conn.emit('joinGame', 'game1');
    expect(conn.join).toHaveBeenCalledWith('game1');

    conn.emit('leaveGame', 'game1');
    expect(conn.leave).toHaveBeenCalledWith('game1');
  });

  test('makeMove emits gameError when game not found', async () => {
    const server = new FakeSocketServer();
    gameController(server as any);
    const conn = new FakeConnection();
    server.emit('connection', conn);

    jest.spyOn(GameManager.getInstance(), 'getGame').mockReturnValue(undefined);

    const emitMock = jest.fn();
    server.to.mockReturnValue({ emit: emitMock } as any);

    const payload = { gameID: 'game1', move: { playerID: 'p1', gameID: 'game1', move: {} } };
    conn.emit('makeMove', payload);

    await Promise.resolve();
    expect(emitMock).toHaveBeenCalledWith('gameError', {
      player: 'p1',
      error: 'Game requested does not exist',
    });
  });
});
