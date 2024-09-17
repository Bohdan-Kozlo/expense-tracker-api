import { Module } from "@nestjs/common";
import { ExpensesService } from "./expenses.service";
import { ExpensesController } from "./expenses.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  providers: [ExpensesService],
  controllers: [ExpensesController],
  imports: [PrismaModule],
})
export class ExpensesModule {}
