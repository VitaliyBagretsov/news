import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
// import { RolesGuard } from '@common/guards/role.guard';

const port = process.env.PORT || 3000;

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
  ], // Replace with your allowed origin
  // origin: 'http://localhost:8080', // Replace with your allowed origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define the HTTP methods allowed
  optionsSuccessStatus: 204, // Sets the status code for successful CORS preflight requests to 204
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.setGlobalPrefix('api');
  // app.useGlobalGuards(new JwtAuthGuard());
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
