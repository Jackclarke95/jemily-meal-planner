import { ITag } from "@fluentui/react";
import { Ingredient } from "./Ingredient";

export interface Meal {
  id: string;
  name: string;
  servings: number;
  ingredients: Ingredient[];
  tags: string[];
}
