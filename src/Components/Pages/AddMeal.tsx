import { useState } from "react";
import { ref, push, set, update } from "firebase/database";
import { db } from "../../Lib/firebase";
import MealForm from "../MealForm";
import Page from "../Page";
import { Meal } from "../../Types/Meal";

const AddMeal: React.FC = () => {
  const [mealKey, setMealKey] = useState<string | null>(null);

  // Save handler for Add
  const saveMealToDb = async (meal: Meal) => {
    let key = mealKey;
    const mealData = {
      ...meal,
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
    <Page title="Add Meal" backPath="/">
      <MealForm onSave={saveMealToDb} saveOnFieldChange={true} />
    </Page>
  );
};

export default AddMeal;
