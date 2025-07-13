import { Ingredient } from "../../Types/Ingredient";
import { Meal } from "../../Types/Meal";

/**
 * Collates all ingredients from a list of meals into a mapping:
 * { [ingredientName]: { [unit]: totalQuantity } }
 */
export function collateIngredients(meals: Meal[]): {
  [ingredient: string]: { [unit: string]: number };
} {
  const ingredientMap: { [ingredient: string]: { [unit: string]: number } } =
    {};

  meals.forEach((meal) => {
    if (!meal || !Array.isArray(meal.ingredients)) return;
    meal.ingredients.forEach((ingredient: Ingredient | undefined) => {
      if (
        !ingredient ||
        typeof ingredient.name !== "string" ||
        typeof ingredient.unit !== "string" ||
        ingredient.name.trim() === "" ||
        ingredient.unit.trim() === ""
      ) {
        return;
      }
      const nameKey = ingredient.name.trim().toLowerCase();
      const unitKey = ingredient.unit.trim().toLowerCase();
      const quantity = Number(ingredient.quantity);
      if (isNaN(quantity) || quantity === 0) return;

      if (!ingredientMap[nameKey]) {
        ingredientMap[nameKey] = {};
      }

      if (ingredientMap[nameKey][unitKey]) {
        ingredientMap[nameKey][unitKey] += quantity;
      } else {
        ingredientMap[nameKey][unitKey] = quantity;
      }
    });
  });

  return ingredientMap;
}
