import { Ingredient } from "../Types/Ingredient";
import { MealType } from "../Types/Meal";

/**
 * Collates all ingredients from a list of meals into a mapping:
 * { [ingredientName]: { [unit]: totalQuantity } }
 */
export function collateIngredients(meals: MealType[]): {
  [ingredient: string]: { [unit: string]: number };
} {
  const ingredientMap: { [ingredient: string]: { [unit: string]: number } } = {};

  meals.forEach((meal) => {
    meal.ingredients.forEach((ingredient: Ingredient) => {
      const nameKey = ingredient.name.trim().toLowerCase();
      const unitKey = ingredient.unit.trim().toLowerCase();

      if (!ingredientMap[nameKey]) {
        ingredientMap[nameKey] = {};
      }

      if (ingredientMap[nameKey][unitKey]) {
        ingredientMap[nameKey][unitKey] += ingredient.quantity;
      } else {
        ingredientMap[nameKey][unitKey] = ingredient.quantity;
      }
    });
  });

  return ingredientMap;
}