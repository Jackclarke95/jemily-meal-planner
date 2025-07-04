import { useState, useEffect } from "react";
import {
  Stack,
  TextField,
  PrimaryButton,
  SpinButton,
  DefaultButton,
  ITag,
  SharedColors,
  NeutralColors,
  IconButton,
  TagPicker,
} from "@fluentui/react";
import IngredientList from "./IngredientList";
import EditIngredientDialog from "./EditIngredientDialog";
import { INGREDIENT_UNIT_LOOKUP } from "../Utils/Consts/INGREDIENT_UNIT_LOOKUP";
import { Ingredient } from "../Types/Ingredient";
import { Meal } from "../Types/Meal";
import { get, push, ref } from "firebase/database";
import { db } from "../lib/firebase";
import { toTitleCase } from "../Utils/Helpers/ToTitleCase";

interface MealFormProps {
  initialName?: string;
  initialServings?: number;
  initialIngredients?: Ingredient[];
  initialTags?: string[];
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
  const [availableTags, setAvailableTags] = useState<ITag[]>([]);
  const [selectedTags, setSelectedTags] = useState<ITag[]>(
    (props.initialTags ?? []).map((t) => ({ key: t, name: t }))
  );

  const [loading, setLoading] = useState(false);

  // Sync state with props if the meal changes (e.g., when editing a different meal)
  useEffect(() => {
    setName(props.initialName ?? "");
    setServings(props.initialServings ?? 1);
    setIngredients(props.initialIngredients ?? []);
    setSelectedTags(
      (props.initialTags ?? []).map((t) => ({ key: t, name: t }))
    );
    // Only show shimmer if editing (props.initialIngredients is not empty)
    if (props.initialIngredients && props.initialIngredients.length > 0) {
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timeout);
    } else {
      setLoading(false);
    }
  }, [
    props.initialName,
    props.initialServings,
    props.initialIngredients,
    props.initialTags,
  ]);

  // Fetch tags from /meal-tags
  useEffect(() => {
    const mealTagsRef = ref(db, "meal-tags");
    get(mealTagsRef).then((snapshot) => {
      const data = snapshot.val();

      // extract value for each key in data object
      if (data) {
        const tags = Object.keys(data).map((key) => ({
          key,
          name: data[key].tag,
        }));
        setAvailableTags(tags);
      }
    });
  }, []);

  // Helper: filter tags for picker
  const filterTags = (
    filterText: string,
    tagList: ITag[] | undefined
  ): ITag[] => {
    if (!filterText || !tagList) return [];
    const filtered = availableTags
      .filter(
        (tag) =>
          tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 &&
          !tagList.some((t) => t.key === tag.key)
      )
      .map((tag) => ({
        ...tag,
        name: toTitleCase(tag.name),
      }));
    // If not found, allow creation
    if (
      filtered.length === 0 &&
      !tagList.some((t) => t.name.toLowerCase() === filterText.toLowerCase())
    ) {
      return [{ key: filterText, name: toTitleCase(filterText) }];
    }
    return filtered;
  };

  // Handle tag selection (create new tag if needed)
  const onTagChange = async (items?: ITag[]) => {
    if (!items) return setSelectedTags([]);
    // Find new tags not in availableTags
    const newTags = items.filter(
      (t) => !availableTags.some((at) => at.key === t.key)
    );
    const mealTagsRef = ref(db, "meal-tags");

    for (const tag of newTags) {
      if (availableTags.some((t) => t.key === tag.key)) {
        continue;
      } else {
        push(mealTagsRef, { tag: tag.name });
      }

      setAvailableTags((prev) => [...prev, tag]);
    }
    setSelectedTags(items);
  };

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editIngredient, setEditIngredient] = useState<Ingredient | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // Save handler
  const handleSave = async (override?: {
    id?: string;
    name?: string;
    servings?: number;
    ingredients?: Ingredient[];
    tags?: string[];
  }) => {
    const meal: Omit<Meal, "id"> = {
      name: (override?.name ?? name).trim() || "Untitled Meal",
      servings: override?.servings ?? servings,
      ingredients: override?.ingredients ?? ingredients,
      tags: override?.tags ? override.tags : selectedTags.map((t) => t.name),
    };
    await props.onSave(meal);
  };

  // Add ingredient via dialog
  const handleAddIngredientClick = () => {
    setEditIngredient({ name: "", quantity: "", unit: "" });
    setEditIndex(null);
    setIsAddMode(true);
    setEditDialogOpen(true);
  };

  // Add or edit ingredient and save meal immediately
  const saveEditIngredient = async () => {
    if (!editIngredient || !editIngredient.name.trim()) {
      setEditDialogOpen(false);
      return;
    }
    const normalizedUnit = normalizeUnit(editIngredient.unit);
    let updatedIngredients = [...ingredients];
    if (isAddMode) {
      updatedIngredients.push({ ...editIngredient, unit: normalizedUnit });
    } else if (editIndex !== null) {
      updatedIngredients[editIndex] = {
        ...editIngredient,
        unit: normalizedUnit,
      };
    }
    setIngredients(updatedIngredients);
    await handleSave({ ingredients: updatedIngredients });
    setEditDialogOpen(false);
    setIsAddMode(false);
    setEditIngredient(null);
    setEditIndex(null);
  };

  // Edit handlers
  const openEditDialog = (ingredient: Ingredient, index: number) => {
    setEditIngredient({ ...ingredient });
    setEditIndex(index);
    setIsAddMode(false);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditIngredient(null);
    setEditIndex(null);
    setIsAddMode(false);
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
        <TagPicker
          onResolveSuggestions={filterTags}
          getTextFromItem={(item) => item.name}
          pickerSuggestionsProps={{
            suggestionsHeaderText: "Available tags",
            noResultsFoundText: "Create new tag",
          }}
          selectedItems={selectedTags}
          onChange={onTagChange}
          inputProps={{ placeholder: "Add tags..." }}
        />
      </Stack>

      {/* Ingredient header with Add button */}
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        style={{ marginTop: 24, marginBottom: 8 }}
      >
        <span style={{ fontWeight: 600, fontSize: 18 }}>Ingredients</span>
        <IconButton
          iconProps={{ iconName: "Add" }}
          title="Add Ingredient"
          ariaLabel="Add Ingredient"
          onClick={handleAddIngredientClick}
          styles={{ root: { marginLeft: "auto" } }}
        />
      </Stack>

      <IngredientList
        ingredients={ingredients}
        onEdit={openEditDialog}
        loading={loading}
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
                backgroundColor: SharedColors.red10,
                color: NeutralColors.white,
                borderColor: SharedColors.red10,
              },
              rootHovered: {
                backgroundColor: SharedColors.red20,
                color: NeutralColors.white,
                borderColor: SharedColors.red20,
              },
              rootPressed: {
                backgroundColor: SharedColors.pinkRed10,
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
