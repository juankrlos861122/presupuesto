import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ["error", "warn", "log"],
    });

    app.enableCors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    const port = 4000;
    await app.listen(process.env.PORT || port);
    console.log(`🚀 Server running on http://localhost:${process.env.PORT || port}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
}
bootstrap();
