import {
  DetailsList,
  IColumn,
  IconButton,
  SelectionMode,
  Stack,
  Text,
} from "@fluentui/react";
import { Ingredient } from "../Types/Ingredient";
import { toTitleCase } from "../Utils/Helpers/ToTitleCase"; // <-- Import the helper

interface IngredientListProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient, index: number) => void;
}

const IngredientList: React.FC<IngredientListProps> = (props) => {
  const columns: IColumn[] = [
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 100,
      isResizable: true,
      onRender: (item: Ingredient) => <span>{toTitleCase(item.name)}</span>,
    },
    {
      key: "quantityUnit",
      name: "Quantity",
      minWidth: 60,
      isResizable: true,
      onRender: (item: Ingredient) => (
        <span>
          {item.quantity} {item.unit}
        </span>
      ),
    },
    {
      key: "edit",
      name: "",
      minWidth: 60,
      isResizable: false,
      onRender: (item: Ingredient, index?: number) => (
        <IconButton
          iconProps={{ iconName: "Edit" }}
          title="Edit"
          ariaLabel="Edit"
          onClick={() => props.onEdit(item, index ?? 0)}
        />
      ),
    },
  ];

  return (
    <Stack>
      <Text variant="mediumPlus">Ingredients</Text>
      <DetailsList
        items={props.ingredients}
        columns={columns.map((col) =>
          col.key === "edit"
            ? { ...col, onRender: (item, idx) => col.onRender?.(item, idx) }
            : col
        )}
        setKey="set"
        styles={{ root: { marginTop: 16 } }}
        compact={true}
        selectionMode={SelectionMode.none}
      />
    </Stack>
  );
};

export default IngredientList;
