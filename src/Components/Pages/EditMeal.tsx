import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, get, update } from "firebase/database";
import { db } from "../../lib/firebase";
import MealForm from "../MealForm";
import Page from "../Page";
import { Ingredient } from "../../Types/Ingredient";
import { Meal } from "../../Types/Meal";

const EditMeal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [initialName, setInitialName] = useState("");
  const [initialIngredients, setInitialIngredients] = useState<Ingredient[]>(
    []
  );

  useEffect(() => {
    if (!id) return;
    const mealRef = ref(db, `meals/${id}`);
    get(mealRef).then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        setInitialName(data.title || "");
        setInitialIngredients(data.ingredients || []);
      }
    });
  }, [id]);

  // Save handler for Edit
  const saveMealToDb = async (meal: Meal) => {
    if (!id) return;
    const mealData = {
      ...meal,
      updatedAt: new Date().toISOString(),
    };
    const mealRef = ref(db, `meals/${id}`);
    await update(mealRef, mealData);
  };

  return (
    <Page title="Edit Meal" backPath="/meals">
      <MealForm
        initialName={initialName}
        initialIngredients={initialIngredients}
        onSave={saveMealToDb}
        saveOnFieldChange={false}
      />
    </Page>
  );
};

export default EditMeal;
