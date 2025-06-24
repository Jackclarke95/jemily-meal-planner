import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, get, update } from "firebase/database";
import { db } from "../../lib/firebase";
import { Stack, Text, TextField, PrimaryButton } from "@fluentui/react";
import IngredientList from "../IngredientList";
import EditIngredientDialog from "../EditIngredientDialog";
import MealSavedBar from "../MealSavedBar";
import { INGREDIENT_UNIT_LOOKUP } from "../../lib/globalConsts";
import Page from "../Page";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  key?: string;
}

function normalizeUnit(unit: string): string {
  const cleaned = unit.trim().toLowerCase();
  return INGREDIENT_UNIT_LOOKUP[cleaned] || unit;
}

const EditMeal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  // Meal saved bar state
  const [mealSaved, setMealSaved] = useState(false);
  const [progress, setProgress] = useState(1);

  // Load meal data once on mount
  useEffect(() => {
    if (!id) return;
    const mealRef = ref(db, `meals/${id}`);
    get(mealRef).then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMealTitle(data.title || "");
        setMealDescription(data.description || "");
        setIngredients(data.ingredients || []);
      }
    });
  }, [id]);

  // Save meal to DB
  const saveMealToDb = useCallback(
    async (
      override?: Partial<{
        title: string;
        description: string;
        ingredients: Ingredient[];
      }>
    ) => {
      if (!id) return;
      const mealData = {
        title: override?.title ?? mealTitle,
        description: override?.description ?? mealDescription,
        ingredients: override?.ingredients ?? ingredients,
        updatedAt: new Date().toISOString(),
      };
      const mealRef = ref(db, `meals/${id}`);
      await update(mealRef, mealData);
    },
    [id, mealTitle, mealDescription, ingredients]
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
    showSavedBar();
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
      showSavedBar();
    }
    closeEditDialog();
  };

  // Save meal handler (for Save Meal button)
  const saveMeal = async () => {
    await saveMealToDb();
    showSavedBar();
  };

  // Show the saved bar with progress
  const showSavedBar = () => {
    setMealSaved(true);
    setProgress(1);
    let elapsed = 0;
    const duration = 3000;
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

  return (
    <Page title="Edit Meal" path={"/meals"}>
      <Stack tokens={{ childrenGap: 20 }}>
        <MealSavedBar
          visible={mealSaved}
          progress={progress}
          onDismiss={() => {
            setMealSaved(false);
            setProgress(1);
          }}
        />
        <Text variant="large">Edit meal</Text>
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

export default EditMeal;
