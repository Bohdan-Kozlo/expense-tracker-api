import { IsEnum, IsNotEmpty, IsNumberString } from "class-validator";

export enum Category {
  Groceries = "Groceries",
  Leisure = "Leisure",
  Electronics = "Electronics",
  Transport = "Transport",
  Entertainment = "Entertainment",
  Health = "Health",
  Food = "Food",
  Education = "Education",
  Clothing = "Clothing",
  Other = "Other",
}

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsNumberString()
  amount: number;

  @IsNotEmpty()
  description: string;

  @IsEnum(Category)
  category: Category;
}
