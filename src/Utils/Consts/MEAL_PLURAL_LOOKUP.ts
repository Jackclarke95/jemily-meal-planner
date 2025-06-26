import { MealTypes, MealType } from "../../Types/MealType";

export const MEAL_PLURAL_LOOKUP: Record<MealType, string> = {
  [MealTypes.Lunch]: MealTypes.Lunches,
  [MealTypes.Dinner]: MealTypes.Dinners,
};
