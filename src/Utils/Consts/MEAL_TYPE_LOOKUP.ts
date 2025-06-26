import { MealTypeEnum, MealType } from "../../Types/MealType";

export const MEAL_PLURAL_LOOKUP: Record<MealType, string> = {
  [MealTypeEnum.Lunch]: "lunches",
  [MealTypeEnum.Dinner]: "dinners",
};
