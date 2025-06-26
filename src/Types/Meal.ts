import { Ingredient } from "./Ingredient";
import { MealType } from "./MealCategory";

export interface Meal {
  id: string;
  name: string;
  servings: number;
  ingredients: Ingredient[];
  mealType: MealType;
}
