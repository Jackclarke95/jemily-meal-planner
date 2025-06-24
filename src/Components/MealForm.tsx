import { useState, useEffect } from "react";
import { Stack, TextField, PrimaryButton } from "@fluentui/react";
import IngredientList from "./IngredientList";
import IngredientSection from "./IngredientSection";
import EditIngredientDialog from "./EditIngredientDialog";
import MealSavedBar from "./MealSavedBar";
import { INGREDIENT_UNIT_LOOKUP } from "../lib/globalConsts";

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  key?: string;
}

interface MealFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialIngredients?: Ingredient[];
  onSave: (
    title: string,
    description: string,
    ingredients: Ingredient[]
  ) => Promise<void>;
  saveOnFieldChange?: boolean;
}

function normalizeUnit(unit: string): string {
  const cleaned = unit.trim().toLowerCase();
  return INGREDIENT_UNIT_LOOKUP[cleaned] || unit;
}

const MealForm: React.FC<MealFormProps> = (props) => {
  const [mealTitle, setMealTitle] = useState(props.initialTitle ?? "");
  const [mealDescription, setMealDescription] = useState(
    props.initialDescription ?? ""
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    props.initialIngredients ?? []
  );
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: "",
    quantity: "",
    unit: "",
  });

  // Sync state with props if the meal changes (e.g., when editing a different meal)
  useEffect(() => {
    setMealTitle(props.initialTitle ?? "");
    setMealDescription(props.initialDescription ?? "");
    setIngredients(props.initialIngredients ?? []);
  }, [props.initialTitle, props.initialDescription, props.initialIngredients]);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editIngredient, setEditIngredient] = useState<Ingredient | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Meal saved bar state
  const [mealSaved, setMealSaved] = useState(false);
  const [progress, setProgress] = useState(1);

  // Save bar logic
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

  // Save handler
  const handleSave = async (override?: {
    title?: string;
    description?: string;
    ingredients?: Ingredient[];
  }) => {
    await props.onSave(
      override?.title ?? mealTitle,
      override?.description ?? mealDescription,
      override?.ingredients ?? ingredients
    );
    showSavedBar();
  };

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
    await handleSave({ ingredients: updatedIngredients });
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
      await handleSave({ ingredients: updatedIngredients });
    }
    closeEditDialog();
  };

  // Save meal on title/description change (optional)
  // Only for AddMeal, not EditMeal
  const handleTitleChange = (_: any, v?: string) => {
    setMealTitle(v || "");
    if (props.saveOnFieldChange) handleSave({ title: v || "" });
  };
  const handleDescriptionChange = (_: any, v?: string) => {
    setMealDescription(v || "");
    if (props.saveOnFieldChange) handleSave({ description: v || "" });
  };

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      <MealSavedBar
        visible={mealSaved}
        progress={progress}
        onDismiss={() => {
          setMealSaved(false);
          setProgress(1);
        }}
      />
      <Stack tokens={{ childrenGap: 12 }} style={{ maxWidth: 500 }}>
        <TextField
          label="Meal Title"
          value={mealTitle}
          onChange={handleTitleChange}
        />
        <TextField
          label="Meal Description"
          value={mealDescription}
          onChange={handleDescriptionChange}
          multiline
          rows={3}
        />
      </Stack>
      <IngredientList ingredients={ingredients} onEdit={openEditDialog} />
      <IngredientSection
        ingredients={ingredients}
        newIngredient={newIngredient}
        setNewIngredient={setNewIngredient}
        addIngredient={addIngredient}
        openEditDialog={openEditDialog}
        editDialogOpen={editDialogOpen}
        editIngredient={editIngredient}
        setEditIngredient={setEditIngredient}
        saveEditIngredient={saveEditIngredient}
        closeEditDialog={closeEditDialog}
      />

      <EditIngredientDialog
        open={editDialogOpen}
        ingredient={editIngredient}
        onChange={setEditIngredient}
        onSave={saveEditIngredient}
        onCancel={closeEditDialog}
      />
      <PrimaryButton
        text="Save Meal"
        onClick={() => handleSave()}
        style={{ marginTop: 24, width: 180 }}
      />
    </Stack>
  );
};

export default MealForm;
