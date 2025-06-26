import { Stack, Text, TextField, PrimaryButton } from "@fluentui/react";
import EditIngredientDialog from "./EditIngredientDialog";
import { Ingredient } from "../Types/Ingredient";

interface IngredientSectionProps {
  ingredients: Ingredient[];
  newIngredient: Ingredient;
  setNewIngredient: (ingredient: Ingredient) => void;
  addIngredient: () => void;
  openEditDialog: (ingredient: Ingredient, index: number) => void;
  editDialogOpen: boolean;
  editIngredient: Ingredient | null;
  setEditIngredient: (ingredient: Ingredient) => void;
  saveEditIngredient: () => void;
  closeEditDialog: () => void;
}

const IngredientSection: React.FC<IngredientSectionProps> = ({
  newIngredient,
  setNewIngredient,
  addIngredient,
  editDialogOpen,
  editIngredient,
  setEditIngredient,
  saveEditIngredient,
  closeEditDialog,
}) => (
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

    <EditIngredientDialog
      open={editDialogOpen}
      ingredient={editIngredient}
      onChange={setEditIngredient}
      onSave={saveEditIngredient}
      onCancel={closeEditDialog}
    />
  </Stack>
);

export default IngredientSection;
