import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

const port = process.env.PORT || 3000;

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
  ], // Replace with your allowed origin
  // origin: 'http://localhost:8080', // Replace with your allowed origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Define the HTTP methods allowed
  optionsSuccessStatus: 204, // Sets the status code for successful CORS preflight requests to 204
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PgSession = connectPgSimple(session);

  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(
    session({
      name: 'news_session',
      secret: configService.getOrThrow<string>('SESSION_SECRET'),
      store: new PgSession({
        conObject: {
          host: configService.getOrThrow<string>('POSTGRES_HOST'),
          port: Number(configService.getOrThrow<string>('POSTGRES_PORT')),
          user: configService.getOrThrow<string>('POSTGRES_USER'),
          password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
          database: configService.getOrThrow<string>('POSTGRES_DB'),
        },
        schemaName: 'news',
        tableName: 'user_sessions',
        createTableIfMissing: true,
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: configService.get<string>('SESSION_COOKIE_SECURE') === 'true',
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000,
        path: '/',
      },
    }),
  );
  app.enableCors(corsOptions);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  // await app.listen(4005);
  await app.listen(port, () => console.log(`Listen server on ${port} port`));
}
bootstrap();
