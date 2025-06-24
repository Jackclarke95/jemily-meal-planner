import {
  Stack,
  Text,
  TextField,
  PrimaryButton,
  MessageBar,
  MessageBarType,
  ProgressIndicator,
} from "@fluentui/react";
import { useEffect, useState, useCallback } from "react";
import { ref, push, set, update, get, child } from "firebase/database";
import { db } from "../../lib/firebase";
import EditIngredientDialog from "../EditIngredientDialog";
import IngredientList from "../IngredientList";
import MealSavedBar from "../MealSavedBar";
import { INGREDIENT_UNIT_LOOKUP } from "../../lib/globalConsts";
import Page from "../Page";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  key?: string;
}

interface AddMealPageProps {}

const AddMeal: React.FC<AddMealPageProps> = () => {
  const [mealKey, setMealKey] = useState<string | null>(null);
  const [mealTitle, setMealTitle] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: "",
    quantity: "",
    unit: "",
  });

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editIngredient, setEditIngredient] = useState<Ingredient | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Meal saved state
  const [mealSaved, setMealSaved] = useState(false);
  const [progress, setProgress] = useState(1);

  function normalizeUnit(unit: string): string {
    const cleaned = unit.trim().toLowerCase();
    return INGREDIENT_UNIT_LOOKUP[cleaned] || unit;
  }

  // Helper to create or update the meal in Firebase
  const saveMealToDb = useCallback(
    async (
      override?: Partial<{
        title: string;
        description: string;
        ingredients: Ingredient[];
      }>
    ) => {
      let key = mealKey;
      const mealData = {
        title: override?.title ?? mealTitle,
        description: override?.description ?? mealDescription,
        ingredients: override?.ingredients ?? ingredients,
        updatedAt: new Date().toISOString(),
      };

      if (!key) {
        // Create new meal node
        const mealRef = ref(db, "meals");
        const newMealRef = push(mealRef);
        key = newMealRef.key!;
        setMealKey(key);
        await set(newMealRef, mealData);
      } else {
        // Update existing meal node
        const mealRef = ref(db, `meals/${key}`);
        await update(mealRef, mealData);
      }
    },
    [mealKey, mealTitle, mealDescription, ingredients]
  );

  // Add ingredient and save meal
  const addIngredient = async () => {
    if (!newIngredient.name.trim()) return;
    const normalizedUnit = normalizeUnit(newIngredient.unit);
    const updatedIngredients = [
      ...ingredients,
      { ...newIngredient, unit: normalizedUnit },
    ];
    setIngredients(updatedIngredients);
    setNewIngredient({ name: "", quantity: "", unit: "" });
    await saveMealToDb({ ingredients: updatedIngredients });
  };

  // Edit handlers
  const openEditDialog = (ingredient: Ingredient, index: number) => {
    setEditIngredient({ ...ingredient });
    setEditIndex(index);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditIngredient(null);
    setEditIndex(null);
  };

  const saveEditIngredient = async () => {
    if (editIngredient && editIndex !== null && editIngredient.name.trim()) {
      const normalizedUnit = normalizeUnit(editIngredient.unit);
      const updatedIngredients = [...ingredients];
      updatedIngredients[editIndex] = {
        ...editIngredient,
        unit: normalizedUnit,
      };
      setIngredients(updatedIngredients);
      await saveMealToDb({ ingredients: updatedIngredients });
    }
    closeEditDialog();
  };

  // Save meal handler (for Save Meal button)
  const saveMeal = async () => {
    await saveMealToDb();
    setMealSaved(true);
    setProgress(1);
    let elapsed = 0;
    const duration = 3000; // 3 seconds
    const interval = 50;
    const step = interval / duration;

    const timer = setInterval(() => {
      elapsed += interval;
      setProgress((prev) => Math.max(0, prev - step));
      if (elapsed >= duration) {
        clearInterval(timer);
        setMealSaved(false);
        setProgress(1);
      }
    }, interval);
  };

  // Save meal on title/description change
  useEffect(() => {
    if (mealKey !== null) {
      saveMealToDb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealTitle, mealDescription]);

  return (
    <Page title="Add Meal" path="/">
      <Stack tokens={{ childrenGap: 20 }}>
        <MealSavedBar
          visible={mealSaved}
          progress={progress}
          onDismiss={() => {
            setMealSaved(false);
            setProgress(1);
          }}
        />
        <Text variant="large">Add new meal</Text>
        <Stack tokens={{ childrenGap: 12 }} style={{ maxWidth: 500 }}>
          <TextField
            label="Meal Title"
            value={mealTitle}
            onChange={(_, v) => setMealTitle(v || "")}
          />
          <TextField
            label="Meal Description"
            value={mealDescription}
            onChange={(_, v) => setMealDescription(v || "")}
            multiline
            rows={3}
          />
        </Stack>
        <Stack
          style={{
            padding: "1rem",
            border: "1px solid #ccc",
            marginTop: "2rem",
          }}
          tokens={{ childrenGap: 16 }}
        >
          <Text variant="large">Meal Ingredients</Text>
          <Stack tokens={{ childrenGap: 12 }}>
            <TextField
              label="Ingredient name"
              value={newIngredient.name}
              onChange={(_, v) =>
                setNewIngredient({ ...newIngredient, name: v || "" })
              }
              styles={{ root: { minWidth: 180 } }}
            />
            <TextField
              label="Quantity"
              type="number"
              value={newIngredient.quantity}
              onChange={(_, v) =>
                setNewIngredient({
                  ...newIngredient,
                  quantity: v?.replace(/[^0-9.]/g, "") || "",
                })
              }
              styles={{ root: { minWidth: 120 } }}
            />
            <TextField
              label="Unit"
              value={newIngredient.unit}
              onChange={(_, v) =>
                setNewIngredient({ ...newIngredient, unit: v || "" })
              }
              styles={{ root: { minWidth: 120 } }}
            />
            <PrimaryButton
              text="Add Ingredient"
              onClick={addIngredient}
              style={{ alignSelf: "end" }}
            />
          </Stack>
          <IngredientList ingredients={ingredients} onEdit={openEditDialog} />
        </Stack>

        <PrimaryButton
          text="Save Meal"
          onClick={saveMeal}
          style={{ marginTop: 24, width: 180 }}
        />

        <EditIngredientDialog
          open={editDialogOpen}
          ingredient={editIngredient}
          onChange={(ingredient) => setEditIngredient(ingredient)}
          onSave={saveEditIngredient}
          onCancel={closeEditDialog}
        />
      </Stack>
    </Page>
  );
};

export default AddMeal;
