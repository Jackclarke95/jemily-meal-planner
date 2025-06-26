import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, get, update, remove } from "firebase/database";
import { db } from "../../lib/firebase";
import MealForm from "../MealForm";
import Page from "../Page";
import { Ingredient } from "../../Types/Ingredient";
import { Meal } from "../../Types/Meal";
import {
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
} from "@fluentui/react";

const EditMeal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialName, setInitialName] = useState("");
  const [initialServings, setInitialServings] = useState(2);
  const [initialIngredients, setInitialIngredients] = useState<Ingredient[]>(
    []
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const mealRef = ref(db, `meals/${id}`);
    get(mealRef).then((snapshot) => {
      const data = snapshot.val() as Meal | null;

      if (data) {
        setInitialName(data.name || "");
        setInitialServings(data.servings || 2);
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

  // Delete handler with confirmation
  const deleteMealFromDb = async () => {
    if (!id) return;
    const mealRef = ref(db, `meals/${id}`);
    await remove(mealRef);
    setDeleteDialogOpen(false);
    navigate("/meals");
  };

  return (
    <Page title="Edit Meal" backPath="/meals">
      <MealForm
        initialName={initialName}
        initialServings={initialServings}
        initialIngredients={initialIngredients}
        onSave={saveMealToDb}
        onDelete={() => setDeleteDialogOpen(true)}
        saveOnFieldChange={false}
      />
      <Dialog
        hidden={!deleteDialogOpen}
        onDismiss={() => setDeleteDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Delete Meal",
          closeButtonAriaLabel: "Close",
          subText:
            "Are you sure you want to delete this meal? This action cannot be undone.",
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={deleteMealFromDb} text="Delete" />
          <DefaultButton
            onClick={() => setDeleteDialogOpen(false)}
            text="Cancel"
          />
        </DialogFooter>
      </Dialog>
    </Page>
  );
};

export default EditMeal;
