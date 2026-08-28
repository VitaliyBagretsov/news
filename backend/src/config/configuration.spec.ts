import configuration from './configuration.js';

describe('configuration', () => {
  const originalBackendPort = process.env.BACKEND_PORT;

  afterEach(() => {
    if (originalBackendPort === undefined) {
      delete process.env.BACKEND_PORT;
    } else {
      process.env.BACKEND_PORT = originalBackendPort;
    }
  });

  it('exposes BACKEND_PORT as the application port', () => {
    process.env.BACKEND_PORT = '3001';

    expect(configuration().port).toBe(3001);
  });

  it('rejects an invalid BACKEND_PORT', () => {
    process.env.BACKEND_PORT = 'invalid';

    expect(() => configuration()).toThrow(
      'BACKEND_PORT must be an integer between 1 and 65535',
    );
  });
});
