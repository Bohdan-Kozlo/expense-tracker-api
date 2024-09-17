import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateExpenseDto } from "./dto/create-expense.dto";

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async createExpense(createExpenseDto: CreateExpenseDto, userId: number) {
    return this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async updateExpense(
    expenseId: number,
    updateExpenseDto: CreateExpenseDto,
    userId: number,
  ) {
    return this.prisma.expense.update({
      where: { id: expenseId, userId: userId },
      data: updateExpenseDto,
    });
  }

  async deleteExpense(expenseId: number, userId: number) {
    return this.prisma.expense.delete({
      where: { id: expenseId, userId: userId },
    });
  }

  async getExpensesByWeek(userId: number) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    lastWeek.setHours(0, 0, 0, 0);

    return this.prisma.expense.findMany({
      where: {
        userId: userId,
        date: {
          gte: lastWeek,
          lte: today,
        },
      },
    });
  }

  async getExpensesByLastMonth(userId: number) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const firstDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );
    firstDayOfLastMonth.setHours(0, 0, 0, 0);

    const lastDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
    );
    lastDayOfLastMonth.setHours(23, 59, 59, 999);

    return this.prisma.expense.findMany({
      where: {
        userId: userId,
        date: {
          gte: firstDayOfLastMonth,
          lte: lastDayOfLastMonth,
        },
      },
    });
  }

  async getExpensesByLastThreeMonths(userId: number) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    threeMonthsAgo.setHours(0, 0, 0, 0);

    return this.prisma.expense.findMany({
      where: {
        userId: userId,
        date: {
          gte: threeMonthsAgo,
          lte: today,
        },
      },
    });
  }

  async getExpensesByCustomPeriod(
    userId: number,
    startDate: Date,
    endDate: Date,
  ) {
    if (startDate > endDate) {
      throw new BadRequestException(
        "Start date cannot be greater than end date.",
      );
    }
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return this.prisma.expense.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}
