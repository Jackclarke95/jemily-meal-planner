import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, get, update } from "firebase/database";
import { db } from "../../lib/firebase";
import MealForm, { Ingredient } from "../MealForm";
import Page from "../Page";

const EditMeal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [initialTitle, setInitialTitle] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
  const [initialIngredients, setInitialIngredients] = useState<Ingredient[]>(
    []
  );

  useEffect(() => {
    if (!id) return;
    const mealRef = ref(db, `meals/${id}`);
    get(mealRef).then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        setInitialTitle(data.title || "");
        setInitialDescription(data.description || "");
        setInitialIngredients(data.ingredients || []);
      }
    });
  }, [id]);

  // Save handler for Edit
  const saveMealToDb = async (
    title: string,
    description: string,
    ingredients: Ingredient[]
  ) => {
    if (!id) return;
    const mealData = {
      title,
      description,
      ingredients,
      updatedAt: new Date().toISOString(),
    };
    const mealRef = ref(db, `meals/${id}`);
    await update(mealRef, mealData);
  };

  return (
    <Page title="Edit Meal" path="/meals">
      <MealForm
        formTitle="Edit meal"
        initialTitle={initialTitle}
        initialDescription={initialDescription}
        initialIngredients={initialIngredients}
        onSave={saveMealToDb}
        saveOnFieldChange={false}
      />
    </Page>
  );
};

export default EditMeal;
