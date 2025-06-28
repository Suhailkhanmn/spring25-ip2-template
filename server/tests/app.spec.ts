import supertest from 'supertest';
import mongoose from 'mongoose';
import { app, startServer, server } from '../app';

describe('app root and startServer', () => {
  it('GET / should return hello world', async () => {
    const res = await supertest(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('hello world');
  });

  it('startServer starts listening and connects to DB', async () => {
    const connectMock = jest.spyOn(mongoose, 'connect').mockResolvedValue(null as any);
    const listenMock = jest
      .spyOn(server, 'listen')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockImplementation((_: any, cb: any) => {
        if (cb) cb();
        return server;
      });

    startServer();

    expect(connectMock).toHaveBeenCalled();
    expect(listenMock).toHaveBeenCalled();
    server.close();
  });

});
