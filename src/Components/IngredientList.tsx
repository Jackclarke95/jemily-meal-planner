import {
  ShimmeredDetailsList,
  IColumn,
  IconButton,
  SelectionMode,
  Stack,
  Text,
} from "@fluentui/react";
import { Ingredient } from "../Types/Ingredient";
import { toTitleCase } from "../Utils/Helpers/ToTitleCase";

interface IngredientListProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient, index: number) => void;
  loading?: boolean; // Optional loading prop
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
      minWidth: 30,
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
      <ShimmeredDetailsList
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
        enableShimmer={props.loading ?? false}
      />
    </Stack>
  );
};

export default IngredientList;
