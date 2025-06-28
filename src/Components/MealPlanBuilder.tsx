import { useEffect, useState } from "react";
import {
  Text,
  Stack,
  PrimaryButton,
  Label,
  ShimmeredDetailsList,
  IColumn,
  Selection,
  SelectionMode,
  SpinButton,
  MessageBar,
  MessageBarType,
  IconButton,
  TextField,
} from "@fluentui/react";
import { ref, onValue, push, set } from "firebase/database";
import { db } from "../lib/firebase";
import { Meal } from "../Types/Meal";
import { MEAL_PLURAL_LOOKUP } from "../Utils/Consts/MEAL_PLURAL_LOOKUP";
import { MealType } from "../Types/MealType";
import { DAYS_OF_WEEK } from "../Utils/Consts/DAYS_OF_WEEK";
import { MealPlan } from "../Types/MealPlan";

interface MealPlanBuilderProps {
  mealType: MealType;
  mealPlan?: MealPlan; // <-- Add this
}

const MealPlanBuilder: React.FC<MealPlanBuilderProps> = (props) => {
  const { mealPlan } = props;

  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [planName, setPlanName] = useState(mealPlan?.name || "");

  // Per-day servings state, using DAYS_OF_WEEK
  const [dayServings, setDayServings] = useState<{ [key: string]: number }>(
    () => {
      if (mealPlan && mealPlan.servingsOverride) {
        return Object.fromEntries(
          DAYS_OF_WEEK.map((day) => [
            day,
            mealPlan.servingsOverride?.[day]?.[props.mealType] ?? 2,
          ])
        );
      }
      return Object.fromEntries(DAYS_OF_WEEK.map((day) => [day, 2]));
    }
  );

  // Calculate total required servings for the week
  const totalRequiredServings = Object.values(dayServings).reduce(
    (sum, val) => sum + val,
    0
  );

  // Fetch meals from db
  useEffect(() => {
    const mealsRef = ref(db, MEAL_PLURAL_LOOKUP[props.mealType]);
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

  // Load plan data if editing or when meals are loaded
  useEffect(() => {
    if (mealPlan) {
      setPlanName(mealPlan.name);
      setSelectedMeals(
        mealPlan.meals.map((m) => {
          const found = meals.find((meal) => meal.id === m.id);
          return {
            id: m.id,
            name: found?.name ?? "",
            servings: m.servings,
            ingredients: found?.ingredients ?? [],
          };
        })
      );
      setDayServings(
        Object.fromEntries(
          DAYS_OF_WEEK.map((day) => [
            day,
            mealPlan.servingsOverride?.[day]?.[props.mealType] ?? 2,
          ])
        )
      );
    } else {
      setPlanName("");
      setSelectedMeals([]);
      setDayServings(Object.fromEntries(DAYS_OF_WEEK.map((day) => [day, 2])));
    }
    // eslint-disable-next-line
  }, [mealPlan, meals, props.mealType]);

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
            ingredients: meal.ingredients ?? [],
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
      name: "Servings",
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

  // Save plan to db using MealPlan type (without id field in the object)
  const savePlan = async () => {
    const planRef = ref(db, `${props.mealType}-plans`);
    const planToSave: Omit<MealPlan, "id"> = {
      name: planName,
      meals: selectedMeals.map((m) => ({
        id: m.id,
        servings: m.servings,
      })),
      servingsOverride: Object.fromEntries(
        Object.entries(dayServings).map(([day, servings]) => [
          day,
          { [props.mealType]: servings },
        ])
      ),
    };
    if (mealPlan?.id) {
      // Update existing
      await set(ref(db, `${props.mealType}-plans/${mealPlan.id}`), planToSave);
      // Do NOT reset state when editing
    } else {
      // Create new
      await set(push(planRef), planToSave);
      // Reset state only when adding a new plan
      setSelectedMeals([]);
      setPlanName("");
      selection.setAllSelected(false);
      setDayServings(() =>
        Object.fromEntries(DAYS_OF_WEEK.map((day) => [day, 2]))
      );
    }
  };

  // Handler for per-day servings change
  const handleDayServingsChange = (
    day: string,
    value: string | number | undefined
  ) => {
    const num = typeof value === "string" ? parseInt(value) : value;
    setDayServings((prev) => ({
      ...prev,
      [day]: isNaN(num as number) ? 0 : (num as number),
    }));
  };

  const spinButtonInputWidth = 32;
  const spinButtonTotalWidth = spinButtonInputWidth + 14;

  return (
    <Stack tokens={{ childrenGap: 16 }} style={{ maxWidth: 700 }}>
      {/* Add plan name field */}
      <TextField
        label="Meal plan name"
        value={planName}
        onChange={(_, val) => setPlanName(val || "")}
        required
        styles={{ root: { maxWidth: 350 } }}
      />
      <Stack tokens={{ childrenGap: 8 }} verticalAlign="center">
        <Label styles={{ root: { minWidth: 120 } }}>Servings per day:</Label>
        <Stack
          horizontal
          horizontalAlign="space-between"
          tokens={{ childrenGap: 4 }}
        >
          {DAYS_OF_WEEK.map((day, idx) => {
            return (
              <Stack key={day}>
                <Label styles={{ root: { minWidth: 30, textAlign: "center" } }}>
                  {day[0].toUpperCase()}
                </Label>
                <SpinButton
                  min={0}
                  value={dayServings[day].toString()}
                  onChange={(_, val) => handleDayServingsChange(day, val)}
                  styles={{
                    root: {
                      width: spinButtonTotalWidth,
                      minWidth: 0,
                      maxWidth: spinButtonTotalWidth,
                      marginRight: idx === DAYS_OF_WEEK.length - 1 ? 0 : 4,
                      flexShrink: 1,
                    },
                    input: {
                      padding: 0,
                      width: spinButtonInputWidth,
                      minWidth: 0,
                      maxWidth: spinButtonInputWidth,
                      textAlign: "center",
                      fontSize: 13,
                      flexShrink: 1,
                    },
                    spinButtonWrapper: {
                      width: spinButtonTotalWidth,
                      minWidth: 0,
                      maxWidth: spinButtonTotalWidth,
                      flexShrink: 1,
                    },
                    labelWrapper: { display: "flex", justifyContent: "center" },
                  }}
                  incrementButtonAriaLabel={`Increase servings for ${day}`}
                  decrementButtonAriaLabel={`Decrease servings for ${day}`}
                />
              </Stack>
            );
          })}
        </Stack>
        <Text styles={{ root: { marginLeft: 16, fontWeight: 600 } }}>
          Total needed: {totalRequiredServings}
        </Text>
      </Stack>

      <ShimmeredDetailsList
        items={meals}
        columns={columns}
        setKey="set"
        selection={selection}
        selectionMode={SelectionMode.multiple}
        enableShimmer={loading}
        styles={{ root: { background: "#fff", borderRadius: 8, padding: 8 } }}
      />
      <Label>Selected meals & servings:</Label>
      <Stack tokens={{ childrenGap: 8 }}>
        {selectedMeals.length === 0 && <Text>No meals selected</Text>}
        {selectedMeals.map((meal) => (
          <Stack
            horizontal
            key={meal.id}
            tokens={{ childrenGap: 8 }}
            verticalAlign="center"
            styles={{ root: { alignItems: "center" } }}
          >
            <Text style={{ flexGrow: 1, minWidth: 0 }}>{meal.name}</Text>
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 4 }}
              styles={{
                root: {
                  minWidth: 110,
                  maxWidth: 120,
                  justifyContent: "flex-end",
                },
              }}
            >
              <SpinButton
                min={1}
                value={meal.servings.toString()}
                onChange={(_, val) => updateServings(meal.id, Number(val) || 1)}
                styles={{
                  root: { minWidth: 50 },
                  input: {
                    padding: 0,
                    width: spinButtonInputWidth,
                    minWidth: 0,
                    maxWidth: spinButtonInputWidth,
                    textAlign: "center",
                    fontSize: 13,
                    flexShrink: 1,
                  },
                  spinButtonWrapper: {
                    width: spinButtonTotalWidth,
                    minWidth: 0,
                    maxWidth: spinButtonTotalWidth,
                    flexShrink: 1,
                  },
                }}
              />
              <IconButton
                iconProps={{ iconName: "Delete" }}
                title="Remove"
                ariaLabel="Remove"
                onClick={() => removeFromPlan(meal.id)}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
      <Label>
        Total servings in plan: {totalServings} / {totalRequiredServings}
      </Label>
      {totalServings < totalRequiredServings && (
        <MessageBar messageBarType={MessageBarType.warning}>
          Not enough meals for required servings.
        </MessageBar>
      )}
      {totalServings > totalRequiredServings && (
        <MessageBar messageBarType={MessageBarType.warning}>
          Too many meals selected for required servings.
        </MessageBar>
      )}
      <PrimaryButton
        text="Save plan"
        onClick={savePlan}
        disabled={
          !planName.trim() ||
          selectedMeals.length === 0 ||
          totalServings !== totalRequiredServings
        }
      />
    </Stack>
  );
};

export default MealPlanBuilder;
