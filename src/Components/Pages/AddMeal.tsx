import { useState } from "react";
import { ref, push, set, update } from "firebase/database";
import { db } from "../../lib/firebase";
import MealForm, { Ingredient } from "../MealForm";
import Page from "../Page";

const AddMeal: React.FC = () => {
  const [mealKey, setMealKey] = useState<string | null>(null);

  // Save handler for Add
  const saveMealToDb = async (
    title: string,
    description: string,
    ingredients: Ingredient[]
  ) => {
    let key = mealKey;
    const mealData = {
      title,
      description,
      ingredients,
      updatedAt: new Date().toISOString(),
    };
    if (!key) {
      const mealRef = ref(db, "meals");
      const newMealRef = push(mealRef);
      key = newMealRef.key!;
      setMealKey(key);
      await set(newMealRef, mealData);
    } else {
      const mealRef = ref(db, `meals/${key}`);
      await update(mealRef, mealData);
    }
  };

  return (
    <Page title="Add Meal" path="/">
      <MealForm onSave={saveMealToDb} saveOnFieldChange={true} />
    </Page>
  );
};

export default AddMeal;
