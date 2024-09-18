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
  amount: number;
  description: string;
  category: Category;
}
