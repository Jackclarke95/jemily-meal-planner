import { useState } from "react";
import { ref, push, set, update } from "firebase/database";
import { db } from "../../lib/firebase";
import MealForm from "../MealForm";
import Page from "../Page";
import { Meal } from "../../Types/Meal";
import { MealType } from "../../Types/MealType";
import { MEAL_PLURAL_LOOKUP } from "../../Utils/Consts/MEAL_PLURAL_LOOKUP";

interface AddMealProps {
  mealType: MealType;
}

const AddMeal: React.FC<AddMealProps> = (props) => {
  const [mealKey, setMealKey] = useState<string | null>(null);

  // Save handler for Add
  const saveMealToDb = async (meal: Omit<Meal, "id">) => {
    let key = mealKey;
    const mealData = {
      ...meal,
      updatedAt: new Date().toISOString(),
    };
    const path = MEAL_PLURAL_LOOKUP[props.mealType];
    if (!key) {
      const mealRef = ref(db, path);
      const newMealRef = push(mealRef);
      key = newMealRef.key!;
      setMealKey(key);
      await set(newMealRef, mealData);
    } else {
      const mealRef = ref(db, `${path}/${key}`);
      await update(mealRef, mealData);
    }
  };

  return (
    <Page title={`Add ${props.mealType}`} backPath="/">
      <MealForm onSave={saveMealToDb} saveOnFieldChange={true} />
    </Page>
  );
};

export default AddMeal;
