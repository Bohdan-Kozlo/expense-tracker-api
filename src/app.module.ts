import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ExpensesModule } from "./expenses/expenses.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [UsersModule, AuthModule, ExpensesModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
