import { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  PrimaryButton,
  SpinButton,
  DefaultButton,
  SharedColors,
  NeutralColors,
  Dropdown, // Add this import
  IDropdownOption,
  Separator,
} from "@fluentui/react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import EditIngredientDialog from "./EditIngredientDialog";
import { INGREDIENT_UNIT_LOOKUP } from "../Utils/Consts/INGREDIENT_UNIT_LOOKUP";
import { Ingredient } from "../Types/Ingredient";
import { Meal } from "../Types/Meal";

interface MealFormProps {
  initialName?: string;
  initialServings?: number;
  initialIngredients?: Ingredient[];
  onSave: (meal: Omit<Meal, "id">) => Promise<void>;
  onDelete?: (() => void) | (() => Promise<void>);
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
  const [loading, setLoading] = useState(false);

  // Sync state with props if the meal changes (e.g., when editing a different meal)
  useEffect(() => {
    setName(props.initialName ?? "");
    setServings(props.initialServings ?? 1);
    setIngredients(props.initialIngredients ?? []);
    // Only show shimmer if editing (props.initialIngredients is not empty)
    if (props.initialIngredients && props.initialIngredients.length > 0) {
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timeout);
    } else {
      setLoading(false);
    }
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
    const meal: Omit<Meal, "id"> = {
      name: (override?.name ?? name).trim() || "Untitled Meal",
      servings: override?.servings ?? servings,
      ingredients: override?.ingredients ?? ingredients,
    };
    await props.onSave(meal);
  };

  // Add ingredient and save meal immediately
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

  // Save ingredient edit and save meal immediately
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

  // Only update state for name/servings, do not auto-save
  const handleNameChange = (_: any, v?: string) => {
    setName(v || "");
  };

  const handleServingsChange = (_: any, v?: string) => {
    const num = v === undefined || v.trim() === "" ? 0 : Number(v);
    setServings(num);
  };

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Stack tokens={{ childrenGap: 12 }} style={{ maxWidth: 500 }}>
        <TextField label="Meal Name" value={name} onChange={handleNameChange} />
        <SpinButton
          label="Servings"
          value={servings?.toString() ?? ""}
          onChange={handleServingsChange}
        />
      </Stack>

      <IngredientList
        ingredients={ingredients}
        onEdit={openEditDialog}
        loading={loading}
      />
      <Separator />
      <IngredientForm
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
      <Stack horizontal tokens={{ childrenGap: 12 }}>
        <PrimaryButton
          text="Save Meal"
          onClick={() => handleSave()}
          style={{ marginTop: 24, width: 180 }}
        />
        {props.onDelete && (
          <DefaultButton
            text="Delete Meal"
            onClick={props.onDelete}
            style={{ marginTop: 24, width: 180 }}
            styles={{
              root: {
                backgroundColor: SharedColors.red10, // Fluent UI redDark
                color: NeutralColors.white,
                borderColor: SharedColors.red10,
              },
              rootHovered: {
                backgroundColor: SharedColors.red20, // Fluent UI redDarker
                color: NeutralColors.white,
                borderColor: SharedColors.red20,
              },
              rootPressed: {
                backgroundColor: SharedColors.pinkRed10, // Even darker for pressed
                color: NeutralColors.white,
                borderColor: SharedColors.pinkRed10,
              },
            }}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default MealForm;
