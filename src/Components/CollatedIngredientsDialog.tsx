import {
  Dialog,
  DialogType,
  DialogFooter,
  DefaultButton,
  Stack,
  Text,
} from "@fluentui/react";

interface CollatedIngredientsDialogProps {
  open: boolean;
  onClose: () => void;
  collatedIngredients: { [ingredient: string]: { [unit: string]: number } };
}

const CollatedIngredientsDialog: React.FC<CollatedIngredientsDialogProps> = ({
  open,
  onClose,
  collatedIngredients,
}) => (
  <Dialog
    hidden={!open}
    onDismiss={onClose}
    dialogContentProps={{
      type: DialogType.largeHeader,
      title: "Collated Ingredients",
    }}
    minWidth={400}
  >
    {Object.keys(collatedIngredients).length === 0 ? (
      <Text>No ingredients to display.</Text>
    ) : (
      <Stack tokens={{ childrenGap: 8 }}>
        {Object.entries(collatedIngredients).map(([ingredient, units]) => (
          <div key={ingredient}>
            <b>{ingredient}</b>:{" "}
            {Object.entries(units)
              .map(([unit, qty]) => `${qty} ${unit}`.trim())
              .join(", ")}
          </div>
        ))}
      </Stack>
    )}
    <DialogFooter>
      <DefaultButton onClick={onClose} text="Close" />
    </DialogFooter>
  </Dialog>
);

export default CollatedIngredientsDialog;
