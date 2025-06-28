export type MealPlan = {
  id: string;
  name: string;
  meals: {
    id: string;
    servings: number;
  }[];
};
