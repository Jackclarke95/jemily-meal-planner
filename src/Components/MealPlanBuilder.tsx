import { useEffect, useState } from "react";
import {
  Text,
  Stack,
  PrimaryButton,
  DefaultButton,
  Label,
  ShimmeredDetailsList,
  IColumn,
  Selection,
  SelectionMode,
  SpinButton,
} from "@fluentui/react";
import { ref, onValue, push, set } from "firebase/database";
import { db } from "../lib/firebase";
import { Meal } from "../Types/Meal";
import { MEAL_PLURAL_LOOKUP } from "../Utils/Consts/MEAL_PLURAL_LOOKUP";
import { MealType } from "../Types/MealType";

interface PlanMeal {
  id: string;
  name: string;
  servings: number;
}

interface MealPlanBuilderProps {
  mealType: MealType;
  planDbPath: string;
  title: string;
  selectLabel: string;
  noMealsText: string;
  backPath?: string;
}

const MealPlanBuilder: React.FC<MealPlanBuilderProps> = (props) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<PlanMeal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch meals from db
  useEffect(() => {
    const mealsRef = ref(db, props.mealType);
    const unsubscribe = onValue(mealsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const mealList = Object.entries(data).map(
          ([id, meal]: [string, any]) => ({
            ...meal,
            id,
            servings: meal.servings ?? 2,
          })
        );
        setMeals(mealList);
      } else {
        setMeals([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [props.mealType]);

  // Selection for DetailsList
  const selection = new Selection({
    onSelectionChanged: () => {
      const selected = selection.getSelection() as Meal[];
      setSelectedMeals((prev) =>
        selected.map((meal) => {
          const existing = prev.find((m) => m.id === meal.id);
          return {
            id: meal.id,
            name: meal.name,
            servings: existing ? existing.servings : meal.servings ?? 2,
          };
        })
      );
    },
  });

  // Columns for DetailsList
  const columns: IColumn[] = [
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 120,
      isResizable: true,
    },
    {
      key: "servings",
      name: "Default Servings",
      fieldName: "servings",
      minWidth: 80,
      isResizable: true,
      onRender: (item: Meal) => (
        <div style={{ textAlign: "center", width: "100%" }}>
          {item.servings}
        </div>
      ),
    },
  ];

  // Total servings in plan
  const totalServings = selectedMeals.reduce(
    (sum, meal) => sum + meal.servings,
    0
  );

  // Update servings for a selected meal
  const updateServings = (id: string, newServings: number) => {
    setSelectedMeals((prev) =>
      prev.map((meal) =>
        meal.id === id ? { ...meal, servings: newServings } : meal
      )
    );
  };

  // Remove meal from plan
  const removeFromPlan = (id: string) => {
    setSelectedMeals((prev) => prev.filter((m) => m.id !== id));
    // Also unselect in the DetailsList
    const idx = meals.findIndex((d) => d.id === id);
    if (idx !== -1) selection.setIndexSelected(idx, false, false);
  };

  // Save plan to db
  const savePlan = async () => {
    const planRef = ref(db, props.planDbPath);
    const planData = selectedMeals.map((m) => ({
      id: m.id,
      servings: m.servings,
    }));
    await set(push(planRef), planData);
    setSelectedMeals([]);
    selection.setAllSelected(false);
  };

  return (
    <Stack tokens={{ childrenGap: 16 }} style={{ maxWidth: 700 }}>
      <Text>
        Select {MEAL_PLURAL_LOOKUP[props.mealType]} for the week (for 2 people,
        14 servings total). Select meals above, then optionally adjust servings
        below.
      </Text>
      <Label>{props.selectLabel}</Label>
      <ShimmeredDetailsList
        items={meals}
        columns={columns}
        setKey="set"
        selection={selection}
        selectionMode={SelectionMode.multiple}
        enableShimmer={loading}
        styles={{ root: { background: "#fff", borderRadius: 8, padding: 8 } }}
      />
      <Label>Selected Meals & Servings:</Label>
      <Stack tokens={{ childrenGap: 8 }}>
        {selectedMeals.length === 0 && <Text>{props.noMealsText}</Text>}
        {selectedMeals.map((meal) => (
          <Stack
            horizontal
            key={meal.id}
            tokens={{ childrenGap: 8 }}
            verticalAlign="center"
          >
            <Text style={{ minWidth: 180 }}>{meal.name}</Text>
            <SpinButton
              label="Servings"
              min={1}
              value={meal.servings.toString()}
              onChange={(_, val) => updateServings(meal.id, Number(val) || 1)}
              styles={{ root: { minWidth: 100 } }}
            />
            <DefaultButton
              text="Remove"
              onClick={() => removeFromPlan(meal.id)}
            />
          </Stack>
        ))}
      </Stack>
      <Label>Total servings in plan: {totalServings} / 14</Label>
      <PrimaryButton
        text="Save Plan"
        onClick={savePlan}
        disabled={selectedMeals.length === 0 || totalServings < 14}
      />
    </Stack>
  );
};

export default MealPlanBuilder;
