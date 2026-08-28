const getBackendPort = (): number => {
  const port = Number(process.env.BACKEND_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('BACKEND_PORT must be an integer between 1 and 65535');
  }

  return port;
};

export default () => ({
  port: getBackendPort(),
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  },
});
