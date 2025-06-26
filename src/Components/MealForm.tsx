import { useState, useEffect } from "react";
import { Stack, TextField, PrimaryButton, SpinButton } from "@fluentui/react";
import IngredientList from "./IngredientList";
import IngredientSection from "./IngredientSection";
import EditIngredientDialog from "./EditIngredientDialog";
import { INGREDIENT_UNIT_LOOKUP } from "../lib/globalConsts";
import { Ingredient } from "../Types/Ingredient";
import { Meal } from "../Types/Meal";

interface MealFormProps {
  initialName?: string;
  initialServings?: number;
  initialIngredients?: Ingredient[];
  onSave: (meal: Meal) => Promise<void>;
  saveOnFieldChange?: boolean;
}

function normalizeUnit(unit: string): string {
  const cleaned = unit.trim().toLowerCase();
  return INGREDIENT_UNIT_LOOKUP[cleaned] || unit;
}

const MealForm: React.FC<MealFormProps> = (props) => {
  const [name, setName] = useState(props.initialName ?? "");
  const [servings, setServings] = useState<number>(props.initialServings ?? 1);
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
    setName(props.initialName ?? "");
    setServings(props.initialServings ?? 1);
    setIngredients(props.initialIngredients ?? []);
  }, [props.initialName, props.initialServings, props.initialIngredients]);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editIngredient, setEditIngredient] = useState<Ingredient | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Save handler
  const handleSave = async (override?: {
    id?: string;
    name?: string;
    servings?: number;
    ingredients?: Ingredient[];
  }) => {
    const meal: Meal = {
      id: override?.id ?? "",
      name: override?.name ?? name,
      servings: override?.servings ?? servings,
      ingredients: override?.ingredients ?? ingredients,
    };
    await props.onSave(meal);
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

  // Save meal on name or servings change (optional)
  // Only for AddMeal, not EditMeal
  const handleNameChange = (_: any, v?: string) => {
    setName(v || "");
    if (props.saveOnFieldChange) handleSave({ name: v || "" });
  };

  const handleServingsChange = (_: any, v?: string) => {
    const num = v === undefined || v.trim() === "" ? 0 : Number(v);
    setServings(num);
    if (props.saveOnFieldChange) handleSave({ servings: num });
  };

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      <Stack tokens={{ childrenGap: 12 }} style={{ maxWidth: 500 }}>
        <TextField label="Meal Name" value={name} onChange={handleNameChange} />
        <SpinButton
          label="Servings"
          value={servings?.toString() ?? ""}
          onChange={handleServingsChange}
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
