import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ExpensesService } from "./expenses.service";
import { Request } from "express";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { AccessTokenGuard } from "../auth-guards/access-token.guard";
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("expenses")
@Controller("expenses")
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiOperation({ summary: "Update an existing expense" })
  @ApiBody({ type: CreateExpenseDto })
  @ApiResponse({ status: 200, description: "Expense updated successfully." })
  @ApiResponse({ status: 400, description: "Invalid expense data or ID." })
  @ApiResponse({ status: 404, description: "Expense not found." })
  async createExpense(
    @Req() req: Request,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    const userId = req.user["userId"] as number;
    return this.expensesService.createExpense(createExpenseDto, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @ApiOperation({ summary: "Get expenses within a custom date range" })
  @ApiQuery({
    name: "start",
    type: String,
    description: "Start date in ISO format",
  })
  @ApiQuery({
    name: "end",
    type: String,
    description: "End date in ISO format",
  })
  @ApiResponse({ status: 200, description: "Expenses retrieved successfully." })
  @ApiResponse({ status: 400, description: "Invalid date range." })
  async getExpensesByCustomPeriod(
    @Req() req: Request,
    @Query("start") start: string,
    @Query("end") end: string,
  ) {
    const userId = req.user["userId"] as number;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.expensesService.getExpensesByCustomPeriod(
      userId,
      startDate,
      endDate,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Put(":id")
  @ApiOperation({ summary: "Update an existing expense" })
  @ApiBody({ type: CreateExpenseDto })
  @ApiResponse({ status: 200, description: "Expense updated successfully." })
  @ApiResponse({ status: 400, description: "Invalid expense data or ID." })
  @ApiResponse({ status: 404, description: "Expense not found." })
  async updateExpense(
    @Body() updateExpenseDto: CreateExpenseDto,
    @Param("id") id: number,
    @Req() req: Request,
  ) {
    const userId = req.user["userId"] as number;
    return this.expensesService.updateExpense(+id, updateExpenseDto, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(":id")
  @ApiOperation({ summary: "Delete an existing expense" })
  @ApiResponse({ status: 200, description: "Expense deleted successfully." })
  @ApiResponse({ status: 404, description: "Expense not found." })
  async deleteExpense(@Param("id") id: number, @Req() req: Request) {
    const userId = req.user["userId"] as number;
    return this.expensesService.deleteExpense(+id, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get("last-week")
  @ApiOperation({ summary: "Get expenses from the last week" })
  @ApiResponse({
    status: 200,
    description: "Expenses from the last week retrieved successfully.",
  })
  async getExpensesByWeek(@Req() req: Request) {
    const userId = req.user["userId"] as number;
    return this.expensesService.getExpensesByWeek(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get("last-month")
  @ApiOperation({ summary: "Get expenses from the last month" })
  @ApiResponse({
    status: 200,
    description: "Expenses from the last month retrieved successfully.",
  })
  async getExpensesByLastMonth(@Req() req: Request) {
    const userId = req.user["userId"] as number;
    return this.expensesService.getExpensesByLastMonth(userId);
  }
}
