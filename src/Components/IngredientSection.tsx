import {
  Stack,
  Text,
  TextField,
  PrimaryButton,
  TooltipHost,
  Label,
  Icon,
  useTheme,
} from "@fluentui/react";
import EditIngredientDialog from "./EditIngredientDialog";
import { Ingredient } from "../Types/Ingredient";
import { INGREDIENT_UNIT_LOOKUP } from "../lib/globalConsts";

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

// Build availableUnits with aliases in brackets
const unitGroups: Record<string, string[]> = {};
Object.entries(INGREDIENT_UNIT_LOOKUP).forEach(([alias, canonical]) => {
  if (!unitGroups[canonical]) unitGroups[canonical] = [];
  unitGroups[canonical].push(alias);
});
const availableUnits = Object.entries(unitGroups)
  .map(
    ([canonical, aliases]) =>
      `${canonical}${
        aliases.length > 1
          ? ` (${aliases.filter((a) => a !== canonical).join(", ")})`
          : ""
      }`
  )
  .join(", ");

const IngredientForm: React.FC<IngredientSectionProps> = ({
  newIngredient,
  setNewIngredient,
  addIngredient,
  editDialogOpen,
  editIngredient,
  setEditIngredient,
  saveEditIngredient,
  closeEditDialog,
}) => {
  const theme = useTheme();

  return (
    <Stack
      style={{
        padding: "1rem",
        border: "1px solid #ccc",
        marginTop: "2rem",
      }}
      tokens={{ childrenGap: 16 }}
    >
      <Text variant="large">Add new ingredient</Text>
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
        <Stack horizontal verticalAlign="end">
          <TextField
            label="Unit"
            value={newIngredient.unit}
            onChange={(_, v) =>
              setNewIngredient({ ...newIngredient, unit: v || "" })
            }
            styles={{ root: { minWidth: 120 } }}
            onRenderLabel={(props) => (
              <Stack horizontal verticalAlign="center">
                <Label>{props?.label}</Label>
                <TooltipHost content={`Available units: ${availableUnits}`}>
                  <Icon
                    iconName="Info"
                    styles={{
                      root: {
                        marginLeft: 8,
                        padding: 0,
                        color: theme.palette.neutralSecondary,
                      },
                    }}
                  />
                </TooltipHost>
              </Stack>
            )}
          />
        </Stack>
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
};

export default IngredientForm;
