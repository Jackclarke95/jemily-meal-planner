import { useEffect, useState } from "react";
import {
  Stack,
  Text,
  PrimaryButton,
  Panel,
  DefaultButton,
} from "@fluentui/react";
import Page from "../Page";
import { ref, onValue, push, set } from "firebase/database";
import { db } from "../../lib/firebase";
import { Meal } from "../../Types/Meal";
import { MealTypes } from "../../Types/MealType";
import MealCard from "../MealCard";
import CollatedIngredientsDialog from "../CollatedIngredientsDialog";
import { collateIngredients } from "../../Utils/Helpers/CollateIngredients";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AddMealPlan: React.FC = () => {
  const [lunches, setLunches] = useState<Meal[]>([]);
  const [dinners, setDinners] = useState<Meal[]>([]);
  const [selectedLunches, setSelectedLunches] = useState<
    (string | undefined)[]
  >(Array(7).fill(undefined));
  const [selectedDinners, setSelectedDinners] = useState<
    (string | undefined)[]
  >(Array(7).fill(undefined));
  const [saving, setSaving] = useState(false);
  const [lunchPanelOpenIdx, setLunchPanelOpenIdx] = useState<number | null>(
    null
  );
  const [dinnerPanelOpenIdx, setDinnerPanelOpenIdx] = useState<number | null>(
    null
  );

  // Collate ingredients dialog state
  const [collateDialogOpen, setCollateDialogOpen] = useState(false);
  const [collatedIngredients, setCollatedIngredients] = useState<{
    [ingredient: string]: { [unit: string]: number };
  }>({});

  // Load meals from Firebase
  useEffect(() => {
    const lunchRef = ref(db, "lunches");
    const dinnerRef = ref(db, "dinners");

    onValue(lunchRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLunches(
          Object.entries(data).map(([id, meal]: [string, any]) => ({
            ...meal,
            id,
          }))
        );
      }
    });

    onValue(dinnerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDinners(
          Object.entries(data).map(([id, meal]: [string, any]) => ({
            ...meal,
            id,
          }))
        );
      }
    });
  }, []);

  // Handle selection
  const handleLunchChange = (index: number, option?: any) => {
    const updated = [...selectedLunches];
    updated[index] = option?.key;
    setSelectedLunches(updated);
  };

  const handleDinnerChange = (index: number, option?: any) => {
    const updated = [...selectedDinners];
    updated[index] = option?.key;
    setSelectedDinners(updated);
  };

  // Collate ingredients from selected meals
  const handleCollateIngredients = () => {
    const selectedMeals = [
      ...selectedLunches
        .map((id) => lunches.find((meal) => meal.id === id))
        .filter(Boolean),
      ...selectedDinners
        .map((id) => dinners.find((meal) => meal.id === id))
        .filter(Boolean),
    ] as Meal[];
    setCollatedIngredients(collateIngredients(selectedMeals));
    setCollateDialogOpen(true);
  };

  // Save meal plan to DB
  const handleSave = async () => {
    setSaving(true);
    const mealPlan = {
      lunches: selectedLunches,
      dinners: selectedDinners,
      createdAt: new Date().toISOString(),
    };
    const mealPlansRef = ref(db, "meal-plans");
    await set(push(mealPlansRef), mealPlan);
    setSaving(false);
    // Optionally, redirect or show a success message
  };

  return (
    <Page title="Add meal plan" backPath="/">
      <Stack tokens={{ childrenGap: 24 }}>
        <Text variant="large">Select meals for each day:</Text>
        <Stack horizontal tokens={{ childrenGap: 40 }}>
          <Stack tokens={{ childrenGap: 16 }}>
            <Text variant="mediumPlus">Lunches</Text>
            {daysOfWeek.map((day, idx) => {
              const selectedMeal = lunches.find(
                (meal) => meal.id === selectedLunches[idx]
              );
              return (
                <Stack key={day} tokens={{ childrenGap: 8 }}>
                  <Text variant="large">{day}</Text>
                  <DefaultButton
                    text={selectedMeal ? "Change Lunch" : "Select Lunch"}
                    onClick={() => setLunchPanelOpenIdx(idx)}
                  />
                  {/* Show selected meal name below the button */}
                  {selectedMeal && (
                    <Text variant="medium">{selectedMeal.name}</Text>
                  )}
                  <Panel
                    isOpen={lunchPanelOpenIdx === idx}
                    onDismiss={() => setLunchPanelOpenIdx(null)}
                    headerText={`Select lunch for ${day}`}
                    closeButtonAriaLabel="Close"
                  >
                    <Stack tokens={{ childrenGap: 10 }}>
                      {lunches.map((meal) => (
                        <div
                          key={meal.id}
                          style={{
                            border:
                              selectedLunches[idx] === meal.id
                                ? "2px solid #0078d4"
                                : "2px solid transparent",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleLunchChange(idx, { key: meal.id });
                            setLunchPanelOpenIdx(null);
                          }}
                        >
                          <MealCard meal={meal} mealType={MealTypes.Lunch} />
                        </div>
                      ))}
                    </Stack>
                  </Panel>
                </Stack>
              );
            })}
          </Stack>
          <Stack tokens={{ childrenGap: 16 }}>
            <Text variant="mediumPlus">Dinners</Text>
            {daysOfWeek.map((day, idx) => {
              const selectedMeal = dinners.find(
                (meal) => meal.id === selectedDinners[idx]
              );
              return (
                <Stack key={day} tokens={{ childrenGap: 8 }}>
                  <Text variant="large">{day}</Text>
                  <DefaultButton
                    text={selectedMeal ? "Change Dinner" : "Select Dinner"}
                    onClick={() => setDinnerPanelOpenIdx(idx)}
                  />
                  {/* Show selected meal name below the button */}
                  {selectedMeal && (
                    <Text variant="medium">{selectedMeal.name}</Text>
                  )}
                  <Panel
                    isOpen={dinnerPanelOpenIdx === idx}
                    onDismiss={() => setDinnerPanelOpenIdx(null)}
                    headerText={`Select dinner for ${day}`}
                    closeButtonAriaLabel="Close"
                  >
                    <Stack tokens={{ childrenGap: 10 }}>
                      {dinners.map((meal) => (
                        <div
                          key={meal.id}
                          style={{
                            border:
                              selectedDinners[idx] === meal.id
                                ? "2px solid #0078d4"
                                : "2px solid transparent",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            handleDinnerChange(idx, { key: meal.id });
                            setDinnerPanelOpenIdx(null);
                          }}
                        >
                          <MealCard meal={meal} mealType={MealTypes.Dinner} />
                        </div>
                      ))}
                    </Stack>
                  </Panel>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
        <PrimaryButton
          text={saving ? "Saving..." : "Save meal plan"}
          disabled={saving}
          onClick={handleSave}
        />
        <DefaultButton
          text="View ingredients"
          onClick={handleCollateIngredients}
          style={{ marginTop: 12 }}
        />
        <CollatedIngredientsDialog
          open={collateDialogOpen}
          onClose={() => setCollateDialogOpen(false)}
          collatedIngredients={collatedIngredients}
        />
      </Stack>
    </Page>
  );
};

export default AddMealPlan;
