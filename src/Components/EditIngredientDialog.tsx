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
}) => (
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
          ingredient && onChange({ ...ingredient, name: v || "" })
        }
      />
      <TextField
        label="Quantity"
        value={ingredient?.quantity || ""}
        onChange={(_, v) =>
          ingredient && onChange({ ...ingredient, quantity: v || "" })
        }
      />
      <TextField
        label="Unit"
        value={ingredient?.unit || ""}
        onChange={(_, v) =>
          ingredient && onChange({ ...ingredient, unit: v || "" })
        }
      />
    </Stack>
    <DialogFooter>
      <PrimaryButton onClick={onSave} text="Save" />
      <DefaultButton onClick={onCancel} text="Cancel" />
    </DialogFooter>
  </Dialog>
);

export default EditIngredientDialog;
