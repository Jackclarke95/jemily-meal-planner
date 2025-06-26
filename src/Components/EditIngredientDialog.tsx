import {
  Dialog,
  DialogType,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  Stack,
  TextField,
} from "@fluentui/react";
import { Ingredient } from "../Types/Ingredient";
import { toTitleCase } from "../Utils/Helpers/ToTitleCase";

interface EditIngredientDialogProps {
  open: boolean;
  ingredient: Ingredient | null;
  onChange: (ingredient: Ingredient) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditIngredientDialog: React.FC<EditIngredientDialogProps> = ({
  open,
  ingredient,
  onChange,
  onSave,
  onCancel,
}) => {
  const isIngredientValid =
    !!ingredient?.name?.trim() &&
    !!ingredient?.quantity?.toString().trim() &&
    !!ingredient?.unit?.trim();

  // Handle Enter key to save if valid
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isIngredientValid) {
      e.preventDefault();
      onSave();
    }
  };

  return (
    <Dialog
      hidden={!open}
      onDismiss={onCancel}
      dialogContentProps={{
        type: DialogType.normal,
        title: "Edit Ingredient",
      }}
    >
      <Stack tokens={{ childrenGap: 12 }}>
        <TextField
          label="Ingredient name"
          value={ingredient?.name || ""}
          onChange={(_, v) =>
            ingredient &&
            onChange({ ...ingredient, name: toTitleCase(v || "") })
          }
          onKeyDown={handleKeyDown}
        />
        <TextField
          label="Quantity"
          value={ingredient?.quantity || ""}
          onChange={(_, v) =>
            ingredient && onChange({ ...ingredient, quantity: v || "" })
          }
          onKeyDown={handleKeyDown}
        />
        <TextField
          label="Unit"
          value={ingredient?.unit || ""}
          onChange={(_, v) =>
            ingredient && onChange({ ...ingredient, unit: v || "" })
          }
          onKeyDown={handleKeyDown}
        />
      </Stack>
      <DialogFooter>
        <PrimaryButton
          onClick={onSave}
          text="Save"
          disabled={!isIngredientValid}
        />
        <DefaultButton onClick={onCancel} text="Cancel" />
      </DialogFooter>
    </Dialog>
  );
};

export default EditIngredientDialog;
