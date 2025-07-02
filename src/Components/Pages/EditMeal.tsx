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
import { MealType } from "../../Types/MealType";
import { MEAL_PLURAL_LOOKUP } from "../../Utils/Consts/MEAL_PLURAL_LOOKUP";

interface EditMealProps {
  mealType: MealType;
}

const EditMeal: React.FC<EditMealProps> = (props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialName, setInitialName] = useState("");
  const [initialServings, setInitialServings] = useState(2);
  const [initialIngredients, setInitialIngredients] = useState<Ingredient[]>(
    []
  );
  const [initialTags, setInitialTags] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!id || !props.mealType) {
      return;
    }

    const mealRef = ref(db, `${MEAL_PLURAL_LOOKUP[props.mealType]}/${id}`);

    get(mealRef).then((snapshot) => {
      const data = snapshot.val() as Meal | null;

      if (data) {
        setInitialName(data.name || "");
        setInitialServings(data.servings || 2);
        setInitialIngredients(data.ingredients ?? []);
        setInitialTags(data.tags ?? []);
      }
    });
  }, [id, props.mealType]);

  // Save handler for Edit
  const saveMealToDb = async (meal: Omit<Meal, "id">) => {
    if (!id || !props.mealType) return;
    const mealData = {
      meal,
    };
    const path = MEAL_PLURAL_LOOKUP[props.mealType];
    const mealRef = ref(db, `${path}/${id}`);
    await update(mealRef, mealData);
  };

  // Delete handler with confirmation
  const deleteMealFromDb = async () => {
    if (!id || !props.mealType) return;
    const path = MEAL_PLURAL_LOOKUP[props.mealType];
    const mealRef = ref(db, `${path}/${id}`);
    await remove(mealRef);
    setDeleteDialogOpen(false);
    navigate(`/${MEAL_PLURAL_LOOKUP[props.mealType]}`);
  };

  return (
    <Page
      title={`Edit ${props.mealType}`}
      backPath={`/${MEAL_PLURAL_LOOKUP[props.mealType]}`}
    >
      <MealForm
        initialName={initialName}
        initialServings={initialServings}
        initialIngredients={initialIngredients}
        initialTags={initialTags}
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
