import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  const config = new DocumentBuilder()
    .setTitle("Expense Tracker Api")
    .setDescription("It's expense tracker api")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
  app.use(cookieParser());
  app.enableCors({});
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4444);
}
bootstrap();
